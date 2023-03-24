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
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { isEmpty } from '../../empty.util';
import { PERSON_ENTITY, ProjectDataService, VERSION_UNIQUE_ID } from '../../../core/project/project-data.service';
import { environment } from '../../../../environments/environment';
import {
  CreateItemSubmissionModalComponent
} from '../../create-item-submission-modal/create-item-submission-modal.component';
import { ItemDataService } from '../../../core/data/item-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { CommentUtilsService } from '../shared/comment-utils.service';

@Component({
  selector: 'ds-comment-create',
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.scss']
})
export class CommentCreateComponent implements OnInit {


  /**
   * The board in which this comment is inserted: ImpactPathway, ExploitationPlan, InterimReport or their steps
   */
  @Input() relatedBoard: Item;

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
   * Flag determining whether to show only add icon or the icon with text
   */
  @Input() showIconOnly = false;

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
    private router: Router,
    private readonly commentService: CommentUtilsService
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

      return this.projectService.getRelatedProjectByItem(item).pipe(
        getFirstCompletedRemoteData(),
        withLatestFrom(isVersionOfAnItem$),
        switchMap(([projectItemRD, isVersionOfAnItem]: [RemoteData<Item>, boolean]) => {
          if (!isVersionOfAnItem) {
            return of(false);
          } else {
            const uniqueId = projectItemRD?.payload?.firstMetadataValue(VERSION_UNIQUE_ID);
            if (isEmpty(uniqueId)) {
              return of(false);
            } else {
              const projectId = uniqueId.split('_')[0];
              return this.itemService.findById(projectId).pipe(
                getFirstCompletedRemoteData(),
                switchMap((projItemRD: RemoteData<Item>) => this.authorizationService.isAuthorized(FeatureID.isFunderOfProject, projItemRD.payload.self))
              );
            }
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
      customMetadata: this.commentService.getCustomCommentMetadataMap(this.item, this.relatedBoard, this.relatedEntityType),
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
}
