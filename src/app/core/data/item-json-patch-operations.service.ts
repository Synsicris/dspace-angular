import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { JsonPatchOperationsService } from '../json-patch/json-patch-operations.service';
import { PatchRequest } from './request.models';
import { CoreState } from '../core-state.model';
import { Item } from '../shared/item.model';
import { Observable } from 'rxjs/internal/Observable';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { isNotEmpty } from '../../shared/empty.util';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';

/**
 * A service that provides methods to make JSON Patch requests.
 */
@Injectable()
export class ItemJsonPatchOperationsService extends JsonPatchOperationsService<Item, PatchRequest> {
  protected linkPath = '';
  protected patchRequestConstructor = PatchRequest;

  constructor(
    protected requestService: RequestService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService,
    protected rdbService: RemoteDataBuildService) {

    super();
  }

  /**
   * Make a new JSON Patch request with all operations related to the specified resource type
   *
   * @param linkPath
   *    The link path of the request
   * @param scopeId
   *    The scope id
   * @param resourceType
   *    The resource type value
   * @return Observable<ResponseDefinitionDomain>
   *    observable of response
   */
  public jsonPatchByResourceType(linkPath: string, scopeId: string, resourceType: string): Observable<Item> {

    const href$ = this.halService.getEndpoint(linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId)));

    return this.submitJsonPatchOperations(href$, resourceType);
  }

  /**
   * Make a new JSON Patch request with all operations related to the specified resource id
   *
   * @param linkPath
   *    The link path of the request
   * @param scopeId
   *    The scope id
   * @param resourceType
   *    The resource type value
   * @param resourceId
   *    The resource id value
   * @return Observable<ResponseDefinitionDomain>
   *    observable of response
   */
  public jsonPatchByResourceID(linkPath: string, scopeId: string, resourceType: string, resourceId: string): Observable<Item> {

    const href$ = this.halService.getEndpoint(linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      distinctUntilChanged(),
      map((endpointURL: string) => this.getEndpointByIDHref(endpointURL, scopeId)));

    return this.submitJsonPatchOperations(href$, resourceType);
  }

}
