import { MetadataMap, MetadataValue } from '../../../core/shared/metadata.models';
import { Item } from '../../../core/shared/item.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../../core/auth/auth.service';
import {
  SubmissionImportExternalCollectionComponent
} from '../../../submission/import-external/import-external-collection/submission-import-external-collection.component';
import { CollectionListEntry } from '../../collection-dropdown/collection-dropdown.component';
import { EntityTypeDataService } from '../../../core/data/entity-type-data.service';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { hasValue, isEmpty, isNotEmpty } from '../../empty.util';
import {
  PERSON_ENTITY,
  PROJECT_ENTITY,
  PROJECT_RELATION_METADATA,
  ProjectDataService,
  VERSION_UNIQUE_ID
} from '../../../core/project/project-data.service';
import { environment } from '../../../../environments/environment';
import {
  CreateItemSubmissionModalComponent
} from '../../create-item-submission-modal/create-item-submission-modal.component';
import { ConfidenceType } from '../../../core/shared/confidence-type';
import { ItemDataService } from '../../../core/data/item-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';

@Component({
  selector: 'ds-comment-create',
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.scss']
})
export class CommentCreateComponent implements OnInit {

  /**
   * The item id for which the target entity type is related
   */
  @Input() itemId: string;

  /**
   * The entity type which the target entity type is related
   */
  @Input() relatedEntityType: string;
  /**
   * The entity type for which create an item
   */
  @Input() targetEntityType: string;

  /**
   * The current relevant scope
   */
  @Input() scope: string;

  /**
   * The condition to show or hide the button
   */
  canCreateComment$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * The entity type which the target entity type is related
   */
  item: Item;

  /**
   * The event emitter to be emitted when we want to refresh the page upon creation
   */
  @Output() refresh = new EventEmitter();

  constructor(
    private authorizationService: AuthorizationDataService,
    private authService: AuthService,
    private itemService: ItemDataService,
    private entityTypeService: EntityTypeDataService,
    private modalService: NgbModal,
    private projectService: ProjectDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    const item$ = this.itemService.findById(this.itemId).pipe(
      getFirstCompletedRemoteData(),
      map((itemRD: RemoteData<Item>) => {
        return itemRD.hasSucceeded ? itemRD.payload : null;
      })
    );

    item$.subscribe((item) => {
      this.item = item;
    });

    item$.pipe(
      switchMap((item: Item) => this.canCreateComment(item)),
      take(1)
    ).subscribe((canCreate) => this.canCreateComment$.next(canCreate));
  }

  protected canCreateComment(item: Item): Observable<boolean> {
    if (isEmpty(item) || this.relatedEntityType === PERSON_ENTITY) {
      return of(false);
    } else {
      const isVersionOfAnItem$ = this.route.data.pipe(
        map((data) => data.isVersionOfAnItem),
        filter((isVersionOfAnItem) => isVersionOfAnItem === true),
        take(1)
      );

      return this.projectService.getProjectItemByItemId(item.id).pipe(
        getFirstCompletedRemoteData(),
        withLatestFrom(isVersionOfAnItem$),
        switchMap(([projectItemRD, isVersionOfAnItem]: [RemoteData<Item>, boolean]) => {
          if (!isVersionOfAnItem) {
            return of(false);
          } else {
            const uniqueId = projectItemRD.payload.firstMetadataValue(VERSION_UNIQUE_ID);
            const projectId = uniqueId.split('_')[0];
            return this.itemService.findById(projectId).pipe(
              getFirstCompletedRemoteData(),
              switchMap((projItemRD: RemoteData<Item>) => this.authorizationService.isAuthorized(FeatureID.isFunderOfProject, projItemRD.payload.self))
            );
          }
        })
      );
    }
  }

  openDialog() {
    this.createEntity();
  }

