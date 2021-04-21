import { DataService } from '../data/data.service';
import { EditItem } from './models/edititem.model';
import { Injectable } from '@angular/core';
import { dataService } from '../cache/builders/build-decorators';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { Observable } from 'rxjs/internal/Observable';
import { EditItemMode } from './models/edititem-mode.model';
import { getAllSucceededRemoteDataPayload, getFirstSucceededRemoteListPayload } from '../shared/operators';
import { mergeMap } from 'rxjs/operators';

/**
 * A service that provides methods to make REST requests with edititems endpoint.
 */
@Injectable()
@dataService(EditItem.type)
export class EditItemDataService extends DataService<EditItem> {
  protected linkPath = 'edititems';
  protected responseMsToLive = 10 * 1000;

  constructor(
    protected comparator: DSOChangeAnalyzer<EditItem>,
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
   * Retrieve edit modes for given item id
   *
   * @param itemId
   */
  searchEditModesByID(itemId: string): Observable<EditItemMode[]> {
    return this.findById(itemId + ':none', false, true, followLink('modes')).pipe(
      getAllSucceededRemoteDataPayload(),
      mergeMap((editItem: EditItem) => editItem.modes.pipe(
        getFirstSucceededRemoteListPayload())
      )
    );
  }
}
