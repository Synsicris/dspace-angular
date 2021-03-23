import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { combineLatest, Observable, of as observableOf, throwError } from 'rxjs';
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  mergeMap,
  reduce,
  take,
  takeWhile,
  tap
} from 'rxjs/operators';
import { ReplaceOperation } from 'fast-json-patch';

import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { Community } from '../shared/community.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { FindListOptions, PostRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { CommunityDataService } from '../data/community-data.service';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { SortDirection, SortOptions } from '../cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { SearchResult } from '../../shared/search/search-result.model';
import {
  configureRequest,
  getFinishedRemoteData,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
  getFirstSucceededRemoteListPayload
} from '../shared/operators';
import { DSpaceObjectType } from '../shared/dspace-object-type.model';
import { SearchService } from '../shared/search/search.service';
import { LinkService } from '../cache/builders/link.service';
import { createFailedRemoteDataObject$, createNoContentRemoteDataObject } from '../../shared/remote-data.utils';
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { ConfigurationDataService } from '../data/configuration-data.service';
import { ConfigurationProperty } from '../shared/configuration-property.model';
import { GroupDataService } from '../eperson/group-data.service';
import { Group } from '../eperson/models/group.model';
import { BitstreamDataService } from '../data/bitstream-data.service';
import { NoContent } from '../shared/NoContent.model';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';
import { PageInfo } from '../shared/page-info.model';

export enum ProjectGrantsTypes {
  Project = 'project',
  Subproject = 'subproject',
}

