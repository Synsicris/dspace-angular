import { Injectable } from '@angular/core';
import { CollectionDataService } from '../data/collection-data.service';
import { VocabularyService } from '../submission/vocabularies/vocabulary.service';
import { SubmissionFormsConfigService } from '../config/submission-forms-config.service';
import { ItemDataService } from '../data/item-data.service';
import { JsonPatchOperationsBuilder } from '../json-patch/builder/json-patch-operations-builder';
import { ItemJsonPatchOperationsService } from '../data/item-json-patch-operations.service';
import { ItemAuthorityRelationService } from '../shared/item-authority-relation.service';
import { SubmissionJsonPatchOperationsService } from '../submission/submission-json-patch-operations.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestService } from '../data/request.service';
import { Router } from '@angular/router';
import { SearchService } from '../shared/search/search.service';
import { SubmissionService } from '../../submission/submission.service';
import { MetadataMap } from '../shared/metadata.models';
import { JsonPatchOperationPathCombiner } from '../json-patch/builder/json-patch-operation-path-combiner';
import { SubmissionObject } from '../submission/models/submission-object.model';
import { catchError, delay, map, mergeMap, take, tap } from 'rxjs/operators';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { Item } from '../shared/item.model';
import { ErrorResponse } from '../cache/response.models';
import { throwError as observableThrowError } from 'rxjs/internal/observable/throwError';
import { RemoteData } from '../data/remote-data';
import { Observable, of as observableOf } from 'rxjs';
import { getFirstSucceededRemoteDataPayload, getFirstSucceededRemoteListPayload } from '../shared/operators';
import { Collection } from '../shared/collection.model';

@Injectable()
export class ProjectItemService {

  constructor(
    private collectionService: CollectionDataService,
    private vocabularyService: VocabularyService,
    private formConfigService: SubmissionFormsConfigService,
    private itemService: ItemDataService,
    private operationsBuilder: JsonPatchOperationsBuilder,
    private itemJsonPatchOperationsService: ItemJsonPatchOperationsService,
    private itemAuthorityRelationService: ItemAuthorityRelationService,
    private submissionJsonPatchOperationsService: SubmissionJsonPatchOperationsService,
    private rdbService: RemoteDataBuildService,
    private requestService: RequestService,
    private router: Router,
    private searchService: SearchService,
    private submissionService: SubmissionService
  ) {
  }

  private addPatchOperationForItem(metadata: MetadataMap): void {

    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    Object.keys(metadata)
      .filter((metadataName) => metadataName !== 'dspace.entity.type')
      .forEach((metadataName) => {
        if (metadataName !== 'cris.workspace.shared') {
          this.operationsBuilder.add(pathCombiner.getPath(metadataName), metadata[metadataName], true, true);
        } else {
          const path = pathCombiner.getPath([metadataName, '0']);
          this.operationsBuilder.replace(path, metadata[metadataName], true);
        }
      });
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

  private executeSubmissionPatch(objectId: string, pathName: string): Observable<SubmissionObject> {
    return this.submissionJsonPatchOperationsService.jsonPatchByResourceID(
      'workspaceitems',
      objectId,
      'sections',
      pathName).pipe(
      take(1),
      map((result: SubmissionObject[]) => (result[0] && isEmpty(result[0].errors)) ? result[0] : null),
      catchError(() => observableOf(null))
    );
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

  private depositWorkspaceItem(submission: SubmissionObject): Observable<RemoteData<Item>> {
    return this.submissionService.depositSubmission(submission.self).pipe(
      mergeMap(() => this.itemService.findById((submission.item as Item).id))
    );
  }

  generateProjectItem(projectId: string, taskType: string, metadata: MetadataMap): Observable<Item> {
    return this.createProjectEntityWorkspaceItem(projectId, taskType).pipe(
      mergeMap((submission: SubmissionObject) => observableOf(submission.item).pipe(
        tap(() => this.addPatchOperationForItem(metadata)),
        delay(100),
        mergeMap((taskItem: Item) => this.executeItemPatch(taskItem.id, 'metadata').pipe(
          mergeMap(() => this.depositWorkspaceItem(submission).pipe(
            getFirstSucceededRemoteDataPayload()
          ))
        ))
      ))
    );
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
