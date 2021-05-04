import { Injectable } from '@angular/core';

import {
  combineLatest,
  from as observableFrom,
  Observable,
  of as observableOf,
  throwError as observableThrowError,
} from 'rxjs';
import { catchError, concatMap, delay, map, mapTo, mergeMap, reduce, tap } from 'rxjs/operators';
import { findIndex } from 'lodash';

import { Item } from './item.model';
import { getFirstSucceededRemoteDataPayload } from './operators';
import { ItemDataService } from '../data/item-data.service';
import { ErrorResponse } from '../cache/response.models';
import { ItemJsonPatchOperationsService } from '../data/item-json-patch-operations.service';
import { MetadataValue } from './metadata.models';
import { JsonPatchOperationPathCombiner } from '../json-patch/builder/json-patch-operation-path-combiner';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { JsonPatchOperationsBuilder } from '../json-patch/builder/json-patch-operations-builder';

@Injectable()
export class ItemAuthorityRelationService {

  constructor(
    private itemService: ItemDataService,
    private itemJsonPatchOperationsService: ItemJsonPatchOperationsService,
    private operationsBuilder: JsonPatchOperationsBuilder,
  ) {

  }

  /**
   * Create a relation between two item by adding authority from parent to child
   *
   * @param parentItemId               The parent item id
   * @param linkedItemId               The linked child item id
   * @param relationMetadataName       The metadata that contains authority from parent to child
   * @return the linked Item
   */
  addLinkedItemToParent(
    parentItemId: string,
    linkedItemId: string,
    relationMetadataName: string
  ): Observable<Item> {
    const parentItem$: Observable<Item> = this.itemService.findById(parentItemId).pipe(
      getFirstSucceededRemoteDataPayload()
    );
    const linkedItem$: Observable<Item> = this.itemService.findById(linkedItemId).pipe(
      getFirstSucceededRemoteDataPayload()
    );
    return combineLatest([parentItem$, linkedItem$]).pipe(
      tap(([parentItem, linkedItem]: [Item, Item]) => this.addRelationPatch(parentItem, linkedItem.name, linkedItemId, relationMetadataName)),
      delay(100),
      mergeMap(([parentItem, linkedItem]: [Item, Item]) => this.executeItemPatch(parentItem.id, 'metadata').pipe(
        mapTo(linkedItem)
      ))
    );
  }

  /**
   * Create a relation between two item by adding authority from parent to child and from child to parent
   *
   * @param parentItemId               The parent item id
   * @param linkedItemId               The linked child item id
   * @param relationParentMetadataName The metadata that contains authority from child to parent
   * @param relationMetadataName       The metadata that contains authority from parent to child
   * @return the patched linked Item
   */
  linkItemToParent(
    parentItemId: string,
    linkedItemId: string,
    relationParentMetadataName: string,
    relationMetadataName: string
  ): Observable<Item> {
    const parentItem$: Observable<Item> = this.itemService.findById(parentItemId).pipe(
      getFirstSucceededRemoteDataPayload()
    );
    const linkedItem$: Observable<Item> = this.itemService.findById(linkedItemId).pipe(
      getFirstSucceededRemoteDataPayload()
    );
    return combineLatest([parentItem$, linkedItem$]).pipe(
      tap(([parentItem, linkedItem]: [Item, Item]) => this.addRelationPatch(parentItem, linkedItem.name, linkedItemId, relationMetadataName)),
      delay(100),
      mergeMap(([parentItem, linkedItem]: [Item, Item]) => this.executeItemPatch(parentItem.id, 'metadata').pipe(
        tap(() => this.addRelationPatch(linkedItem, parentItem.name, parentItemId, relationParentMetadataName)),
        delay(100),
        mergeMap(() => this.executeItemPatch(linkedItemId, 'metadata'))
      ))
    );
  }

  removeRelationPatch(targetItem: Item, relationIdToRemove: string, relationMetadataName: string): void {
    const relationMetadataList: MetadataValue[] = targetItem.findMetadataSortedByPlace(relationMetadataName);
    const relationPlace: number = findIndex(relationMetadataList, { value: relationIdToRemove });
    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    const path = pathCombiner.getPath([relationMetadataName, relationPlace.toString()]);
    this.operationsBuilder.remove(path);
  }

  /**
   * Remove a relation between two items by deleting authority from parent to child and from child to parent
   *
   * @param parentItemId               The parent item id
   * @param linkedItemId               The linked child item id
   * @param relationParentMetadataName The metadata that contains authority from child to parent
   * @param relationMetadataName       The metadata that contains authority from parent to child
   */
  unlinkItemFromParent(
    parentItemId: string,
    linkedItemId: string,
    relationParentMetadataName: string,
    relationMetadataName: string): Observable<Item> {
    return this.itemService.findById(parentItemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((parentItem: Item) => {
        this.removeRelationPatch(parentItem, linkedItemId, relationMetadataName);
      }),
      delay(100),
      mergeMap((parentItem: Item) => this.executeItemPatch(parentItem.id, 'metadata').pipe(
        mergeMap(() => this.itemService.findById(linkedItemId)),
        getFirstSucceededRemoteDataPayload(),
        tap((childItem: Item) => this.removeRelationPatch(childItem, parentItemId, relationParentMetadataName)),
        delay(100),
        mergeMap((taskItem: Item) => this.executeItemPatch(taskItem.id, 'metadata'))
      ))
    );
  }

