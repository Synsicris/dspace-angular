import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { combineLatest, Observable, of as observableOf } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
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
  getFinishedRemoteData,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  sendRequest
} from '../shared/operators';
import { DSpaceObjectType } from '../shared/dspace-object-type.model';
import { SearchService } from '../shared/search/search.service';
import { LinkService } from '../cache/builders/link.service';
import { createFailedRemoteDataObject$ } from '../../shared/remote-data.utils';
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { ConfigurationDataService } from '../data/configuration-data.service';
import { ConfigurationProperty } from '../shared/configuration-property.model';
import { GroupDataService } from '../eperson/group-data.service';
import { BitstreamDataService } from '../data/bitstream-data.service';
import { NoContent } from '../shared/NoContent.model';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';
import { PageInfo } from '../shared/page-info.model';
import { Item } from '../shared/item.model';
import { Metadata } from '../shared/metadata.utils';
import { ItemDataService } from '../data/item-data.service';

export const PARENT_PROJECT_RELATION_METADATA = 'synsicris.relation.parentproject';
export const PARENT_PROJECT_ENTITY = 'parentproject';
export const PERSON_ENTITY = 'Person';
export const PROJECT_RELATION_METADATA = 'synsicris.relation.project';
export const PROJECT_ENTITY = 'Project';
export const PROJECT_ENTITY_METADATA = 'synsicris.relation.entity_project';

export enum ProjectGrantsTypes {
  Project = 'parentproject',
  Subproject = 'project',
  OwningCommunity = 'owningproject',
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
    protected itemService: ItemDataService,
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
    const subprojectsCommunity$ = this.getSubprojectRootCommunityByParentProjectUUID(projectId);
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
      sendRequest(this.requestService),
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
  delete(projectId: string): Observable<RemoteData<NoContent>> {
    return super.delete(projectId);
  }

  /**
   * Get the item associated with the project community by synsicris.relation.entity_project metadata
   *
   * @param projectCommunity The project community
   * @return the RestResponse as an Observable
   */
  getProjectItemByProjectCommunity(projectCommunity: Community): Observable<RemoteData<Item>> {
    const metadataValue = Metadata.first(projectCommunity.metadata, PROJECT_ENTITY_METADATA);
    if (isNotEmpty(metadataValue) && isNotEmpty(metadataValue.authority)) {
      return this.itemService.findById(metadataValue.authority).pipe(
        getFirstCompletedRemoteData()
      );
    } else {
      return createFailedRemoteDataObject$<Item>('Link to project item is missing.');
    }
  }

