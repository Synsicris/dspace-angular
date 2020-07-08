import { Injectable } from '@angular/core';

import { from as observableFrom, Observable } from 'rxjs';
import { catchError, concatMap, delay, flatMap, map, reduce, tap } from 'rxjs/operators';
import { findIndex } from 'lodash';

import { Item } from './item.model';
import { getFirstSucceededRemoteDataPayload } from './operators';
import { ItemDataService } from '../data/item-data.service';
import { ErrorResponse } from '../cache/response.models';
import { throwError as observableThrowError } from 'rxjs/internal/observable/throwError';
import { ItemJsonPatchOperationsService } from '../data/item-json-patch-operations.service';
import { MetadataValue } from './metadata.models';
import { JsonPatchOperationPathCombiner } from '../json-patch/builder/json-patch-operation-path-combiner';
import { isEmpty } from '../../shared/empty.util';
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
      flatMap((workpackageItem: Item) => this.executeItemPatch(workpackageItem.id, 'metadata').pipe(
        flatMap(() => this.itemService.findById(itemId)),
        getFirstSucceededRemoteDataPayload(),
        tap((stepItem: Item) => this.addRelationPatch(stepItem, parentItemId, relationParentMetadataName)),
        delay(100),
        flatMap((stepItem: Item) => this.executeItemPatch(stepItem.id, 'metadata'))
      ))
    );
  }

  removeRelationPatch(targetItem: Item, relationIdToRemove: string, relationMetadataName: string): void {
    const relationMetadataList: MetadataValue[] = targetItem.findMetadataSortedByPlace(relationMetadataName);
    const relationPlace: number = findIndex(relationMetadataList, { value: relationIdToRemove });
    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    const path = pathCombiner.getPath([relationMetadataName, relationPlace.toString()]);
    this.operationsBuilder.remove(path)
  }

  unlinkItemFromParent(
    parentId: string,
    taskId: string,
    relationParentMetadataName: string,
    relationMetadataName: string): Observable<Item> {
    return this.itemService.findById(parentId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((parentItem: Item) => {
        this.removeRelationPatch(parentItem, taskId, relationMetadataName)
      }),
      delay(100),
      flatMap((parentItem: Item) => this.executeItemPatch(parentItem.id, 'metadata').pipe(
        flatMap(() => this.itemService.findById(taskId)),
        getFirstSucceededRemoteDataPayload(),
        tap((childItem: Item) => this.removeRelationPatch(childItem, parentId, relationParentMetadataName)),
        delay(100),
        flatMap((taskItem: Item) => this.executeItemPatch(taskItem.id, 'metadata'))
      ))
    )
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
      flatMap((taskItem: Item) => this.executeItemPatch(taskItem.id, 'metadata'))
    )
  }

  unlinkParentItemFromChildren(
    parentId: string,
    relationParentMetadataName: string,
    relationMetadataName: string
  ): Observable<Item> {
    return this.itemService.findById(parentId).pipe(
      getFirstSucceededRemoteDataPayload(),
      flatMap((parentItem: Item) => {
        return observableFrom(parentItem.findMetadataSortedByPlace(relationMetadataName)).pipe(
          concatMap((relationMetadata: MetadataValue) => this.unlinkItemFromParent(
            parentId,
            relationMetadata.value,
            relationParentMetadataName,
            relationMetadataName
          )),
          reduce((acc: any, value: any) => [...acc, ...value], []),
          map(() => parentItem)
        )
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
      getFirstSucceededRemoteDataPayload(),
      tap((item: Item) => this.itemService.update(item)),
      catchError((error: ErrorResponse) => observableThrowError(new Error(error.errorMessage)))
    )
  }
}
