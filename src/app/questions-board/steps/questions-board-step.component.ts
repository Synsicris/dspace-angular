import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';
import { distinctUntilChanged, skip, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { QuestionsBoardStep } from '../core/models/questions-board-step.model';
import { QuestionsBoardStateService } from '../core/questions-board-state.service';
import { Community } from '../../core/shared/community.model';
import { Item } from '../../core/shared/item.model';
import { QuestionsBoardService } from '../core/questions-board.service';
import { SubmissionFormModel } from '../../core/config/models/config-submission-form.model';
import { EditSimpleItemModalComponent } from '../../shared/edit-simple-item-modal/edit-simple-item-modal.component';
import { QuestionsBoardType } from '../core/models/questions-board-type';

@Component({
  selector: 'ds-questions-board-step',
  templateUrl: './questions-board-step.component.html',
  styleUrls: ['./questions-board-step.component.scss']
})
export class QuestionsBoardStepComponent implements OnInit {

  /**
   * The project community id which the subproject belong to
   */
  @Input() public projectCommunityId: string;

  /**
   * The exploitation plan step object
   */
  @Input() public exploitationPlanStep: QuestionsBoardStep;

  /**
   * The funding community which the exploitation Plan belong to
   */
  @Input() fundingCommunity: Community;

  /**
   * Reference to teh ipwCollapse child component
   */
  @ViewChild('ipwCollapse') collapsable;

  /**
   * A boolean representing if compare mode is active
   */
  @Input() compareMode = false;

  /**
   * A boolean representing if item is a version of original item
   */
  @Input() isVersionOfAnItem = false;

  /**
   * The form config
   * @type {Observable<SubmissionFormModel>}
   */
  formConfig$: Observable<SubmissionFormModel>;

  /**
   * Indicate to show or not checkbox
   */
  hasCheckbox = false;

  constructor(
    protected exploitationPlanService: QuestionsBoardService,
    protected exploitationPlanStateService: QuestionsBoardStateService,
    protected modalService: NgbModal,
    protected translate: TranslateService
  ) {

  }

  ngOnInit(): void {
    this.hasCheckbox = this.exploitationPlanStep.type === QuestionsBoardType.Question1;
    this.formConfig$ = this.exploitationPlanService.getExploitationPlanStepFormConfig(this.exploitationPlanStep.type);
  }

  /**
   * After component view init after 2 times it sets the value, then start setting the state value for step
   */
  ngAfterViewInit() {
    this.collapsable.isCollapsed().pipe(
      skip(2),
      distinctUntilChanged()
    ).subscribe((val) => {
      this.exploitationPlanStateService.dispatchSetExploitationPlanStepCollapse(
        this.exploitationPlanStep.parentId,
        this.exploitationPlanStep.id,
        val
      );
    });
  }

  /**
   * Get the edit item mode
   */
  getEditMode(): string {
    return this.exploitationPlanService.getExploitationPlanEditMode();
  }

  /**
   * Get the path to metadata section to patch
   */
  getSectionName() {
    return this.exploitationPlanService.getExploitationPlanEditFormSection();
  }

  /**
   * Get exploitation-plan step title
   */
  getStepTitle(): string {
    return this.translate.instant('exploitation-plan.' + this.exploitationPlanStep.type + '.title');
  }

  /**
   * Open dialog box for editing exploitation-plan
   */
  openEditModal() {
    const modalRef = this.modalService.open(EditSimpleItemModalComponent, { size: 'lg' });
    modalRef.componentInstance.formConfig = this.formConfig$;
    modalRef.componentInstance.editMode = this.exploitationPlanService.getExploitationPlanEditMode();
    modalRef.componentInstance.formSectionName = this.exploitationPlanService.getExploitationPlanEditFormSection();
    modalRef.componentInstance.itemId = this.exploitationPlanStep.id;

    modalRef.componentInstance.itemUpdate.pipe(take(1))
      .subscribe((item: Item) => {
        this.updateExploitationPlanStep(item);
        modalRef.close();
      });
  }

  /**
   * Update exploitation-plan step object from given item
   * @param item
   */
  updateExploitationPlanStep(item: Item) {
    this.exploitationPlanStep = this.exploitationPlanService.updateExploitationPlanStep(item, this.exploitationPlanStep);
    this.exploitationPlanStateService.dispatchUpdateExploitationPlanStep(
      this.exploitationPlanStep.parentId,
      this.exploitationPlanStep
    );
  }

  /**
   * Get from selector the previously inserted collapsed value for the specific step
   */
  isCollapsed() {
    return this.exploitationPlanStateService.getCollapsable(this.exploitationPlanStep.parentId, this.exploitationPlanStep.id);
  }

}
