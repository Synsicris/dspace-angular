import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Store } from '@ngrx/store';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { WorkspaceItem } from './models/workspaceitem.model';
import { Observable } from 'rxjs';
import { RemoteData } from '../data/remote-data';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { find, map } from 'rxjs/operators';
import { hasValue } from '../../shared/empty.util';
import { FindListOptions, PostRequest } from '../data/request.models';
import { getFinishedRemoteData } from '../shared/operators';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { RequestParam } from '../cache/models/request-param.model';
import { PaginatedList } from '../data/paginated-list.model';
import { createFailedRemoteDataObject, createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';

/**
 * A service that provides methods to make REST requests with workspaceitems endpoint.
 */
@Injectable()
@dataService(WorkspaceItem.type)
export class WorkspaceitemDataService extends DataService<WorkspaceItem> {
  protected linkPath = 'workspaceitems';
  protected searchByItemLinkPath = 'item';

  constructor(
    protected comparator: DSOChangeAnalyzer<WorkspaceItem>,
    protected halService: HALEndpointService,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected store: Store<CoreState>) {
    super();
  }

  /**
   * Return the WorkspaceItem object found through the UUID of an item
   *
   * @param uuid           The uuid of the item
   * @param options        The {@link FindListOptions} object
   * @param linksToFollow  List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  public findByItem(uuid: string, options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<WorkspaceItem>[]): Observable<RemoteData<WorkspaceItem>> {
    const optionsWithUUID = Object.assign(new FindListOptions(), options, {
      searchParams: [new RequestParam('uuid', uuid)]
    });
    return this.searchBy(this.searchByItemLinkPath, optionsWithUUID, false, true, ...linksToFollow).pipe(
      getFinishedRemoteData(),
      map((rd: RemoteData<PaginatedList<WorkspaceItem>>) => {
        if (rd.hasSucceeded) {
          return createSuccessfulRemoteDataObject(rd.payload.page[0]);
        } else {
          return createFailedRemoteDataObject(rd.errorMessage, rd.statusCode);
        }
      })
    );
  }

  /**
   * Import an external source entry into a collection
   * @param externalSourceEntryHref
   * @param collectionId
   */
  public importExternalSourceEntry(externalSourceEntryHref: string, collectionId: string): Observable<RemoteData<WorkspaceItem>> {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;

    const requestId = this.requestService.generateRequestId();
    const href$ = this.halService.getEndpoint(this.linkPath).pipe(map((href) => `${href}?owningCollection=${collectionId}`));

    href$.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PostRequest(requestId, href, externalSourceEntryHref, options);
        this.requestService.send(request);
      })
    ).subscribe();

    return this.rdbService.buildFromRequestUUID(requestId);
  }

}
