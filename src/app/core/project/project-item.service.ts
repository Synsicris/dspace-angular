import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import { catchError, delay, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';

import { Metadata } from '../shared/metadata.utils';
import { CollectionDataService } from '../data/collection-data.service';
import { VocabularyService } from '../submission/vocabularies/vocabulary.service';
import { SubmissionFormsConfigDataService } from '../config/submission-forms-config-data.service';
import { ItemDataService } from '../data/item-data.service';
import { JsonPatchOperationsBuilder } from '../json-patch/builder/json-patch-operations-builder';
import { ItemJsonPatchOperationsService } from '../data/item-json-patch-operations.service';
import { ItemAuthorityRelationService } from '../shared/item-authority-relation.service';
import { SubmissionJsonPatchOperationsService } from '../submission/submission-json-patch-operations.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestService } from '../data/request.service';
import { SubmissionService } from '../../submission/submission.service';
import { MetadataMap, MetadataValue } from '../shared/metadata.models';
import { JsonPatchOperationPathCombiner } from '../json-patch/builder/json-patch-operation-path-combiner';
import { SubmissionObject } from '../submission/models/submission-object.model';
import { isEmpty, isNotEmpty, isNotNull, isNull, isUndefined } from '../../shared/empty.util';
import { Item } from '../shared/item.model';
import { ErrorResponse } from '../cache/response.models';
import { RemoteData } from '../data/remote-data';
import { getFirstSucceededRemoteDataPayload, getFirstSucceededRemoteListPayload } from '../shared/operators';
import { Collection } from '../shared/collection.model';
import { environment } from '../../../environments/environment';
import { SubmitDataResponseDefinitionObject } from '../shared/submit-data-response-definition.model';

@Injectable()
export class ProjectItemService {

  constructor(
    private collectionService: CollectionDataService,
    private vocabularyService: VocabularyService,
    private formConfigService: SubmissionFormsConfigDataService,
    private itemService: ItemDataService,
    private operationsBuilder: JsonPatchOperationsBuilder,
    private itemJsonPatchOperationsService: ItemJsonPatchOperationsService,
    private itemAuthorityRelationService: ItemAuthorityRelationService,
    private submissionJsonPatchOperationsService: SubmissionJsonPatchOperationsService,
    private rdbService: RemoteDataBuildService,
    private requestService: RequestService,
    private router: Router,
    private submissionService: SubmissionService
  ) {
  }

  private addPatchOperationForItem(metadata: MetadataMap): void {

    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    Object.keys(metadata)
      .filter((metadataName) => metadataName !== 'dspace.entity.type')
      .forEach((metadataName) => {
        if (metadataName !== 'cris.project.shared') {
          this.operationsBuilder.add(pathCombiner.getPath(metadataName), metadata[metadataName], true, true);
        } else {
          const path = pathCombiner.getPath([metadataName, '0']);
          this.operationsBuilder.replace(path, metadata[metadataName], true);
        }
      });
  }

  createAddMetadataPatchOp(path: string, metadataName: string, value: any): void {
    const pathCombiner = new JsonPatchOperationPathCombiner(path);
    this.operationsBuilder.add(pathCombiner.getPath(metadataName), value, true, true);
  }

  createRemoveMetadataPatchOp(path: string, metadataName: string, position: number): void {
    const pathCombiner = new JsonPatchOperationPathCombiner(path);
    const pathObj = pathCombiner.getPath([metadataName, position.toString()]);
    this.operationsBuilder.remove(pathObj);
  }

  createReplaceMetadataPatchOp(path: string, metadataName: string, position: number, value: any): void {
    const pathCombiner = new JsonPatchOperationPathCombiner(path);
    const pathObj = pathCombiner.getPath([metadataName, position.toString()]);
    this.operationsBuilder.replace(pathObj, value, true);
  }

  createWorkspaceItem(projectId: string, taskType: string): Observable<SubmissionObject> {
    return this.getCollectionIdByProjectAndEntity(projectId, taskType).pipe(
      mergeMap((collectionId) => this.submissionService.createSubmission(collectionId, taskType).pipe(
        mergeMap((submission: SubmissionObject) =>
          (isNotEmpty(submission)) ? observableOf(submission) : observableThrowError(null)
        )
      )),
    );
  }

  private createProjectEntityWorkspaceItem(projectId: string, taskType: string): Observable<SubmissionObject> {
    return this.getCollectionIdByProjectAndEntity(projectId, taskType).pipe(
      mergeMap((collectionId) => this.submissionService.createSubmission(collectionId, taskType, false).pipe(
        mergeMap((submission: SubmissionObject) =>
          (isNotEmpty(submission)) ? observableOf(submission) : observableThrowError(null)
        )
      )),
    );
  }

  executeSubmissionPatch(objectId: string, pathName: string): Observable<SubmitDataResponseDefinitionObject> {
    return this.submissionJsonPatchOperationsService.jsonPatchByResourceID(
      'workspaceitems',
      objectId,
      'sections',
      pathName).pipe(
        take(1),
        map((result: any[]) => (result[0] && isEmpty(result[0].errors)) ? result[0] : null),
        catchError(() => observableOf(null))
      );
  }

  executeSubmissionPatchWithErrors(objectId: string, pathName: string): Observable<SubmitDataResponseDefinitionObject> {
    return this.submissionJsonPatchOperationsService.jsonPatchByResourceID(
      'workspaceitems',
      objectId,
      'sections',
      pathName).pipe(
        take(1),
        map((result: any[]) => (result[0]) ? result[0] : null),
        catchError(() => observableOf(null))
      );
  }

  executeEditItemPatch(objectId: string, pathName: string): Observable<SubmissionObject> {
    return this.submissionJsonPatchOperationsService.jsonPatchByResourceID(
      'edititems',
      objectId,
      'sections',
      pathName).pipe(
        take(1),
        map((result: SubmissionObject[]) => (result[0] && isEmpty(result[0].errors)) ? result[0].item : null),
        catchError(() => observableOf(null))
      );
  }

  executeItemPatch(objectId: string, pathName: string): Observable<Item> {
    return this.itemJsonPatchOperationsService.jsonPatchByResourceType(
      'items',
      objectId,
      pathName).pipe(
        tap((item: Item) => this.itemService.update(item)),
        catchError((error: ErrorResponse) => observableThrowError(new Error(error.errorMessage)))
      );
  }

  depositWorkspaceItem(submission: SubmissionObject): Observable<RemoteData<Item>> {
    return this.submissionService.depositSubmission(submission.self).pipe(
      mergeMap(() => this.itemService.findById((submission.item as Item).id))
    );
  }

  generateEntityItemWithinProject(formSectionName: string, projectId: string, taskType: string, metadata: MetadataMap): Observable<Item> {
    return this.createProjectEntityWorkspaceItem(projectId, taskType).pipe(
      mergeMap((submission: SubmissionObject) => observableOf(submission.item).pipe(
        tap(() => this.addWSIPatchOperationForItem(metadata, formSectionName)),
        delay(100),
        mergeMap((taskItem: Item) => this.executeSubmissionPatch(submission.id, formSectionName).pipe(
          mergeMap(() => this.depositWorkspaceItem(submission).pipe(
            getFirstSucceededRemoteDataPayload()
          ))
        ))
      ))
    );
  }

  public updateMultipleSubmissionMetadata(submissionObject: SubmissionObject, pathName: string, metadata: MetadataMap): Observable<any> {
    const pathCombiner = new JsonPatchOperationPathCombiner('sections', pathName);
    Object.keys(metadata)
      .forEach((metadataName) => {
        const metadataValues: MetadataValue[] = metadata[metadataName];
        metadataValues.forEach((metadataValue, place) => {
          const itemMetadataValues = Metadata.all(submissionObject.item.metadata, metadataName);
          const valueToSave: any = {
            value: metadataValue.value,
            language: metadataValue.language,
            authority: metadataValue.authority,
            place: metadataValue.place,
            confidence: metadataValue.confidence
          };
          if (isEmpty(valueToSave.value) || isUndefined(valueToSave.value) || isNull(valueToSave.value)) {
            const pathObj = pathCombiner.getPath([metadataName, place.toString()]);
            this.operationsBuilder.remove(pathObj);
          } else if (isNotEmpty(itemMetadataValues) && isNotEmpty(itemMetadataValues[place])) {
            const pathObj = pathCombiner.getPath([metadataName, place.toString()]);
            this.operationsBuilder.replace(pathObj, valueToSave, true);
          } else {
            this.operationsBuilder.add(pathCombiner.getPath(metadataName), valueToSave, true, true);
          }
        });
      });
    return observableOf({}).pipe(
      delay(400),
      switchMap(() => this.executeSubmissionPatchWithErrors(submissionObject.id, pathName)),
    );
  }

  private addWSIPatchOperationForItem(metadata: MetadataMap, pathName: string): void {

    const pathCombiner = new JsonPatchOperationPathCombiner('sections', pathName);
    Object.keys(metadata)
      .filter((metadataName) => metadataName !== 'dspace.entity.type')
      .forEach((metadataName) => {
        if (metadataName !== 'cris.project.shared') {
          this.operationsBuilder.add(pathCombiner.getPath(metadataName), metadata[metadataName], true, true);
        } else {
          const path = pathCombiner.getPath([metadataName, '0']);
          this.operationsBuilder.replace(path, metadata[metadataName], true);
        }
      });
  }

  private addWSIPatchOperationForImpactPathwayTask(metadata: MetadataMap, pathName: string, place: string = null): void {

    const pathCombiner = new JsonPatchOperationPathCombiner('sections', pathName);
    Object.keys(metadata)
      .filter((metadataName) => metadataName !== 'dspace.entity.type')
      .forEach((metadataName) => {
        if (metadataName !== 'cris.project.shared') {
          this.operationsBuilder.add(pathCombiner.getPath(metadataName), metadata[metadataName], true, true);
        } else {
          const path = pathCombiner.getPath([metadataName, '0']);
          this.operationsBuilder.replace(path, metadata[metadataName], true);
        }
      });
    if (isNotNull(place)) {
      this.operationsBuilder.add(
        pathCombiner.getPath(environment.workingPlan.workingPlanPlaceMetadata),
        place,
        true,
        true
      );
    }
  }

  private getCollectionIdByProjectAndEntity(projectId: string, entityType: string): Observable<string> {
    return this.collectionService.getAuthorizedCollectionByCommunityAndEntityType(projectId, entityType).pipe(
      getFirstSucceededRemoteListPayload(),
      map((list: Collection[]) => (list && list.length > 0) ? list[0] : null),
      map((collection: Collection) => isNotEmpty(collection) ? collection.id : null),
      tap(() => this.requestService.setStaleByHrefSubstring('findSubmitAuthorizedByCommunityAndMetadata'))
    );
  }

}
