import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
import { Community } from '../shared/community.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { PaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { FindListOptions } from '../data/find-list-options.model';
import { PostRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { CommunityDataService } from '../data/community-data.service';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { SortDirection, SortOptions } from '../cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { SearchResult } from '../../shared/search/models/search-result.model';
import {
  getFinishedRemoteData,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload
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
import { CollectionDataService } from '../data/collection-data.service';
import { sendRequest } from '../shared/request.operators';

export const PROJECT_RELATION_METADATA = 'synsicris.relation.project';
export const PROJECT_RELATION_SOLR = 'synsicris.relation.project_authority';
export const PROJECT_ENTITY = 'Project';
export const PERSON_ENTITY = 'Person';
export const FUNDING_RELATION_METADATA = 'synsicris.relation.funding';
export const FUNDING_ENTITY = 'Funding';
export const ENTITY_ITEM_METADATA = 'synsicris.relation.entity_item';
export const SUBCONTRACTOR_ENTITY_METADATA = 'subcontractor';
export const PROJECTPATNER_ENTITY_METADATA = 'projectpartner';
export const POLICY_GROUP_METADATA = 'cris.policy.group';
export const POLICY_SHARED_METADATA = 'cris.project.shared';
export const PROGRAMME_ENTITY = 'programme';
export const VERSION_UNIQUE_ID = 'synsicris.uniqueid';
export const FUNDING_OBJECTIVE_ENTITY = 'fundingobjective';
export const CALL_ENTITY = 'call';
export const ORGANISATION_UNIT_ENTITY = 'OrgUnit';
export const INTERIM_REPORT_ENTITY = 'interim_report';
export const EXPLOITATIONPLAN_ENTITY = 'exploitationplan';
export const WORKINGPLAN_ENTITY = 'workingplan';

export enum ProjectGrantsTypes {
  Project = 'project',
  Funding = 'funding',
  OwningCommunity = 'owningproject',
}

@Injectable()
export class ProjectDataService extends CommunityDataService {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected comparator: DSOChangeAnalyzer<Community>,
    protected notificationsService: NotificationsService,
    protected bitstreamDataService: BitstreamDataService,
    protected searchService: SearchService,
    protected linkService: LinkService,
    protected configurationService: ConfigurationDataService,
    protected groupDataService: GroupDataService,
    protected itemService: ItemDataService,
    protected collectionService: CollectionDataService,
    protected commService: CommunityDataService,
  ) {
    super(requestService, rdbService, objectCache, halService, comparator, notificationsService, bitstreamDataService);
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
  createFunding(name: string, projectId: string, grants: ProjectGrantsTypes): Observable<RemoteData<Community>> {
    const template$ = this.getFundingTemplateUrl();
    const subprojectsCommunity$ = this.getFundingRootCommunityByProjectUUID(projectId);
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
  getEntityItemByCommunity(projectCommunity: Community): Observable<RemoteData<Item>> {
    const metadataValue = Metadata.first(projectCommunity.metadata, ENTITY_ITEM_METADATA);
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
  getEntityItemByCommunityId(projectCommunityId: string): Observable<RemoteData<Item>> {
    return this.findById(projectCommunityId).pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((community: Community) => this.getEntityItemByCommunity(community))
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
              if (collectionRD.hasSucceeded && isNotEmpty(collectionRD.payload)) {
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
   * Get the funding community which the given item belongs to
   *
   * @param itemId The entity item id
   * @return the Community as an Observable
   */
  getFundingCommunityByItemId(itemId: string): Observable<RemoteData<Community>> {
    return this.getRelatedCommunityByItemId(itemId, FUNDING_RELATION_METADATA, followLink('owningCollection', {}, followLink('parentCommunity')));
  }

  /**
   * Get the project community which the given item belongs to
   *
   * @param itemId The entity item id
   * @return the Community as an Observable
   */
  getProjectCommunityByItemId(itemId: string): Observable<RemoteData<Community>> {
    return this.getRelatedCommunityByItemId(itemId, PROJECT_RELATION_METADATA, followLink('owningCollection', {}, followLink('parentCommunity')));
  }

  /**
   * Get the project community which the given item belongs to
   *
   * @param itemId The entity item id
   * @param relationMetadata The metadata that contains relation to project/funding
   * @param linksToFollow    List of {@link FollowLinkConfig} that indicate which
   *                        {@link HALLink}s should be automatically resolved
   * @return the Community as an Observable
   */
  private getRelatedCommunityByItemId(itemId: string, relationMetadata: string, ...linksToFollow: FollowLinkConfig<Item>[]): Observable<RemoteData<Community>> {
    return this.getRelatedEntityItemByItem(
      itemId,
      relationMetadata,
      true,
      true,
      ...linksToFollow
    ).pipe(
      getFirstCompletedRemoteData(),
      mergeMap((projectItemRD: RemoteData<Item>) => {
        if (projectItemRD.hasSucceeded) {
          return projectItemRD.payload.owningCollection.pipe(
            getFirstCompletedRemoteData(),
            mergeMap((collectionRD) => {
              if (collectionRD.hasSucceeded && isNotEmpty(collectionRD.payload)) {
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
    return this.getRelatedEntityItemByItem(itemId, PROJECT_RELATION_METADATA, true, true, ...linksToFollow);
  }

  /**
   * Get the project Item it, which the given item belongs to,
   * by retrieving from the relation metadata
   *
   * @param item  The item
   *
   * @return The project item's id
   */
  getProjectItemIdByRelationMetadata(item: Item): string {
    const metadataValue = Metadata.first(item.metadata, PROJECT_RELATION_METADATA);
    return metadataValue?.authority;
  }

  /**
   * Get the funding Item which the given item belongs to
   *
   * @param itemId           The project community id
   * @param linksToFollow    List of {@link FollowLinkConfig} that indicate which
   *                        {@link HALLink}s should be automatically resolved
   * @return the Community as an Observable
   */
  getFundingItemByItemId(itemId: string, ...linksToFollow: FollowLinkConfig<Item>[]): Observable<RemoteData<Item>> {
    return this.getRelatedEntityItemByItem(itemId, FUNDING_RELATION_METADATA, true, true, ...linksToFollow);
  }

  /**
   * Get the project/funding Item which the given item belongs to
   *
   * @param itemId           The project community id
   * @param relationMetadata The metadata that contains relation to project/funding
   * @param linksToFollow    List of {@link FollowLinkConfig} that indicate which
   *                        {@link HALLink}s should be automatically resolved
   * @return the Community as an Observable
   */
  protected getRelatedEntityItemByItem(itemId: string, relationMetadata: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Item>[]): Observable<RemoteData<Item>> {
    return this.itemService.findById(itemId).pipe(
      getFirstCompletedRemoteData(),
      mergeMap((itemRD: RemoteData<Item>) => {
        if (itemRD.hasSucceeded) {
          return this.getProjectItem(itemRD.payload, relationMetadata, linksToFollow);
        } else {
          return createFailedRemoteDataObject$<Item>();
        }
      })
    );
  }

  getRelatedProjectByItem(item: Item, relationMetadata = PROJECT_RELATION_METADATA): Observable<RemoteData<Item>> {
    return this.getProjectItem(item, relationMetadata);
  }

  protected getProjectItem(item: Item, relationMetadata: string, linksToFollow: FollowLinkConfig<Item>[] = []): Observable<RemoteData<Item>> {
    if (item?.entityType === PROJECT_ENTITY || (item?.entityType === FUNDING_ENTITY && relationMetadata === FUNDING_RELATION_METADATA)) {
      return this.itemService.findById(item.id, true, true, ...linksToFollow);
    } else {
      const metadataValue = Metadata.first(item?.metadata, relationMetadata);
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
  }

  findItemById(uuid: string, linksToFollow: FollowLinkConfig<Item>[] = []): Observable<RemoteData<Item>> {
    return this.itemService.findById(uuid, true, true, ...linksToFollow ).pipe(
      getFirstCompletedRemoteData(),
      map((data) => {
        if (data.hasSucceeded) {
          return data;
        } else {
          throw new Error('Item does not exist');
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
  getFundingTemplateUrl(): Observable<string> {
    return this.configurationService.findByPropertyName('funding.template-id').pipe(
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
    return this.getRelatedEntityItemByItem(
      itemId,
      FUNDING_RELATION_METADATA,
      false,
      true,
      followLink('owningCollection', {}, followLink('parentCommunity'))
    ).pipe(
      getFirstCompletedRemoteData(),
      mergeMap((projectItemRD: RemoteData<Item>) => {
        if (projectItemRD.hasSucceeded) {
          return this.collectionService.findByHref(
            projectItemRD.payload._links.owningCollection.href,
            false,
            true,
            followLink('parentCommunity')
          ).pipe(
            getFirstCompletedRemoteData(),
            mergeMap((collectionRD) => {
              if (collectionRD.hasSucceeded && collectionRD?.payload) {
                return collectionRD?.payload?.parentCommunity;
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
  getFundingRootCommunityByProjectUUID(projectId: string): Observable<Community> {
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
  retrieveAllFundingByProjectUUID(projectId: string, options: PageInfo): Observable<PaginatedList<Community>> {
    return this.getFundingRootCommunityByProjectUUID(projectId).pipe(
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
      mergeMap((projects) => this.findListByHref(projects._links.subcommunities.href, findListOptions))
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
      configuration: 'fundingCommunity',
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
    return this.searchService.search(searchOptions, null, false).pipe(
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
