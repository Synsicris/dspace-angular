import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SubmissionRestService } from '../../../core/submission/submission-rest.service';
import { SubmissionService } from '../../submission.service';
import { SubmissionScopeType } from '../../../core/submission/submission-scope-type';
import { isNotEmpty } from '../../../shared/empty.util';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { Item } from '../../../core/shared/item.model';

/**
 * This component represents submission form footer bar.
 */
@Component({
  selector: 'ds-submission-form-footer',
  styleUrls: ['./submission-form-footer.component.scss'],
  templateUrl: './submission-form-footer.component.html'
})
export class SubmissionFormFooterComponent implements OnInit, OnChanges {

  /**
   * The submission id
   * @type {string}
   */
  @Input() submissionId: string;

  /**
   * The submission item
   * @type {string}
   */
  @Input() item: Item;

  /**
   * A boolean representing if discard and delete button should be disable or not
   * @type {string}
   */
  @Input() disableDeposit = false;

  /**
   * A boolean representing if discard and delete button should be disable or not
   * @type {string}
   */
  @Input() disableSaveForLater = false;

  /**
   * A boolean representing if a submission deposit operation is pending
   * @type {Observable<boolean>}
   */
  public processingDepositStatus: Observable<boolean>;

  /**
   * A boolean representing if a submission save operation is pending
   * @type {Observable<boolean>}
   */
  public processingSaveStatus: Observable<boolean>;

  /**
   * A boolean representing if showing deposit and discard buttons
   * @type {Observable<boolean>}
   */
  public showDeposit: Observable<boolean>;

  /**
   * A boolean representing if showing deposit and discard buttons
   * @type {Observable<boolean>}
   */
  public showSaveForLater: Observable<boolean>;

  /**
   * A boolean representing if submission form is valid or not
   * @type {Observable<boolean>}
   */
  public submissionIsInvalid: Observable<boolean> = observableOf(true);

  /**
   * A boolean representing if submission form has unsaved modifications
   */
  public hasUnsavedModification: Observable<boolean>;

  /**
   * A boolean representing if submission object can be deleted by current user
   */
  private canDelete$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Initialize instance variables
   *
   * @param {AuthorizationDataService} authorizationService
   * @param {NgbModal} modalService
   * @param {SubmissionRestService} restService
   * @param {SubmissionService} submissionService
   */
  constructor(private authorizationService: AuthorizationDataService,
              private modalService: NgbModal,
              private restService: SubmissionRestService,
              private submissionService: SubmissionService) {
  }

  ngOnInit(): void {
    this.authorizationService.isAuthorized(FeatureID.CanDelete, this.item.self)
      .subscribe((canDelete) => {
        this.canDelete$.next(this.submissionService.getSubmissionScope() === SubmissionScopeType.EditItem && canDelete);
      });
  }

  /**
   * Initialize all instance variables
   */
  ngOnChanges(changes: SimpleChanges) {
    if (isNotEmpty(this.submissionId)) {
      this.submissionIsInvalid = this.submissionService.getSubmissionStatus(this.submissionId).pipe(
        map((isValid: boolean) => isValid === false)
      );
      this.processingSaveStatus = this.submissionService.getSubmissionSaveProcessingStatus(this.submissionId);
      this.processingDepositStatus = this.submissionService.getSubmissionDepositProcessingStatus(this.submissionId);
      this.showDeposit = observableOf(!this.disableDeposit &&
        this.submissionService.getSubmissionScope() === SubmissionScopeType.WorkspaceItem);
      this.showSaveForLater = observableOf(!this.disableSaveForLater ||
        (this.disableSaveForLater && this.submissionService.getSubmissionScope() !== SubmissionScopeType.WorkspaceItem));
      this.hasUnsavedModification = this.submissionService.hasUnsavedModification();
    }
  }

  /**
   * Dispatch a submission save action
   */
  save(event) {
    this.submissionService.dispatchSave(this.submissionId, true);
  }

  /**
   * Dispatch a submission save for later action
   */
  saveLater(event) {
    this.submissionService.dispatchSaveForLater(this.submissionId);
  }

  /**
   * Dispatch a submission deposit action
   */
  public deposit(event) {
    this.submissionService.dispatchDeposit(this.submissionId);
  }

  public canDelete() {
    return this.canDelete$.asObservable();
  }

  /**
   * Dispatch a submission discard action
   */
  public confirmDiscard(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.submissionService.dispatchDiscard(
            this.submissionId,
            this.item.id,
            this.submissionService.getSubmissionScope() === SubmissionScopeType.EditItem
          );
        }
      }
    );
  }

  /**
   * Compute the proper label for the save for later button
   */
  public saveForLaterLabel(): string {
    if (this.submissionService.getSubmissionScope() === SubmissionScopeType.EditItem) {
      return 'submission.general.save-later.edit-item';
    }
    return 'submission.general.save-later';
  }

}