  /**
   * Remove a relation between two items starting from the authority value which links child to parent
   *
   * @param targetItemId               The target item id from which find out the parent item
   * @param relationParentMetadataName The metadata that contains authority from child to parent
   * @param relationMetadataName       The metadata that contains authority from parent to child
   */
  removeRelationFromParent(
    targetItemId: string,
    relationParentMetadataName: string,
    relationMetadataName: string
  ): Observable<Item> {
    return this.itemService.findById(targetItemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      mergeMap((item: Item) => {
        const parentId = item.firstMetadataValue(relationParentMetadataName);
        if (isNotEmpty(parentId)) {
          return this.itemService.findById(parentId).pipe(
            getFirstSucceededRemoteDataPayload(),
            tap((parentItem: Item) => this.removeRelationPatch(parentItem, targetItemId, relationMetadataName)),
            delay(100),
            mergeMap((parentItem: Item) => this.executeItemPatch(parentItem.id, 'metadata')),
            map(() => item)
          );
        } else {
          return observableOf(item);
        }
      })
    );
  }

  /**
   * Remove a relation from a linked item to a parent item
   *
   * @param parentItemId               The parent item id
   * @param linkedItemId               The target item id from which to remove link to parent
   * @param relationParentMetadataName The metadata that contains authority from child to parent
   */
  removeParentRelationFromChild(
    parentItemId: string,
    linkedItemId: string,
    relationParentMetadataName: string
  ) {
    return this.itemService.findById(linkedItemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((childItem: Item) => this.removeRelationPatch(childItem, parentItemId, relationParentMetadataName)),
      delay(100),
      mergeMap((taskItem: Item) => this.executeItemPatch(taskItem.id, 'metadata'))
    );
  }

  /**
   * Remove from parent item the child relation by the child id
   *
   * @param parentItemId               The parent item id from which to remove link to child
   * @param linkedItemId               The linked item id to remove
   * @param relationChildMetadataName  The metadata that contains authority from parent to child
   */
  removeChildRelationFromParent(
    parentItemId: string,
    linkedItemId: string,
    relationChildMetadataName: string
  ): Observable<Item> {
    return this.itemService.findById(parentItemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((parentItem: Item) => {
        this.removeRelationPatch(parentItem, linkedItemId, relationChildMetadataName);
      }),
      delay(100),
      mergeMap((parentItem: Item) => this.executeItemPatch(parentItem.id, 'metadata'))
    );
  }

  /**
   * Remove a relation from a linked item to a parent item, by starting from parent authority values
   *
   * @param parentItemId               The parent item id from which selecting child items
   * @param relationParentMetadataName The metadata that contains authority from child to parent
   * @param relationMetadataName       The metadata that contains authority from parent to child
   */
  unlinkParentItemFromChildren(
    parentItemId: string,
    relationParentMetadataName: string,
    relationMetadataName: string
  ): Observable<Item> {
    return this.itemService.findById(parentItemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      mergeMap((parentItem: Item) => {
        return observableFrom(parentItem.findMetadataSortedByPlace(relationMetadataName)).pipe(
          concatMap((relationMetadata: MetadataValue) => this.unlinkItemFromParent(
            parentItemId,
            relationMetadata.value,
            relationParentMetadataName,
            relationMetadataName
          )),
          reduce((acc: any, value: any) => [...acc, ...value], []),
          map(() => parentItem)
        );
      }),
    );
  }

  /**
   * Reorder metadata authorities for an item
   *
   * @param parentItemId               The parent item id from which selecting child items
   * @param linkedItemIds              The list of item id in the new order
   * @param relationMetadataName       The metadata that contains authority from parent to child
   */
  orderRelations(
    parentItemId: string,
    linkedItemIds: string[],
    relationMetadataName: string
  ): Observable<Item> {
    return this.itemService.findById(parentItemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((childItem: Item) => this.addAllRelationsPatch(childItem, linkedItemIds, relationMetadataName)),
      delay(100),
      mergeMap((taskItem: Item) => this.executeItemPatch(taskItem.id, 'metadata'))
    );
  }

  private addRelationPatch(targetItem: Item, relatedItemTitle: string, relatedItemId: string, relation: string): void {
    const stepTasks: MetadataValue[] = targetItem.findMetadataSortedByPlace(relation);
    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    const taskToAdd = {
      value: relatedItemTitle,
      authority: relatedItemId,
      place: stepTasks.length,
      confidence: 600
    };
    const path = isEmpty(stepTasks) ? pathCombiner.getPath(relation)
      : pathCombiner.getPath([relation, '-']);

    this.operationsBuilder.add(
      path,
      taskToAdd,
      isEmpty(stepTasks),
      true);
  }

  private addAllRelationsPatch(targetItem: Item, relatedItemIds: string[], relation: string): void {
    const stepTasks: MetadataValue[] = targetItem.findMetadataSortedByPlace(relation);
    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    relatedItemIds.forEach((relatedItemId: string, index: number) => {
      const path = pathCombiner.getPath([relation, index.toString()]);
      const value = {
        value: relatedItemId,
        authority: relatedItemId,
        place: stepTasks.length,
        confidence: 600
      };
      this.operationsBuilder.replace(path, value, true);
    });
  }

  private executeItemPatch(objectId: string, pathName: string): Observable<Item> {
    return this.itemJsonPatchOperationsService.jsonPatchByResourceType(
      'items',
      objectId,
      pathName).pipe(
      tap((item: Item) => this.itemService.update(item)),
      catchError((error: ErrorResponse) => observableThrowError(new Error(error.errorMessage)))
    );
  }
}
