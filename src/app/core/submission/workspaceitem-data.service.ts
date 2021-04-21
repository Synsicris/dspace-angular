import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
import { FindListOptions } from '../data/request.models';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { RequestParam } from '../cache/models/request-param.model';
import { getFinishedRemoteData } from '../shared/operators';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
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
    return this.searchBy(this.searchByItemLinkPath, optionsWithUUID, true, ...linksToFollow).pipe(
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
}
