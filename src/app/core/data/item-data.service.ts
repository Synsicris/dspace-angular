import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  catchError,
  delay,
  distinctUntilChanged,
  filter,
  find,
  map,
  mergeMap,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { hasValue, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { BrowseService } from '../browse/browse.service';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { Collection } from '../shared/collection.model';
import { ExternalSourceEntry } from '../shared/external-source-entry.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import { ITEM } from '../shared/item.resource-type';
import { getFirstSucceededRemoteDataPayload, sendRequest } from '../shared/operators';
import { URLCombiner } from '../url-combiner/url-combiner';

import { DataService } from './data.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import { DeleteRequest, FindListOptions, GetRequest, PostRequest, PutRequest, RestRequest } from './request.models';
import { RequestService } from './request.service';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { Bundle } from '../shared/bundle.model';
import { MetadataMap, MetadataValue } from '../shared/metadata.models';
import { BundleDataService } from './bundle-data.service';
import { Operation } from 'fast-json-patch';
import { NoContent } from '../shared/NoContent.model';
import { Metric } from '../shared/metric.model';
import { Metadata } from '../shared/metadata.utils';
import { JsonPatchOperationPathCombiner } from '../json-patch/builder/json-patch-operation-path-combiner';
import { ErrorResponse } from '../cache/response.models';
import { JsonPatchOperationsBuilder } from '../json-patch/builder/json-patch-operations-builder';
import { ItemJsonPatchOperationsService } from './item-json-patch-operations.service';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';

@Injectable()
@dataService(ITEM)
export class ItemDataService extends DataService<Item> {
  protected linkPath = 'items';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected bs: BrowseService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<Item>,
    protected bundleService: BundleDataService,
    protected operationsBuilder: JsonPatchOperationsBuilder,
    protected itemJsonPatchOperationsService: ItemJsonPatchOperationsService,
  ) {
    super();
  }

  /**
   * Get the endpoint for browsing items
   *  (When options.sort.field is empty, the default field to browse by will be 'dc.date.issued')
   * @param {FindListOptions} options
   * @returns {Observable<string>}
   */
  public getBrowseEndpoint(options: FindListOptions = {}, linkPath: string = this.linkPath): Observable<string> {
    let field = 'dc.date.issued';
    if (options.sort && options.sort.field) {
      field = options.sort.field;
    }
    return this.bs.getBrowseURLFor(field, linkPath).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => new URLCombiner(href, `?scope=${options.scopeID}`).toString()),
      distinctUntilChanged(),);
  }

  /**
   * Fetches the endpoint used for mapping an item to a collection,
   * or for fetching all collections the item is mapped to if no collection is provided
   * @param itemId        The item's id
   * @param collectionId  The collection's id (optional)
   */
  public getMappedCollectionsEndpoint(itemId: string, collectionId?: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getIDHref(endpoint, itemId)),
      map((endpoint: string) => `${endpoint}/mappedCollections${collectionId ? `/${collectionId}` : ''}`)
    );
  }

  /**
   * Removes the mapping of an item from a collection
   * @param itemId        The item's id
   * @param collectionId  The collection's id
   */
  public removeMappingFromCollection(itemId: string, collectionId: string): Observable<RemoteData<NoContent>> {
    return this.getMappedCollectionsEndpoint(itemId, collectionId).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => new DeleteRequest(this.requestService.generateRequestId(), endpointURL)),
      sendRequest(this.requestService),
      switchMap((request: RestRequest) => this.rdbService.buildFromRequestUUID(request.uuid)),
    );
  }

  /**
   * Maps an item to a collection
   * @param itemId          The item's id
   * @param collectionHref  The collection's self link
   */
  public mapToCollection(itemId: string, collectionHref: string): Observable<RemoteData<NoContent>> {
    return this.getMappedCollectionsEndpoint(itemId).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpointURL: string) => {
        const options: HttpOptions = Object.create({});
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'text/uri-list');
        options.headers = headers;
        return new PostRequest(this.requestService.generateRequestId(), endpointURL, collectionHref, options);
      }),
      sendRequest(this.requestService),
      switchMap((request: RestRequest) => this.rdbService.buildFromRequestUUID(request.uuid))
    );
  }

  /**
   * Set the isWithdrawn state of an item to a specified state
   * @param item
   * @param withdrawn
   */
  public setWithDrawn(item: Item, withdrawn: boolean): Observable<RemoteData<Item>> {

    const patchOperation = {
      op: 'replace', path: '/withdrawn', value: withdrawn
    } as Operation;
    this.requestService.removeByHrefSubstring('/discover');

    return this.patch(item, [patchOperation]);
  }

  /**
   * Set the isDiscoverable state of an item to a specified state
   * @param item
   * @param discoverable
   */
  public setDiscoverable(item: Item, discoverable: boolean): Observable<RemoteData<Item>> {
    const patchOperation = {
      op: 'replace', path: '/discoverable', value: discoverable
    } as Operation;
    this.requestService.removeByHrefSubstring('/discover');

    return this.patch(item, [patchOperation]);

  }

  /**
   * Get the endpoint for an item's bundles
   * @param itemId
   */
  public getBundlesEndpoint(itemId: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      switchMap((url: string) => this.halService.getEndpoint('bundles', `${url}/${itemId}`))
    );
  }

  /**
   * Get an item's bundles using paginated search options
   * @param itemId          The item's ID
   * @param searchOptions   The search options to use
   */
  public getBundles(itemId: string, searchOptions?: PaginatedSearchOptions): Observable<RemoteData<PaginatedList<Bundle>>> {
    const hrefObs = this.getBundlesEndpoint(itemId).pipe(
      map((href) => searchOptions ? searchOptions.toRestUrl(href) : href)
    );
    hrefObs.pipe(
      take(1)
    ).subscribe((href) => {
      const request = new GetRequest(this.requestService.generateRequestId(), href);
      this.requestService.send(request);
    });

    return this.rdbService.buildList<Bundle>(hrefObs);
  }

  /**
   * Get the endpoint for an item's metrics
   * @param itemId
   */
  public getMetricsEndpoint(itemId: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      switchMap((url: string) => this.halService.getEndpoint('metrics', `${url}/${itemId}`))
    );
  }

  /**
   * Get an item's metrics using paginated search options
   * @param itemId          The item's ID
   * @param searchOptions   The search options to use
   */
  public getMetrics(itemId: string, searchOptions?: PaginatedSearchOptions): Observable<RemoteData<PaginatedList<Metric>>> {
    const hrefObs = this.getMetricsEndpoint(itemId).pipe(
      map((href) => searchOptions ? searchOptions.toRestUrl(href) : href)
    );
    hrefObs.pipe(
      take(1)
    ).subscribe((href) => {
      const request = new GetRequest(this.requestService.generateRequestId(), href);
      this.requestService.send(request);
    });

    return this.rdbService.buildList<Metric>(hrefObs);
  }

  /**
   * Create a new bundle on an item
   * @param itemId      The item's ID
   * @param bundleName  The new bundle's name
   * @param metadata    Optional metadata for the bundle
   */
  public createBundle(itemId: string, bundleName: string, metadata?: MetadataMap): Observable<RemoteData<Bundle>> {
    const requestId = this.requestService.generateRequestId();
    const hrefObs = this.getBundlesEndpoint(itemId);

    const bundleJson = {
      name: bundleName,
      metadata: metadata ? metadata : {}
    };

    hrefObs.pipe(
      take(1)
    ).subscribe((href) => {
      const options: HttpOptions = Object.create({});
      let headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'application/json');
      options.headers = headers;
      const request = new PostRequest(requestId, href, JSON.stringify(bundleJson), options);
      this.requestService.send(request);
    });

    return this.rdbService.buildFromRequestUUID(requestId);
  }

  /**
   * Get the endpoint to move the item
   * @param itemId
   */
  public getMoveItemEndpoint(itemId: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      map((endpoint: string) => this.getIDHref(endpoint, itemId)),
      map((endpoint: string) => `${endpoint}/owningCollection`)
    );
  }

  /**
   * Move the item to a different owning collection
   * @param itemId
   * @param collection
   */
  public moveToCollection(itemId: string, collection: Collection): Observable<RemoteData<Collection>> {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;

    const requestId = this.requestService.generateRequestId();
    const hrefObs = this.getMoveItemEndpoint(itemId);

    hrefObs.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PutRequest(requestId, href, collection._links.self.href, options);
        this.requestService.send(request);
      })
    ).subscribe();

    return this.rdbService.buildFromRequestUUID(requestId);
  }

  /**
   * Import an external source entry into a collection
   * @param externalSourceEntry
   * @param collectionId
   */
  public importExternalSourceEntry(externalSourceEntry: ExternalSourceEntry, collectionId: string): Observable<RemoteData<Item>> {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/uri-list');
    options.headers = headers;

    const requestId = this.requestService.generateRequestId();
    const href$ = this.halService.getEndpoint(this.linkPath).pipe(map((href) => `${href}?owningCollection=${collectionId}`));

    href$.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PostRequest(requestId, href, externalSourceEntry._links.self.href, options);
        this.requestService.send(request);
      })
    ).subscribe();

    return this.rdbService.buildFromRequestUUID(requestId);
  }

  /**
   * Get the endpoint for an item's bitstreams
   * @param itemId
   */
  public getBitstreamsEndpoint(itemId: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      switchMap((url: string) => this.halService.getEndpoint('bitstreams', `${url}/${itemId}`))
    );
  }

  updateItemMetadata(itemId: string, metadataName: string, position: number, value: string): Observable<RemoteData<Item>> {
    return this.findById(itemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((item: Item) => Metadata.first(item.metadata, metadataName)),
      tap((metadataValue: MetadataValue) => {
        if (isNotEmpty(metadataValue)) {
          this.replaceMetadataPatch(metadataName, position, value);
        } else {
          this.addMetadataPatch(metadataName, value);
        }
      }),
      delay(200),
      mergeMap(() => this.executeItemPatch(itemId, 'metadata'))
    );
  }

  replaceMetadataPatch(metadataName: string, position: number, value: string): void {
    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    const path = pathCombiner.getPath([metadataName, position.toString()]);
    this.operationsBuilder.replace(path, value, true);
  }

  addMetadataPatch(metadataName: string, value: string): void {
    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    const path = pathCombiner.getPath([metadataName]);
    this.operationsBuilder.add(path, value, true, true);
  }

  private executeItemPatch(objectId: string, pathName: string): Observable<RemoteData<Item>> {
    return this.itemJsonPatchOperationsService.jsonPatchByResourceType(
      'items',
      objectId,
      pathName).pipe(
      tap((item: Item) => this.update(item)),
      map((item: Item) => createSuccessfulRemoteDataObject<Item>(item)),
      catchError((error: ErrorResponse) => createFailedRemoteDataObject$<Item>(error.errorMessage))
    );
  }
}
