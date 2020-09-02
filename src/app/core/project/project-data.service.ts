import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { combineLatest, Observable, of as observableOf } from 'rxjs';
import { catchError, distinctUntilChanged, filter, flatMap, map, switchMap, take, tap } from 'rxjs/operators';
import { ReplaceOperation } from 'fast-json-patch';

import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { Community } from '../shared/community.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { PaginatedList } from '../data/paginated-list';
import { RemoteData } from '../data/remote-data';
import { FindListOptions, PostRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { CommunityDataService } from '../data/community-data.service';
import { ErrorResponse, RestResponse } from '../cache/response.models';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { SortDirection, SortOptions } from '../cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { SearchResult } from '../../shared/search/search-result.model';
import {
  configureRequest,
  getFinishedRemoteData,
  getFirstSucceededRemoteDataPayload,
  getResponseFromEntry
} from '../shared/operators';
import { DSpaceObjectType } from '../shared/dspace-object-type.model';
import { SearchService } from '../shared/search/search.service';
import { LinkService } from '../cache/builders/link.service';
import { createFailedRemoteDataObject$ } from '../../shared/remote-data.utils';
import { environment } from '../../../environments/environment';
import { followLink } from '../../shared/utils/follow-link-config.model';

export const PROJECT_TEMPLATE_NAME = 'project-template';
export const PROJECTS_COMMUNITY_NAME = 'projects';

@Injectable()
export class ProjectDataService extends CommunityDataService {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Community>,
    protected searchService: SearchService,
    protected linkService: LinkService,
  ) {
    super(requestService, rdbService, store, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Create a new project from project template
   *
   * @param name   Group we want to add subgroup to
   * @return Observable<RemoteData<Community>>
   *   The project created
   */
  createProject(name: string): Observable<RemoteData<Community>> {

    const requestId = this.requestService.generateRequestId();
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;
    const template$ = this.getProjectTemplate();
    const projects$ = this.getCommunityProjects();
    const href$ = this.getEndpoint();
    combineLatest([template$, href$, projects$]).pipe(
      map(([template, href, projects]: [Community, string, Community]) => {
        const hrefWithParent = `${href}?parent=${projects.id}`
        return new PostRequest(requestId, hrefWithParent, template.self, options);
      }),
      configureRequest(this.requestService)
    ).subscribe()

    return this.fetchCreateResponse(requestId).pipe(
      getFirstSucceededRemoteDataPayload(),
      flatMap((project: Community) => this.patchProjectName(name, project)),
      catchError((error: Error) => {
        this.notificationsService.error('Server Error:', error.message);
        return createFailedRemoteDataObject$() as Observable<RemoteData<Community>>
      })
    );
  }

  protected fetchCreateResponse(requestId: string): Observable<RemoteData<Community>> {
    // Resolve self link for new object
    const selfLink$ = this.requestService.getByUUID(requestId).pipe(
      getResponseFromEntry(),
      map((response: RestResponse) => {
        if (!response.isSuccessful && response instanceof ErrorResponse) {
          throw new Error(response.errorMessage);
        } else {
          return response;
        }
      }),
      map((response: any) => {
        if (isNotEmpty(response.resourceSelfLinks)) {
          return response.resourceSelfLinks[0];
        }
      }),
      distinctUntilChanged()
    ) as Observable<string>;

    return selfLink$.pipe(
      switchMap((selfLink: string) => this.findByHref(selfLink)),
    )
  }

  /**
   * Perform a patch operation to change the project name
   * @param name
   * @param project
   * @protected
   */
  protected patchProjectName(name: string, project: Community): Observable<RemoteData<Community>> {
    const operation: ReplaceOperation<string> = {
      path: '/metadata/dc.title/0',
      op: 'replace',
      value: name
    };

    return this.patch(project, [operation]).pipe(
      flatMap( () => this.findById(project.id, followLink('parentCommunity'))),
      getFinishedRemoteData()
    );
  }

  /**
   * Get the first project template available
   *
   * @return Observable<Community>
   */
  getProjectTemplate(): Observable<Community> {
    return this.searchCommunityById(environment.projects.projectTemplateUUID);
  }

  /**
   * Get community that contains all projects
   *
   * @return Observable<Community>
   */
  getCommunityProjects(): Observable<Community> {
    return this.searchCommunityById(environment.projects.communityProjectsUUID);
  }

  /**
   * Get all authorized projects
   *
   * @return Observable<RemoteData<PaginatedList<Community>>>
   */
  findAllAuthorizedProjects(findListOptions: FindListOptions = {}): Observable<RemoteData<PaginatedList<Community>>> {
    return this.getCommunityProjects().pipe(
      flatMap((projects) => this.findAllByHref(projects._links.subcommunities.href, findListOptions))
    );
  }

  /**
   * Search a community by name
   *
   * @return Observable<Community>
   */
  private searchCommunityById(id: string): Observable<Community> {
    const sort = new SortOptions('dc.title', SortDirection.ASC);
    const pagination = new PaginationComponentOptions()
    const searchOptions = new PaginatedSearchOptions({
      configuration: 'default',
      query: 'search.resourceid:' + id,
      dsoTypes: [DSpaceObjectType.COMMUNITY],
      pagination: pagination,
      sort: sort
    });

    return this.searchService.search(searchOptions).pipe(
      filter((rd: RemoteData<PaginatedList<SearchResult<any>>>) => rd.hasSucceeded),
      map((rd: RemoteData<PaginatedList<SearchResult<any>>>) => {
        const dsoPage: any[] = rd.payload.page
          .filter((result) => hasValue(result))
          .map((searchResult: SearchResult<any>) => observableOf(searchResult.indexableObject));
        const payload = Object.assign(rd.payload, { page: dsoPage }) as PaginatedList<any>;
        return Object.assign(rd, { payload: payload });
      }),
      map((rd: RemoteData<PaginatedList<Observable<Community>>>) => rd.payload),
      filter((list: PaginatedList<Observable<Community>>) => list.page.length > 0),
      flatMap((list: PaginatedList<Observable<Community>>) => (list.page[0]).pipe(
        map((community: Community) => community)
      )),
      filter((community: Community) => isNotEmpty(community)),
      take(1),
      tap(() => this.requestService.removeByHrefSubstring(id)),
      distinctUntilChanged()
    );
  }
}
