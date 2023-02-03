import { MetadataMap, MetadataValue } from '../../../core/shared/metadata.models';
import { Item } from '../../../core/shared/item.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../../core/auth/auth.service';
import {
  SubmissionImportExternalCollectionComponent
} from '../../../submission/import-external/import-external-collection/submission-import-external-collection.component';
import { CollectionListEntry } from '../../collection-dropdown/collection-dropdown.component';
import { EntityTypeDataService } from '../../../core/data/entity-type-data.service';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of } from 'rxjs';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { hasValue, isNotEmpty } from '../../empty.util';
import { CreateProjectComponent } from '../../../projects/create-project/create-project.component';
import {
  FUNDING_ENTITY,
  PERSON_ENTITY,
  PROJECT_ENTITY,
  PROJECT_RELATION_METADATA,
  PROJECTPATNER_ENTITY_METADATA,
  SUBCONTRACTOR_ENTITY_METADATA,
  VERSION_UNIQUE_ID
} from '../../../core/project/project-data.service';
import { environment } from '../../../../environments/environment';
import {
  CreateItemSubmissionModalComponent
} from '../../create-item-submission-modal/create-item-submission-modal.component';
import { ConfidenceType } from '../../../core/shared/confidence-type';
import { ItemDataService } from '../../../core/data/item-data.service';

@Component({
  selector: 'ds-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.scss']
})
export class ItemCreateComponent implements OnInit {

  /**
   * The entity type which the target entity type is related
   */
  @Input() item: Item;

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
  canShow$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The event emitter to be emitted when we want to refresh the page upon creation
   */
  @Output() refresh = new EventEmitter();

  constructor(
    private authService: AuthService,
    private itemService: ItemDataService,
    private entityTypeService: EntityTypeDataService,
    private modalService: NgbModal,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    combineLatest([
      this.authService.isAuthenticated(),
      this.entityTypeService.getEntityTypeByLabel(this.targetEntityType).pipe(
        getFirstSucceededRemoteDataPayload()
      )]
    ).pipe(
      map(([isAuthenticated, entityType]) =>
        isAuthenticated &&
        isNotEmpty(entityType) &&
        this.canCreateSubContractor(entityType) &&
        this.canCreateProjectPartner(entityType) &&
        this.canCreateComment(entityType)
      ),
      take(1)
    ).subscribe((canShow) => this.canShow$.next(canShow));
  }

  protected canCreateComment(entityType) {
    return !(this.relatedEntityType === PERSON_ENTITY && entityType.label === environment.comments.commentEntityType);
  }

  protected canCreateProjectPartner(entityType) {
    return !(this.relatedEntityType === PROJECT_ENTITY && entityType.label === PROJECTPATNER_ENTITY_METADATA);
  }

  protected canCreateSubContractor(entityType) {
    return !(this.relatedEntityType === PROJECT_ENTITY && entityType.label === SUBCONTRACTOR_ENTITY_METADATA);
  }

  /**
   * Return if the user is authenticated
   */
  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  openDialog() {
    if (this.targetEntityType === FUNDING_ENTITY) {
      this.createSubproject();
    } else {
      this.createEntity();
    }
  }
  /**
   * It opens a dialog for selecting a collection.
   */
  createEntity() {
    const modalRef = this.modalService.open(SubmissionImportExternalCollectionComponent);
    modalRef.componentInstance.entityType = this.targetEntityType;
    modalRef.componentInstance.scope = this.targetEntityType === environment.comments.commentEntityType ? null : this.scope;
    modalRef.componentInstance.selectedEvent.pipe(
      take(1)
    ).subscribe((collectionListEntry: CollectionListEntry) => {
      modalRef.close();
      if (this.targetEntityType === environment.comments.commentEntityType) {
        this.createComment(collectionListEntry.collection.uuid);
      } else {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            ['collection']: collectionListEntry.collection.uuid,
          }
        };
        if (this.targetEntityType) {
          navigationExtras.queryParams.entityType = this.targetEntityType;
        }
        this.router.navigate(['/submit'], navigationExtras);
      }
    });
  }

  /**
   * Open creation sub-project modal
   */
  createSubproject() {
    const modalRef = this.modalService.open(CreateProjectComponent, { keyboard: false, backdrop: 'static', size: 'lg' });
    modalRef.componentInstance.isSubproject = true;
    modalRef.componentInstance.parentProjectUUID = this.scope;
  }

  /**
   * Open creation comment modal
   */
  createComment(collectionId: string) {
    forkJoin({
      entityType: of(this.targetEntityType),
      collectionId: of(collectionId),
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
    let splittedUniqueId = this.item.firstMetadata(VERSION_UNIQUE_ID)?.value?.split('_');
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
    }
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
    }
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