@Injectable()
export class ProjectDataService extends CommunityDataService {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected bitstreamDataService: BitstreamDataService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Community>,
    protected searchService: SearchService,
    protected linkService: LinkService,
    protected configurationService: ConfigurationDataService,
    protected groupDataService: GroupDataService,
  ) {
    super(requestService, rdbService, store, objectCache, halService, notificationsService, bitstreamDataService, http, comparator);
  }

  /**
   * Create a new project from project template
   *
   * @param name   Group we want to add subgroup to
   * @return Observable<RemoteData<Community>>
   *   The project created
   */
  createProject(name: string): Observable<RemoteData<Community>> {
    const template$ = this.getProjectTemplateUrl();
    const projectsCommunity$ = this.getCommunityProjects();
    return this.fetchCreate(name, template$, projectsCommunity$);
  }

  /**
   * Create a new project from project template
   *
   * @param name       The subproject name
   * @param projectId  The parent project id
   * @param grants     The grants to for the subproject to create
   * @return Observable<RemoteData<Community>>
   *   The project created
   */
  createSubproject(name: string, projectId: string, grants: ProjectGrantsTypes): Observable<RemoteData<Community>> {
    const template$ = this.getSubprojectTemplateUrl();
    const subprojectsCommunity$ = this.getSubprojectCommunityByParentProjectUUID(projectId);
    return this.fetchCreate(name, template$, subprojectsCommunity$, grants);
  }


  /**
   * Fetch a create community request
   *
   * @return Observable<Community>
   */
  private fetchCreate(name: string, template: Observable<string>, parentCommunity: Observable<Community>, grants?: ProjectGrantsTypes): Observable<RemoteData<Community>> {

    const requestId = this.requestService.generateRequestId();
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;
    const href$ = this.getEndpoint();
    combineLatest([template, href$, parentCommunity]).pipe(
      map(([templateUrl, href, projects]: [string, string, Community]) => {
        let hrefWithParent = `${href}?parent=${projects.id}&name=${name}`;
        if (isNotEmpty(grants)) {
          hrefWithParent = hrefWithParent + `&grants=${grants}`;
        }
        return new PostRequest(requestId, hrefWithParent, templateUrl, options);
      }),
      configureRequest(this.requestService),
    ).subscribe();

    return this.fetchCreateResponse(requestId).pipe(
      getFinishedRemoteData(),
      take(1),
      catchError((error: Error) => {
        this.notificationsService.error('Server Error:', error.message);
        return createFailedRemoteDataObject$() as Observable<RemoteData<Community>>;
      })
    );
  }

  /**
   * Delete an existing project on the server
   * @param projectId The project id to be removed
   *
   * @return the RestResponse as an Observable
   */
  delete(projectId: string): Observable<any> {
    const projectGroup = `project_${projectId}`;
    return super.delete(projectId).pipe(
      getFirstCompletedRemoteData(),
      mergeMap((response: RemoteData<NoContent>) => {
        if (response.isSuccess) {
          return this.groupDataService.searchGroups(projectGroup);
        } else {
          throwError('Unexpected error while deleting project.');
        }
      }),
      getFirstSucceededRemoteListPayload(),
      map((groups: Group[]) => {
        if (groups.length === 2) {
          return groups;
        } else {
          throw new Error('Unexpected error while retrieving project group.');
        }
      }),
      mergeMap((groups: Group[]) => groups),
      concatMap((group: Group) => this.groupDataService.delete(group.id).pipe(
        getFirstCompletedRemoteData(),
        map((response: RemoteData<NoContent>) => {
          // TODO review when https://4science.atlassian.net/browse/CST-3907 is resolved
          if (response.isSuccess || response.statusCode === 403) {
            return response;
          } else {
            throwError('Unexpected error while deleting project group.');
          }
        })
      )),
      reduce((acc: any, value: any) => [...acc, value], []),
      tap((r) => console.log(r)),
      mapTo((createNoContentRemoteDataObject() as RemoteData<NoContent>)),
      catchError(() => {
        return createFailedRemoteDataObject$('Unexpected error while deleting project group.');
      })
    );
  }

  /**
   * Get the first project template available
   *
   * @return Observable<Community>
   */
  getProjectTemplate(): Observable<Community> {
    return this.configurationService.findByPropertyName('project.template-id').pipe(
      getFirstSucceededRemoteDataPayload(),
      mergeMap((conf: ConfigurationProperty) => this.searchCommunityById(conf.values[0])),
      map((community) => {
        if (isNotEmpty(community)) {
          return community;
        } else {
          throw new Error('Community Projects does not exist');
        }
      })
    );
  }

  /**
   * Get the first project template available
   *
   * @return Observable<Community>
   */
  getProjectTemplateUrl(): Observable<string> {
    return this.configurationService.findByPropertyName('project.template-id').pipe(
      getFirstSucceededRemoteDataPayload(),
      mergeMap((conf: ConfigurationProperty) => this.getEndpoint().pipe(
        map((href) => href + '/' + conf.values[0])
      )));
  }

  /**
   * Get the first subproject template available
   *
   * @return Observable<Community>
   */
  getSubprojectTemplateUrl(): Observable<string> {
    return this.configurationService.findByPropertyName('subproject.template-id').pipe(
      getFirstSucceededRemoteDataPayload(),
      mergeMap((conf: ConfigurationProperty) => this.getEndpoint().pipe(
        map((href) => href + '/' + conf.values[0])
      )));
  }

  /**
   * Get community that contains all projects
   *
   * @return Observable<Community>
   */
  getCommunityProjects(): Observable<Community> {
    return this.configurationService.findByPropertyName('project.parent-community-id').pipe(
      getFirstSucceededRemoteDataPayload(),
      mergeMap((conf: ConfigurationProperty) => this.searchCommunityById(
        conf.values[0],
        '',
        followLink('parentCommunity'),
        followLink('subcommunities')
      )),
      map((community) => {
        if (isNotEmpty(community)) {
          return community;
        } else {
          throw new Error('Community Projects does not exist');
        }
      })
    );
  }

  /**
   * Get community that contains all projects
   *
   * @return Observable<Community>
   */
  getSubprojectCommunityByParentProjectUUID(projectId: string): Observable<Community> {
    return this.configurationService.findByPropertyName('project.subproject-community-name').pipe(
      getFirstSucceededRemoteDataPayload(),
      mergeMap((conf: ConfigurationProperty) => this.searchCommunityByName(
        conf.values[0],
        projectId
      )),
      map((community) => {
        if (isNotEmpty(community)) {
          return community;
        } else {
          throw new Error('Community Projects does not exist');
        }
      })
    );
  }

  /**
   * Retrieve subproject by parent project
   *
   * @param projectId
   * @param options
   * @return Observable<PaginatedList<Community>>
   */
  retrieveSubprojectsByParentProjectUUID(projectId: string, options: PageInfo): Observable<PaginatedList<Community>> {
    return this.getSubprojectCommunityByParentProjectUUID(projectId).pipe(
      mergeMap((subprojectCommunity: Community) => {
        const sort = new SortOptions('dc.title', SortDirection.ASC);
        const pagination = Object.assign(new PaginationComponentOptions(), {
          currentPage: options.currentPage,
          pageSize: options.elementsPerPage
        });
        const searchOptions = new PaginatedSearchOptions({
          configuration: 'default',
          scope: subprojectCommunity.uuid,
          pagination: pagination,
          sort: sort,
          dsoTypes: [DSpaceObjectType.COMMUNITY]
        });

        return this.searchService.search(searchOptions).pipe(
          filter((rd: RemoteData<PaginatedList<SearchResult<any>>>) => rd.hasSucceeded),
          map((rd: RemoteData<PaginatedList<SearchResult<any>>>) => {
            const dsoPage: any[] = rd.payload.page
              .filter((result) => hasValue(result))
              .map((searchResult: SearchResult<any>) => searchResult.indexableObject);
            const payload = Object.assign(rd.payload, { page: dsoPage }) as PaginatedList<any>;
            return Object.assign(rd, { payload: payload });
          }),
          getFirstSucceededRemoteDataPayload(),
          distinctUntilChanged()
        );
      })
    );

  }
  /**
   * Get all authorized projects
   *
   * @return Observable<RemoteData<PaginatedList<Community>>>
   */
  findAllAuthorizedProjects(findListOptions: FindListOptions = {}): Observable<RemoteData<PaginatedList<Community>>> {
    return this.getCommunityProjects().pipe(
      mergeMap((projects) => this.findAllByHref(projects._links.subcommunities.href, findListOptions))
    );
  }

  protected fetchCreateResponse(requestId: string): Observable<RemoteData<Community>> {
    const result$ = this.rdbService.buildFromRequestUUID<Community>(requestId, followLink('parentCommunity'));

    // TODO a dataservice is not the best place to show a notification,
    // this should move up to the components that use this method
    result$.pipe(
      takeWhile((rd: RemoteData<Community>) => rd.isLoading, true)
    ).subscribe((rd: RemoteData<Community>) => {
      if (rd.hasFailed) {
        this.notificationsService.error('Server Error:', rd.errorMessage, new NotificationOptions(-1));
      }
    });

    return result$;
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
      mergeMap(() => this.findById(project.id, true, followLink('parentCommunity'))),
      getFinishedRemoteData()
    );
  }

  /**
   * Search a community by id
   *
   * @return Observable<Community>
   */
  private searchCommunityById(id: string, scope: string = '', ...linksToFollow: FollowLinkConfig<Community>[]): Observable<Community> {
    const sort = new SortOptions('dc.title', SortDirection.ASC);
    const pagination = new PaginationComponentOptions();
    const searchOptions = new PaginatedSearchOptions({
      configuration: 'default',
      query: 'search.resourceid:' + id,
      dsoTypes: [DSpaceObjectType.COMMUNITY],
      pagination: pagination,
      sort: sort,
      scope: scope
    });

    return this.fetchSearchCommunity(searchOptions, ...linksToFollow);
  }

  /**
   * Search a community by name
   *
   * @return Observable<Community>
   */
  private searchCommunityByName(name: string, scope: string = '', ...linksToFollow: FollowLinkConfig<Community>[]): Observable<Community> {
    const sort = new SortOptions('dc.title', SortDirection.ASC);
    const pagination = new PaginationComponentOptions();
    const searchOptions = new PaginatedSearchOptions({
      configuration: 'default',
      query: 'dc.title:' + name,
      dsoTypes: [DSpaceObjectType.COMMUNITY],
      pagination: pagination,
      sort: sort,
      scope: scope
    });

    return this.fetchSearchCommunity(searchOptions, ...linksToFollow);
  }

  /**
   * Fetch a search request
   *
   * @return Observable<Community>
   */
  private fetchSearchCommunity(searchOptions: PaginatedSearchOptions, ...linksToFollow: FollowLinkConfig<Community>[]): Observable<Community> {
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
      mergeMap((list: PaginatedList<Observable<Community>>) => {
        if (list.page.length > 0) {
          return (list.page[0]).pipe(
            map((community: Community) => community),
            mergeMap((community: Community) => this.findById(community.id, true, ...linksToFollow).pipe(
              tap(() => this.requestService.removeByHrefSubstring(community.id))
            )),
            getFirstSucceededRemoteDataPayload()
          );
        } else {
          return observableOf(null);
        }
      }),
      take(1),
      distinctUntilChanged()
    );
  }
}
