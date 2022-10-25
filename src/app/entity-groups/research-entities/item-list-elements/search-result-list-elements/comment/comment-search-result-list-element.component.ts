import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, mergeMap, startWith, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { EditItemDataService } from '../../../../../core/submission/edititem-data.service';
import { EditItemMode } from '../../../../../core/submission/models/edititem-mode.model';
import { EditItem } from '../../../../../core/submission/models/edititem.model';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import { NoContent } from '../../../../../core/shared/NoContent.model';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { AuthorizationDataService } from '../../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../../core/data/feature-authorization/feature-id';
import { SubmissionFormModel } from '../../../../../core/config/models/config-submission-form.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import { SubmissionFormsConfigService } from '../../../../../core/config/submission-forms-config.service';
import { environment } from '../../../../../../environments/environment';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import {
  listableObjectComponent
} from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import {
  ItemSearchResultListElementComponent
} from '../../../../../shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import {
  EditSimpleItemModalComponent
} from '../../../../../shared/edit-simple-item-modal/edit-simple-item-modal.component';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import {
  getAllSucceededRemoteDataPayload,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteListPayload
} from '../../../../../core/shared/operators';
import { ConfigObject } from '../../../../../core/config/models/config.model';
import { ConfirmationModalComponent } from '../../../../../shared/confirmation-modal/confirmation-modal.component';
import { hasValue, isNotEmpty } from '../../../../../shared/empty.util';
import { followLink } from '../../../../../shared/utils/follow-link-config.model';
import { Item } from '../../../../../core/shared/item.model';

@listableObjectComponent('CommentSearchResult', ViewMode.ListElement)
@Component({
  selector: 'ds-comment-search-result-list-element',
  styleUrls: ['./comment-search-result-list-element.component.scss'],
  templateUrl: './comment-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Project
 */
export class CommentSearchResultListElementComponent extends ItemSearchResultListElementComponent implements OnInit {

  /**
   * List of Edit Modes available on this item
   * for the current user
   */
  private editModes$: BehaviorSubject<EditItemMode[]> = new BehaviorSubject<EditItemMode[]>([]);

  /**
   * Variable to track subscription and unsubscribe it onDestroy
   */
  private sub: Subscription;

  /**
   * Emit custom event for listable object custom actions.
   */
  @Output() customEvent = new EventEmitter<any>();

  constructor(
    protected truncatableService: TruncatableService,
    protected dsoNameService: DSONameService,
    private submissionFormsConfigService: SubmissionFormsConfigService,
    private authorizationService: AuthorizationDataService,
    private itemDataService: ItemDataService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    private editItemService: EditItemDataService,
    private modalService: NgbModal
  ) {
    super(truncatableService, dsoNameService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getEditModes();
  }

  /**
   * Open dialog box for editing comment
   */
  openEditModal(): void {
    const modalRef = this.modalService.open(EditSimpleItemModalComponent, { size: 'lg' });
    modalRef.componentInstance.formConfig = this.formConfiguration();
    modalRef.componentInstance.editMode = this.editModes$.value[0].name;
    modalRef.componentInstance.formSectionName = `sections/${environment.comments.commentEditFormSection}`;
    modalRef.componentInstance.itemId = this.dso.id;

    modalRef.componentInstance.itemUpdate.pipe(take(1))
      .subscribe((item: Item) => {
        this.dso = item;
        this.customEvent.emit(true);
        modalRef.close();
      });
  }

  /**
   * Open dialog box for deleting comment
   */
  openDeleteModal(): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.dso = this.dso;
    modalRef.componentInstance.headerLabel = 'confirmation-modal.delete-comment.header';
    modalRef.componentInstance.infoLabel = 'confirmation-modal.delete-comment.info';
    modalRef.componentInstance.cancelLabel = 'confirmation-modal.delete-comment.cancel';
    modalRef.componentInstance.confirmLabel = 'confirmation-modal.delete-comment.confirm';
    modalRef.componentInstance.brandColor = 'danger';
    modalRef.componentInstance.confirmIcon = 'fas fa-trash';
    modalRef.componentInstance.response.pipe(take(1)).subscribe((confirm: boolean) => {
      if (confirm) {
        if (hasValue(this.dso.id)) {
          this.itemDataService.delete(this.dso.id).pipe(getFirstCompletedRemoteData()).subscribe((restResponse: RemoteData<NoContent>) => {
            if (restResponse.hasSucceeded) {
              this.notificationsService.success(this.translateService.get('confirmation-modal.delete-comment.success'));
              this.customEvent.emit(true);
            } else {
              this.notificationsService.error('confirmation-modal.delete-comment.error');
            }
          });
        }
      }
    });
  }

  /**
   * Form configuraton for the comment to construct the formModel for ediging comment
   */
  formConfiguration(): Observable<SubmissionFormModel> {
    return this.submissionFormsConfigService.findByName(environment.comments.commentEditFormName).pipe(
      getFirstCompletedRemoteData(),
      map((configData: RemoteData<ConfigObject>) => configData.payload),
    ) as Observable<SubmissionFormModel>;
  }

  /**
   * Checks if the user can delete the comment
   */
  canDelete(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanDelete, this.dso.self);
  }

  /**
   * Checks if the user can edit the comment
   */
  canEdit(): Observable<boolean> {
    return this.editModes$.asObservable().pipe(
      map((editModes) => isNotEmpty(editModes) && editModes.length > 0)
    );
  }

  /**
   * Get the editModes
   */
  getEditModes(): void {
    this.sub = this.editItemService.findById(this.dso.id + ':none', false, true, followLink('modes')).pipe(
      getAllSucceededRemoteDataPayload(),
      mergeMap((editItem: EditItem) => editItem.modes.pipe(
        getFirstSucceededRemoteListPayload())
      ),
      startWith([])
    ).subscribe((editModes: EditItemMode[]) => {
      const allowedModes = editModes.filter((mode: EditItemMode) => this.isEditModeAllowed(mode));
      this.editModes$.next(allowedModes);
    });
  }

  /**
   * Filtering the edit modes for comment
   */
  private isEditModeAllowed(mode: EditItemMode) {
    return mode.name === 'FULL' || mode.name === environment.comments.commentEditMode || mode.name === 'OWNER';
  }

  /**
   * Destroy subscription on destroy
   */
  ngOnDestroy() {
    if (!!this.sub) {
      this.sub.unsubscribe();
    }
  }
}
