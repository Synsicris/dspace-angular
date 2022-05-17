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
   * @param patchPath             The path to metadata section to patch
   * @param editMode              The item edit mode
   * @param parentItemId          The parent item id
   * @param linkedItemId          The linked child item id
   * @param relationMetadataName  The metadata that contains authority from parent to child
   * @return the linked Item
   */
  addLinkedItemToParent(
    patchPath: string,
    editMode: string,
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
      tap(([parentItem, linkedItem]: [Item, Item]) => this.addRelationPatch(patchPath, parentItem, linkedItem.name, linkedItemId, relationMetadataName)),
      delay(100),
      mergeMap(([parentItem, linkedItem]: [Item, Item]) => this.executeEditItemPatch(parentItem.id, editMode, patchPath).pipe(
        mapTo(linkedItem)
      ))
    );
  }

  /**
   * Create a relation between two item by adding authority from parent to child and from child to parent
   *
   * @param patchPath                  The path to metadata section to patch
   * @param editMode                   The item edit mode
   * @param parentItemId               The parent item id
   * @param linkedItemId               The linked child item id
   * @param relationParentMetadataName The metadata that contains authority from child to parent
   * @param relationMetadataName       The metadata that contains authority from parent to child
   * @return the patched linked Item
   */
  linkItemToParent(
    patchPath: string,
    editMode: string,
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
      tap(([parentItem, linkedItem]: [Item, Item]) => this.addRelationPatch(patchPath, parentItem, linkedItem.name, linkedItemId, relationMetadataName)),
      delay(100),
      mergeMap(([parentItem, linkedItem]: [Item, Item]) => this.executeEditItemPatch(parentItem.id, editMode, patchPath).pipe(
        tap(() => this.addRelationPatch(patchPath, linkedItem, parentItem.name, parentItemId, relationParentMetadataName)),
        delay(100),
        mergeMap(() => this.executeEditItemPatch(linkedItemId, editMode, patchPath))
      ))
    );
  }

  /**
   * Generate patch operation for removing a relation
   *
   * @param patchPath             The path to metadata section to patch
   * @param targetItem            The parent item id
   * @param relationIdToRemove    The linked child item id
   * @param relationMetadataName  The metadata that contains authority from parent to child
   */
  removeRelationPatch(patchPath: string, targetItem: Item, relationIdToRemove: string, relationMetadataName: string): void {
    const relationMetadataList: MetadataValue[] = targetItem.findMetadataSortedByPlace(relationMetadataName);
    const relationPlace: number = findIndex(relationMetadataList, { authority: relationIdToRemove });
    if (relationPlace !== -1) {
      const pathCombiner = new JsonPatchOperationPathCombiner(patchPath);
      const path = pathCombiner.getPath([relationMetadataName, relationPlace.toString()]);
      this.operationsBuilder.remove(path);
    }
  }

  /**
   * Remove a relation between two items by deleting authority from parent to child and from child to parent
   *
   * @param patchPath                  The path to metadata section to patch
   * @param editMode                   The item edit mode
   * @param parentItemId               The parent item id
   * @param linkedItemId               The linked child item id
   * @param relationParentMetadataName The metadata that contains authority from child to parent
   * @param relationMetadataName       The metadata that contains authority from parent to child
   */
  unlinkItemFromParent(
    patchPath: string,
    editMode: string,
    parentItemId: string,
    linkedItemId: string,
    relationParentMetadataName: string,
    relationMetadataName: string): Observable<Item> {
    return this.itemService.findById(parentItemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((parentItem: Item) => {
        this.removeRelationPatch(patchPath, parentItem, linkedItemId, relationMetadataName);
      }),
      delay(100),
      mergeMap((parentItem: Item) => this.executeEditItemPatch(parentItem.id, editMode, patchPath).pipe(
        mergeMap(() => this.itemService.findById(linkedItemId)),
        getFirstSucceededRemoteDataPayload(),
        tap((childItem: Item) => this.removeRelationPatch(patchPath, childItem, parentItemId, relationParentMetadataName)),
        delay(100),
        mergeMap((taskItem: Item) => this.executeEditItemPatch(taskItem.id, editMode, patchPath))
      ))
    );
  }

  /**
   * Remove a relation between two items starting from the authority value which links child to parent
   *
   * @param patchPath                  The path to metadata section to patch
   * @param editMode                   The item edit mode
   * @param targetItemId               The target item id from which find out the parent item
   * @param relationParentMetadataName The metadata that contains authority from child to parent
   * @param relationMetadataName       The metadata that contains authority from parent to child
   */
  removeRelationFromParent(
    patchPath: string,
    editMode: string,
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
            tap((parentItem: Item) => this.removeRelationPatch(patchPath, parentItem, targetItemId, relationMetadataName)),
            delay(100),
            mergeMap((parentItem: Item) => this.executeEditItemPatch(parentItem.id, editMode, patchPath)),
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
   * @param patchPath                  The path to metadata section to patch
   * @param editMode                   The item edit mode
   * @param parentItemId               The parent item id
   * @param linkedItemId               The target item id from which to remove link to parent
   * @param relationParentMetadataName The metadata that contains authority from child to parent
   */
  removeParentRelationFromChild(
    patchPath: string,
    editMode: string,
    parentItemId: string,
    linkedItemId: string,
    relationParentMetadataName: string
  ) {
    return this.itemService.findById(linkedItemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((childItem: Item) => this.removeRelationPatch(patchPath, childItem, parentItemId, relationParentMetadataName)),
      delay(100),
      mergeMap((taskItem: Item) => this.executeEditItemPatch(taskItem.id, editMode, patchPath))
    );
  }

  /**
   * Remove from parent item the child relation by the child id
   *
   * @param patchPath                  The path to metadata section to patch
   * @param editMode                   The item edit mode
   * @param parentItemId               The parent item id from which to remove link to child
   * @param linkedItemId               The linked item id to remove
   * @param relationChildMetadataName  The metadata that contains authority from parent to child
   */
  removeChildRelationFromParent(
    patchPath: string,
    editMode: string,
    parentItemId: string,
    linkedItemId: string,
    relationChildMetadataName: string
  ): Observable<Item> {
    return this.itemService.findById(parentItemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((parentItem: Item) => {
        this.removeRelationPatch(patchPath, parentItem, linkedItemId, relationChildMetadataName);
      }),
      delay(100),
      mergeMap((parentItem: Item) => this.executeEditItemPatch(parentItem.id, editMode, patchPath))
    );
  }

  /**
   * Remove a relation from a linked item to a parent item, by starting from parent authority values
   *
   * @param patchPath                  The path to metadata section to patch
   * @param editMode                   The item edit mode
   * @param parentItemId               The parent item id from which selecting child items
   * @param relationParentMetadataName The metadata that contains authority from child to parent
   * @param relationMetadataName       The metadata that contains authority from parent to child
   */
  unlinkParentItemFromChildren(
    patchPath: string,
    editMode: string,
    parentItemId: string,
    relationParentMetadataName: string,
    relationMetadataName: string
  ): Observable<Item> {
    return this.itemService.findById(parentItemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      mergeMap((parentItem: Item) => {
        return observableFrom(parentItem.findMetadataSortedByPlace(relationMetadataName)).pipe(
          concatMap((relationMetadata: MetadataValue) => this.unlinkItemFromParent(
            patchPath,
            editMode,
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
   * @param patchPath            The path to metadata section to patch
   * @param editMode                   The item edit mode
   * @param parentItemId         The parent item id from which selecting child items
   * @param linkedItemIds        The list of item id in the new order
   * @param relationMetadataName The metadata that contains authority from parent to child
   */
  orderRelations(
    patchPath: string,
    editMode: string,
    parentItemId: string,
    linkedItemIds: string[],
    relationMetadataName: string
  ): Observable<Item> {
    return this.itemService.findById(parentItemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((childItem: Item) => this.replaceAllRelationsPatch(patchPath, childItem, linkedItemIds, relationMetadataName)),
      delay(100),
      mergeMap((taskItem: Item) => this.executeEditItemPatch(taskItem.id, editMode, patchPath))
    );
  }

  /**
   * Patch an array of relations to an item
   *
   * @param patchPath            The path to metadata section to patch
   * @param editMode             The item edit mode
   * @param targetItemId         The target item id to patch
   * @param linkedItems          The list of MetadataValue to patch
   * @param relationMetadataName The metadata that contains authority from parent to child
   */
  patchArrayOfRelations(
    patchPath: string,
    editMode: string,
    targetItemId: string,
    linkedItems: Partial<MetadataValue>[],
    relationMetadataName: string
  ): Observable<Item> {
    return observableOf(targetItemId).pipe(
      tap(() => this.addAllRelationsPatch(patchPath, linkedItems, relationMetadataName)),
      delay(100),
      mergeMap((itemId: string) => this.executeEditItemPatch(itemId, editMode, patchPath))
    );
  }

  private addRelationPatch(patchPath: string, targetItem: Item, relatedItemTitle: string, relatedItemId: string, relation: string): void {
    const stepTasks: MetadataValue[] = targetItem.findMetadataSortedByPlace(relation);
    const pathCombiner = new JsonPatchOperationPathCombiner(patchPath);
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

  private replaceAllRelationsPatch(patchPath: string, targetItem: Item, relatedItemIds: string[], relation: string): void {
    const stepTasks: MetadataValue[] = targetItem.findMetadataSortedByPlace(relation);
    const pathCombiner = new JsonPatchOperationPathCombiner(patchPath);
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

  private addAllRelationsPatch(patchPath: string, relatedItems: Partial<MetadataValue>[], relation: string): void {
    const pathCombiner = new JsonPatchOperationPathCombiner(patchPath);
    const value = [];
    relatedItems.forEach((relatedItem: Partial<MetadataValue>, index: number) => {
      value.push({
        value: relatedItem.value,
        authority: relatedItem.authority,
        place: index,
        confidence: 600
      });

    });
    const path = pathCombiner.getPath([relation]);
    this.operationsBuilder.add(path, value, true);
  }

  executeEditItemPatch(objectId: string, editMode: string, patchPath: string): Observable<Item> {
    const editItemId = `${objectId}:${editMode}`;
    return this.itemJsonPatchOperationsService.jsonPatchByResourceType(
      'edititems',
      editItemId,
      patchPath).pipe(
      tap((item: Item) => this.itemService.update(item)),
      catchError((error: ErrorResponse) => {
        console.error(error.errorMessage);
        return observableThrowError(new Error(error.errorMessage));
      })
    );
  }

  private executeItemPatch(objectId: string, patchPath: string): Observable<Item> {
    return this.itemJsonPatchOperationsService.jsonPatchByResourceType(
      'items',
      objectId,
      patchPath).pipe(
      tap((item: Item) => this.itemService.update(item)),
      catchError((error: ErrorResponse) => {
        console.log(error.errorMessage);
        return observableThrowError(new Error(error.errorMessage));
      })
    );
  }
}
