import { Injectable } from '@angular/core';

import { from as observableFrom, Observable, of as observableOf, throwError as observableThrowError, } from 'rxjs';
import { catchError, concatMap, delay, map, mergeMap, reduce, tap } from 'rxjs/operators';
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

  linkItemToParent(
    parentItemId: string,
    itemId: string,
    relationParentMetadataName: string,
    relationMetadataName: string
  ): Observable<Item> {

    return this.itemService.findById(parentItemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((workpackageItem: Item) => this.addRelationPatch(workpackageItem, itemId, relationMetadataName)),
      delay(100),
      mergeMap((workpackageItem: Item) => this.executeItemPatch(workpackageItem.id, 'metadata').pipe(
        mergeMap(() => this.itemService.findById(itemId)),
        getFirstSucceededRemoteDataPayload(),
        tap((stepItem: Item) => this.addRelationPatch(stepItem, parentItemId, relationParentMetadataName)),
        delay(100),
        mergeMap((stepItem: Item) => this.executeItemPatch(stepItem.id, 'metadata'))
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

  unlinkItemFromParent(
    parentId: string,
    taskId: string,
    relationParentMetadataName: string,
    relationMetadataName: string): Observable<Item> {
    return this.itemService.findById(parentId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((parentItem: Item) => {
        this.removeRelationPatch(parentItem, taskId, relationMetadataName);
      }),
      delay(100),
      mergeMap((parentItem: Item) => this.executeItemPatch(parentItem.id, 'metadata').pipe(
        mergeMap(() => this.itemService.findById(taskId)),
        getFirstSucceededRemoteDataPayload(),
        tap((childItem: Item) => this.removeRelationPatch(childItem, parentId, relationParentMetadataName)),
        delay(100),
        mergeMap((taskItem: Item) => this.executeItemPatch(taskItem.id, 'metadata'))
      ))
    );
  }

  removeRelationFromParent(
    itemId: string,
    relationParentMetadataName: string,
    relationMetadataName: string
  ): Observable<Item> {
    return this.itemService.findById(itemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      mergeMap((item: Item) => {
        const parentId = item.firstMetadataValue(relationParentMetadataName);
        if (isNotEmpty(parentId)) {
          return this.itemService.findById(parentId).pipe(
            getFirstSucceededRemoteDataPayload(),
            tap((parentItem: Item) => this.removeRelationPatch(parentItem, itemId, relationMetadataName)),
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

  removeParentRelationFromChild(
    parentId: string,
    childId: string,
    relationParentMetadataName: string
  ) {
    return this.itemService.findById(childId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((childItem: Item) => this.removeRelationPatch(childItem, parentId, relationParentMetadataName)),
      delay(100),
      mergeMap((taskItem: Item) => this.executeItemPatch(taskItem.id, 'metadata'))
    );
  }

  /**
   * Remove from parent item the child relation by the child id
   * @param parentId
   * @param taskId
   * @param relationChildMetadataName
   */
  removeChildRelationFromParent(
    parentId: string,
    taskId: string,
    relationChildMetadataName: string
  ): Observable<Item> {
    return this.itemService.findById(parentId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((parentItem: Item) => {
        this.removeRelationPatch(parentItem, taskId, relationChildMetadataName);
      }),
      delay(100),
      mergeMap((parentItem: Item) => this.executeItemPatch(parentItem.id, 'metadata'))
    );
  }

  unlinkParentItemFromChildren(
    parentId: string,
    relationParentMetadataName: string,
    relationMetadataName: string
  ): Observable<Item> {
    return this.itemService.findById(parentId).pipe(
      getFirstSucceededRemoteDataPayload(),
      mergeMap((parentItem: Item) => {
        return observableFrom(parentItem.findMetadataSortedByPlace(relationMetadataName)).pipe(
          concatMap((relationMetadata: MetadataValue) => this.unlinkItemFromParent(
            parentId,
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

  private addRelationPatch(targetItem: Item, relatedItemId: string, relation: string): void {
    const stepTasks: MetadataValue[] = targetItem.findMetadataSortedByPlace(relation);
    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    const taskToAdd = {
      value: relatedItemId,
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