  /**
   * Get the item associated with the project by synsicris.relation.entity_project metadata
   *
   * @param projectCommunityId The project community id
   * @return the RestResponse as an Observable
   */
  getProjectItemByProjectCommunityId(projectCommunityId: string): Observable<RemoteData<Item>> {
    return this.findById(projectCommunityId).pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((community: Community) => this.getProjectItemByProjectCommunity(community))
    );
  }

  /**
   * Get the project community which the project item belongs to
   *
   * @param itemId The project item id
   * @return the Community as an Observable
   */
  getProjectCommunityByProjectItemId(itemId: string): Observable<RemoteData<Community>> {
    return this.itemService.findById(
      itemId,
      true,
      true,
      followLink('owningCollection', {}, followLink('parentCommunity'))
    ).pipe(
      getFirstCompletedRemoteData(),
      mergeMap((projectItemRD: RemoteData<Item>) => {
        if (projectItemRD.hasSucceeded) {
          return projectItemRD.payload.owningCollection.pipe(
            getFirstCompletedRemoteData(),
            mergeMap((collectionRD) => {
              if (collectionRD.hasSucceeded) {
                return collectionRD.payload.parentCommunity;
              } else {
                return createFailedRemoteDataObject$<Community>();
              }
            })
          );
        } else {
          return createFailedRemoteDataObject$<Community>();
        }
      })
    );
  }

  /**
   * Get the project community which the given item belongs to
   *
   * @param itemId The entity item id
   * @return the Community as an Observable
   */
  getProjectCommunityByItemId(itemId: string): Observable<RemoteData<Community>> {
    return this.getProjectItemByItem(
      itemId,
      PARENT_PROJECT_RELATION_METADATA,
      followLink('owningCollection', {}, followLink('parentCommunity'))
    ).pipe(
      getFirstCompletedRemoteData(),
      mergeMap((projectItemRD: RemoteData<Item>) => {
        if (projectItemRD.hasSucceeded) {
          return projectItemRD.payload.owningCollection.pipe(
            getFirstCompletedRemoteData(),
            mergeMap((collectionRD) => {
              if (collectionRD.hasSucceeded) {
                return collectionRD.payload.parentCommunity;
              } else {
                return createFailedRemoteDataObject$<Community>();
              }
            })
          );
        } else {
          return createFailedRemoteDataObject$<Community>();
        }
      })
    );
  }

  /**
   * Get the project Item which the given item belongs to
   *
   * @param itemId           The project community id
   * @param linksToFollow    List of {@link FollowLinkConfig} that indicate which
   *                        {@link HALLink}s should be automatically resolved
   * @return the Community as an Observable
   */
  getProjectItemByItemId(itemId: string, ...linksToFollow: FollowLinkConfig<Item>[]): Observable<RemoteData<Item>> {
    return this.getProjectItemByItem(itemId, PARENT_PROJECT_RELATION_METADATA, ...linksToFollow);
  }

  /**
   * Get the project Item which the given item belongs to
   *
   * @param itemId           The project community id
   * @param linksToFollow    List of {@link FollowLinkConfig} that indicate which
   *                        {@link HALLink}s should be automatically resolved
   * @return the Community as an Observable
   */
  getSubprojectItemByItemId(itemId: string, ...linksToFollow: FollowLinkConfig<Item>[]): Observable<RemoteData<Item>> {
    return this.getProjectItemByItem(itemId, PROJECT_RELATION_METADATA, ...linksToFollow);
  }

  /**
   * Get the project Item which the given item belongs to
   *
   * @param itemId           The project community id
   * @param relationMetadata The metadata that contains relation to parentproject/project
   * @param linksToFollow    List of {@link FollowLinkConfig} that indicate which
   *                        {@link HALLink}s should be automatically resolved
   * @return the Community as an Observable
   */
  protected getProjectItemByItem(itemId: string, relationMetadata: string, ...linksToFollow: FollowLinkConfig<Item>[]): Observable<RemoteData<Item>> {
    return this.itemService.findById(itemId).pipe(
      getFirstCompletedRemoteData(),
      mergeMap((itemRD: RemoteData<Item>) => {
        if (itemRD.hasSucceeded) {
          if (itemRD.payload.entityType === PARENT_PROJECT_ENTITY || (itemRD.payload.entityType === PROJECT_ENTITY && relationMetadata === PROJECT_RELATION_METADATA) ) {
            return this.itemService.findById(itemId, true, true, ...linksToFollow);
          } else {
            const metadataValue = Metadata.first(itemRD.payload.metadata, relationMetadata);
            if (isNotEmpty(metadataValue) && isNotEmpty(metadataValue.authority)) {
              return this.itemService.findById(
                metadataValue.authority,
                true,
                true,
                ...linksToFollow
              );
            } else {
              return createFailedRemoteDataObject$<Item>();
            }
          }
        } else {
          return createFailedRemoteDataObject$<Item>();
        }
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
    return this.searchCommunityById(
      '',
      followLink('parentCommunity'),
      followLink('subcommunities')
    ).pipe(
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
   * Get the project community which the given item belongs to
   *
   * @param itemId The project community id
   * @return the Community as an Observable
   */
  getSubprojectCommunityByItemId(itemId: string): Observable<RemoteData<Community>> {
    return this.getProjectItemByItem(
      itemId,
      PROJECT_RELATION_METADATA,
      followLink('owningCollection', {}, followLink('parentCommunity'))
    ).pipe(
      getFirstCompletedRemoteData(),
      mergeMap((projectItemRD: RemoteData<Item>) => {
        if (projectItemRD.hasSucceeded) {
          return projectItemRD.payload.owningCollection.pipe(
            getFirstCompletedRemoteData(),
            mergeMap((collectionRD) => {
              if (collectionRD.hasSucceeded) {
                return collectionRD.payload.parentCommunity;
              } else {
                return createFailedRemoteDataObject$<Community>();
              }
            })
          );
        } else {
          return createFailedRemoteDataObject$<Community>();
        }
      })
    );
  }

  /**
   * Get root community that contains all projects
   *
   * @return Observable<Community>
   */
  getSubprojectRootCommunityByParentProjectUUID(projectId: string): Observable<Community> {
    return this.searchCommunityByName(
      projectId
    ).pipe(
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
    return this.getSubprojectRootCommunityByParentProjectUUID(projectId).pipe(
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
      mergeMap(() => this.findById(project.id, false, true, followLink('parentCommunity'))),
      getFinishedRemoteData()
    );
  }

  /**
   * Search a community by id
   *
   * @return Observable<Community>
   */
  private searchCommunityById(scope: string = '', ...linksToFollow: FollowLinkConfig<Community>[]): Observable<Community> {
    const sort = new SortOptions('dc.title', SortDirection.ASC);
    const pagination = new PaginationComponentOptions();
    const searchOptions = new PaginatedSearchOptions({
      configuration: 'userProjectsCommunity',
      // query: 'search.resourceid:' + id,
      // dsoTypes: [DSpaceObjectType.COMMUNITY],
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
  private searchCommunityByName(scope: string = '', ...linksToFollow: FollowLinkConfig<Community>[]): Observable<Community> {
    const sort = new SortOptions('dc.title', SortDirection.ASC);
    const pagination = new PaginationComponentOptions();
    const searchOptions = new PaginatedSearchOptions({
      configuration: 'subprojectCommunity',
      pagination: pagination,
      sort: sort,
      scope: scope
    });

    return this.fetchSearchCommunity(searchOptions, ...linksToFollow);
  }

  /**
   * Invalidate user project result cache hit
   */
  public invalidateUserProjectResultsCache() {
    this.requestService.setStaleByHrefSubstring('configuration=userProjectsCommunity');
    this.requestService.setStaleByHrefSubstring('configuration=BROWSE.Person.');
  }

  /**
   * Fetch a search request
   *
   * @return Observable<Community>
   */
  private fetchSearchCommunity(searchOptions: PaginatedSearchOptions, ...linksToFollow: FollowLinkConfig<Community>[]): Observable<Community> {
    return this.searchService.search(searchOptions,null, false).pipe(
      getFirstSucceededRemoteData(),
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
            mergeMap((community: Community) => this.findById(community.id, true, true, ...linksToFollow).pipe(
              tap(() => this.invalidateUserProjectResultsCache()),
              tap(() => this.requestService.setStaleByHrefSubstring(community.id))
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
