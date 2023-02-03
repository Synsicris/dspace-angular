import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { dataService } from '../data/base/data-service.decorator';
import { EasyOnlineImport } from './models/easy-online-import.model';
import { EASY_ONLINE_IMPORT } from './models/easy-online-import.resource-type';
import { URLCombiner } from '../url-combiner/url-combiner';
import { BaseDataService } from '../data/base/base-data.service';

/**
 * A service responsible for fetching/sending data from/to the REST API on the vocabularies endpoint
 */
@Injectable()
@dataService(EASY_ONLINE_IMPORT)
export class EasyOnlineImportService extends BaseDataService<EasyOnlineImport> {

  protected linkPath = 'easyonlineimports';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService
  ) {
    super('easyonlineimports', requestService, rdbService, objectCache, halService);
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
