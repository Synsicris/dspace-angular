import { EditItemDataService } from 'src/app/core/submission/edititem-data.service';
import { EditItemMode } from './../../../../../core/submission/models/edititem-mode.model';
import { EditItem } from './../../../../../core/submission/models/edititem.model';
import { NotificationsService } from './../../../../../shared/notifications/notifications.service';
import { NoContent } from './../../../../../core/shared/NoContent.model';
import { ItemDataService } from './../../../../../core/data/item-data.service';
import { AuthorizationDataService } from './../../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from './../../../../../core/data/feature-authorization/feature-id';
import { SubmissionFormModel } from './../../../../../core/config/models/config-submission-form.model';
import { RemoteData } from './../../../../../core/data/remote-data';
import { SubmissionFormsConfigService } from './../../../../../core/config/submission-forms-config.service';
import { environment } from './../../../../../../environments/environment';
import { DSONameService } from './../../../../../core/breadcrumbs/dso-name.service';
import { Component, OnInit } from '@angular/core';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { ItemSearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { EditSimpleItemModalComponent } from '../../../../../shared/edit-simple-item-modal/edit-simple-item-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { getFirstCompletedRemoteData, getAllSucceededRemoteDataPayload, getFirstSucceededRemoteListPayload } from './../../../../../core/shared/operators';
import { map, mergeMap, startWith, take } from 'rxjs/operators';
import { ConfigObject } from './../../../../../core/config/models/config.model';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ConfirmationModalComponent } from './../../../../../shared/confirmation-modal/confirmation-modal.component';
import { hasValue, isNotEmpty } from './../../../../../shared/empty.util';
import { TranslateService } from '@ngx-translate/core';
import { followLink } from './../../../../../shared/utils/follow-link-config.model';
import { Item } from './../../../../../core/shared/item.model';
import { of } from 'rxjs';

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
    modalRef.componentInstance.editMode = environment.comment.commentEditMode;
    modalRef.componentInstance.formSectionName = environment.comment.commentEditFormSection;
    modalRef.componentInstance.itemId = this.dso.id;

    modalRef.componentInstance.itemUpdate.pipe(take(1))
      .subscribe((item: Item) => {
        this.dso = item;
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
              this.notificationsService.success(this.translateService.get('notification.deleted.success', { name: this.dso.name }));
            } else {
              this.notificationsService.error('Error occured when trying to delete EPerson with id: ' + this.dso.id + ' with code: ' + restResponse.statusCode + ' and message: ' + restResponse.errorMessage);
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
    return this.submissionFormsConfigService.findByName(environment.comment.commentEditFormSection).pipe(
      getFirstCompletedRemoteData(),
      map((configData: RemoteData<ConfigObject>) => configData.payload),
    ) as Observable<SubmissionFormModel>;
  }

  /**
   * Checks if the user can delete the comment
   */
  getCanDelete(): Observable<boolean> {
    return of(true);
    return this.authorizationService.isAuthorized(FeatureID.CanDelete, this.dso.self);
  }

  /**
   * Checks if the user can edit the comment
   */
  getCanEdit(): Observable<boolean> {
    return of(true);
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
    return mode.name === 'FULL' || mode.name === environment.comment.commentEditMode || mode.name === 'OWNER';
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