  /**
   * It opens a dialog for selecting a collection.
   */
  private createEntity() {
    const modalRef = this.modalService.open(SubmissionImportExternalCollectionComponent);
    modalRef.componentInstance.entityType = this.targetEntityType;
    modalRef.componentInstance.scope = this.targetEntityType === environment.comments.commentEntityType ? null : this.scope;
    modalRef.componentInstance.selectedEvent.pipe(
      take(1)
    ).subscribe((collectionListEntry: CollectionListEntry) => {
      modalRef.close();
      this.createComment(collectionListEntry.collection.uuid);
    });
  }

  /**
   * Open creation comment modal
   */
  createComment(collectionIdentifier: string) {
    forkJoin({
      entityType: of(this.targetEntityType),
      collectionId: of(collectionIdentifier),
      formName: of(environment.comments.commentEditFormName),
      formSectionName: of(environment.comments.commentEditFormSection),
      customMetadata: this.getCustomCommentMetadataMap(),
    })
      .pipe(
        switchMap(({ entityType, collectionId, formName, formSectionName, customMetadata }) => {
          const modalRef = this.modalService.open(CreateItemSubmissionModalComponent, { size: 'lg' });
          let submissionModal = modalRef.componentInstance as CreateItemSubmissionModalComponent;
          submissionModal.entityType = entityType;
          submissionModal.collectionId = collectionId;
          submissionModal.formName = formName;
          submissionModal.formSectionName = formSectionName;
          submissionModal.customMetadata = customMetadata;
          return submissionModal.createItemEvent;
        }),
        take(1)
      ).subscribe(() => this.refresh.emit());
  }

  private getCustomCommentMetadataMap(): Observable<MetadataMap> {
    const customMetadata =
      Object.assign({}, new MetadataMap(), {
        ...this.generateVersionMetadata(environment.comments.commentRelationItemVersionMetadata, this.item),
        ...this.generateOriginalRelationMetadata(environment.comments.commentRelationItemMetadata, this.item)
      });
    let metadataMap$ = of(customMetadata).pipe(withLatestFrom(of(this.item)));
    const isRelatedToProject = this.relatedEntityType === PROJECT_ENTITY;
    if (!isRelatedToProject) {
      metadataMap$ =
        this.getMetadataMapWithRelatedProject$(customMetadata, this.item.firstMetadata(PROJECT_RELATION_METADATA));
    }
    return metadataMap$
      .pipe(
        map(([metadataMap, item]) =>
          Object.assign({}, metadataMap, {
            ...this.generateOriginalRelationMetadata(environment.comments.commentRelationProjectMetadata, item),
            ...this.generateVersionMetadata(environment.comments.commentRelationProjectVersionMetadata, item),
          }))
      );
  }

  private generateOriginalRelationMetadata(entryKey: string, item: Item) {
    let splittedUniqueId = item.firstMetadata(VERSION_UNIQUE_ID)?.value?.split('_');
    // if is not versioned, is the original item itself.
    if (!hasValue(splittedUniqueId) || !isNotEmpty(splittedUniqueId) || !hasValue(splittedUniqueId[0])) {
      splittedUniqueId = [item.id];
    }
    const authority = splittedUniqueId[0];
    return {
      [entryKey]: [
        Object.assign({}, new MetadataValue(), {
          value: `${item.entityType} - ${item.name}`,
          authority: authority,
          confidence: ConfidenceType.CF_ACCEPTED
        })
      ]
    };
  }

  private generateVersionMetadata(entryKey: string, item: Item) {
    return {
      [entryKey]: [
        Object.assign({}, new MetadataValue(), {
          value: `${item.entityType} - ${item.name}`,
          authority: item.id,
          confidence: ConfidenceType.CF_ACCEPTED
        })
      ]
    };
  }

  private getMetadataMapWithRelatedProject$(
    customMetadata: MetadataMap,
    relatedProjectMetadata: MetadataValue
  ): Observable<[MetadataMap, Item]> {
    return of(customMetadata)
      .pipe(
        withLatestFrom(
          of(relatedProjectMetadata)
            .pipe(
              filter(hasValue),
              switchMap(metadata =>
                this.itemService.findById(
                  metadata.authority,
                  true,
                  true
                )
                  .pipe(getFirstSucceededRemoteDataPayload())
              ),
            )
        )
      );
  }
}
