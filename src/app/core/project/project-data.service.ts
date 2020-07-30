import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, switchMap, take } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { Community } from '../shared/community.model';
import { COMMUNITY } from '../shared/community.resource-type';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { PaginatedList } from '../data/paginated-list';
import { RemoteData } from '../data/remote-data';
import { FindListOptions, FindListRequest, PostRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { CommunityDataService } from '../data/community-data.service';
import { Group } from '../eperson/models/group.model';
import { RestResponse } from '../cache/response.models';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { SearchFilter } from '../../shared/search/search-filter.model';
import { SortDirection, SortOptions } from '../cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { SearchResult } from '../../shared/search/search-result.model';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { getFirstSucceededRemoteDataPayload } from '../shared/operators';
import { Item } from '../shared/item.model';
import { DSpaceObjectType } from '../shared/dspace-object-type.model';

@Injectable()
@dataService(COMMUNITY)
export class ProjectDataService extends CommunityDataService {

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Community>
  ) {
    super(requestService, rdbService, store, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Adds given subgroup as a subgroup to the given active group
   * @param activeGroup   Group we want to add subgroup to
   * @param subgroup      Group we want to add as subgroup to activeGroup
   */
  addSubGroupToGroup(activeGroup: Group, subgroup: Group): Observable<RestResponse> {
/*    this.se
    const requestId = this.requestService.generateRequestId();
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;
    const postRequest = new PostRequest(requestId, activeGroup.self + '/' + this.subgroupsEndpoint, subgroup.self, options);
    this.requestService.configure(postRequest);

    return this.fetchResponse(requestId);*/
  }

  /**
   * Get the uuid of the first impact pathway item available
   */
  getProjectTemplate(): Observable<Community> {
    const filters: SearchFilter[] = [new SearchFilter('f.entityType', ['impactpathway'])]
    const sort = new SortOptions('dc.title', SortDirection.ASC);
    const pagination = new PaginationComponentOptions()
    const searchOptions = new PaginatedSearchOptions({
      configuration: 'default',
      query: 'project-template',
      dsoType: DSpaceObjectType.COMMUNITY,
      filters: filters,
      pagination: pagination,
      sort: sort
    });

    return this.searchService.search(searchOptions).pipe(
      filter((rd: RemoteData<PaginatedList<SearchResult<any>>>) => rd.hasSucceeded),
      map((rd: RemoteData<PaginatedList<SearchResult<any>>>) => {
        const dsoPage: any[] = rd.payload.page
          .filter((result) => hasValue(result))
          .map((searchResult: SearchResult<any>) => {
            if (searchResult.indexableObject.type === 'item') {
              return observableOf((searchResult.indexableObject));
            } else {
              this.linkService.resolveLink(searchResult.indexableObject, followLink('item'));
              return searchResult.indexableObject.item.pipe(
                getFirstSucceededRemoteDataPayload()
              )
            }
          });
        const payload = Object.assign(rd.payload, { page: dsoPage }) as PaginatedList<any>;
        return Object.assign(rd, { payload: payload });
      }),
      map((rd: RemoteData<PaginatedList<Observable<Item>>>) => rd.payload),
      filter((list: PaginatedList<Observable<Item>>) => list.page.length > 0),
      flatMap((list: PaginatedList<Observable<Item>>) => (list.page[0]).pipe(
        map((item: Item) => item.id)
      )),
      filter((itemUUID) => isNotEmpty(itemUUID)),
      take(1),
      distinctUntilChanged()
    );
  }
}
