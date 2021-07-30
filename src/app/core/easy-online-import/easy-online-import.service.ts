import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HrefOnlyDataService } from '../data/href-only-data.service';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { dataService } from '../cache/builders/build-decorators';
import { EasyOnlineImport } from './models/easy-online-import.model';
import { EASY_ONLINE_IMPORT } from './models/easy-online-import.resource-type';
import { map } from 'rxjs/operators';
import { URLCombiner } from '../url-combiner/url-combiner';
import { Observable } from 'rxjs';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';

/* tslint:disable:max-classes-per-file */

/**
 * A private DataService implementation to delegate specific methods to.
 */
class EasyOnlineImportServiceImpl extends DataService<EasyOnlineImport> {
  protected linkPath = 'vocabularyEntryDetails';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected hrefOnlyDataService: HrefOnlyDataService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<EasyOnlineImport>) {
    super();
  }

}

/**
 * A service responsible for fetching/sending data from/to the REST API on the vocabularies endpoint
 */
@Injectable()
@dataService(EASY_ONLINE_IMPORT)
export class EasyOnlineImportService {

  protected linkPath = 'easyonlineimports';
  private dataService: EasyOnlineImportServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected hrefOnlyDataService: HrefOnlyDataService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<EasyOnlineImport>) {
    this.dataService = new EasyOnlineImportServiceImpl(requestService, rdbService, store, objectCache, halService, notificationsService, hrefOnlyDataService, http, comparator);
  }

  /**
   * Get the endpoint for the easy-online import
   * @param itemId  The project item's ID
   */
  public getImportEndpoint(itemId: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((href: string) => new URLCombiner(href, itemId).toString())
    );
  }
}

/* tslint:enable:max-classes-per-file */
