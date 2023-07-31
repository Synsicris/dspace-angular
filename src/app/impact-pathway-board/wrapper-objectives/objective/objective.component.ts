import { ActivatedRoute, Data } from '@angular/router';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, skip, take } from 'rxjs/operators';
import { NgbAccordion, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathwayTask } from '../../core/models/impact-pathway-task.model';
import { ImpactPathwayStep } from '../../core/models/impact-pathway-step.model';
import { hasValue, isEmpty } from '../../../shared/empty.util';
import { ImpactPathwayService } from '../../core/impact-pathway.service';
import { EditSimpleItemModalComponent } from '../../../shared/edit-simple-item-modal/edit-simple-item-modal.component';
import { Item } from '../../../core/shared/item.model';
import { SubmissionFormModel } from '../../../core/config/models/config-submission-form.model';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../../../core/shared/operators';
import { EditItemDataService } from '../../../core/submission/edititem-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';

@Component({
  selector: 'ds-objective',
  styleUrls: ['./objective.component.scss', './../../../shared/comments/comment-list-box/comment-list.component.scss'],
  templateUrl: './objective.component.html'
})
export class ObjectiveComponent implements AfterViewInit, OnInit, OnDestroy {

  /**
   * The project community's id
   */
  @Input() public projectCommunityId: string;
  @Input() public impactPathwayStep: ImpactPathwayStep;
  @Input() public impactPathwayTask: ImpactPathwayTask;

  /**
   * If the current user is a funder project manager
   */
  @Input() isFunderProject: boolean;

  /**
   * A boolean representing if item is a version of original item
   */
  @Input() isVersionOfAnItem = false;

  @Input() public targetImpactPathwayTaskId: string;

  /**
   * A boolean representing if edit/add buttons are active
   */
  canEditButton$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * A boolean representing if compare mode is active
   */
  compareMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The form config
   * @type {Observable<SubmissionFormModel>}
   */
  formConfig$: Observable<SubmissionFormModel>;

  /**
   * The objective object item
   * @type {Observable<SubmissionFormModel>}
   */
  objectiveItem$: Observable<Item>;

  /**
   * The impact-pathway item
   * @type {Observable<SubmissionFormModel>}
   */
  impactPathWayItem$: Observable<Item>;

  /**
   * The impact-pathway step item
   * @type {Observable<SubmissionFormModel>}
   */
  impactPathWayStepItem$: Observable<Item>;

  @ViewChild('accordionRef', { static: false }) wrapper: NgbAccordion;

  /**
   * Reference to teh ipwCollapse child component
   */
  @ViewChild('ipwCollapse') collapsable;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  private subs: Subscription[] = [];

  constructor(
    private impactPathwayService: ImpactPathwayService,
    private modalService: NgbModal,
    private itemService: ItemDataService,
    protected editItemDataService: EditItemDataService,
    protected route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.formConfig$ = this.impactPathwayService.getImpactPathwayTaskEditFormConfig(this.impactPathwayStep.type);
    this.editItemDataService.checkEditModeByIdAndType(this.impactPathwayTask.id, this.impactPathwayService.getImpactPathwaysEditMode()).pipe(
      take(1)
    ).subscribe((canEdit: boolean) => {
      this.canEditButton$.next(canEdit);
    });
    this.objectiveItem$ = this.route.data.pipe(
      map((data: Data) => data.objectivesItem),
      take(1),
      getRemoteDataPayload()
    );
    this.impactPathWayItem$ =
      this.itemService.findById(this.impactPathwayStep.parentId)
        .pipe(
          getFirstCompletedRemoteData(),
          map(rd => rd.payload)
        );
    this.impactPathWayStepItem$ =
      this.itemService.findById(this.impactPathwayStep.id)
        .pipe(
          getFirstCompletedRemoteData(),
          map(rd => rd.payload)
        );

    this.subs.push(
      this.impactPathwayService.isCompareModeActive()
        .subscribe((compareMode: boolean) => this.compareMode$.next(compareMode))
    );
  }

  /**
   * After component view init after 2 times it sets the value, then start setting the state value for step
   */
  ngAfterViewInit() {
    this.collapsable.isCollapsed().pipe(
      skip(2),
      distinctUntilChanged()
    ).subscribe((val) => {
      this.impactPathwayService.dispatchSetImpactPathwaySubTaskCollapse(
        this.impactPathwayStep.id,
        this.impactPathwayTask.id,
        val
      );
    });
  }

  /**
   * Get the edit item mode
   */
  getEditMode(): string {
    return this.impactPathwayService.getImpactPathwaysEditMode();
  }

  /**
   * Get the path to metadata section to patch
   */
  getSectionName() {
    return this.impactPathwayService.getImpactPathwaysEditFormSection();
  }

  /**
   * Get from selector the previously inserted collapsed value for the specific step
   */
  isCollapsed(): Observable<ImpactPathwayTask> {
    return this.impactPathwayService.getCollapsable(this.impactPathwayStep.id, this.impactPathwayTask.id);
  }

  isOpen() {
    return this.impactPathwayTask.id === this.targetImpactPathwayTaskId || isEmpty(this.targetImpactPathwayTaskId);
  }

  updateDescription(value) {
    this.impactPathwayService.dispatchPatchImpactPathwayTaskMetadata(
      this.impactPathwayStep.parentId,
      this.impactPathwayStep.id,
      this.impactPathwayTask.id,
      this.impactPathwayTask,
      'dc.description',
      0,
      value
    );
  }

  updateTitle(value) {
    this.impactPathwayService.dispatchPatchImpactPathwayTaskMetadata(
      this.impactPathwayStep.parentId,
      this.impactPathwayStep.id,
      this.impactPathwayTask.id,
      this.impactPathwayTask,
      'dc.title',
      0,
      value
    );
  }

  /**
   * Open dialog box for editing exploitation-plan
   */
  openEditModal() {
    const modalRef = this.modalService.open(EditSimpleItemModalComponent, { size: 'lg' });
    modalRef.componentInstance.editMode = this.impactPathwayService.getImpactPathwaysEditMode();
    modalRef.componentInstance.formSectionName = this.impactPathwayService.getImpactPathwaysEditFormSection();
    modalRef.componentInstance.formConfig = this.impactPathwayService.getImpactPathwayTaskEditFormConfig(this.impactPathwayStep.type);
    modalRef.componentInstance.itemId = this.impactPathwayTask.id;

    modalRef.componentInstance.itemUpdate.pipe(take(1))
      .subscribe((item: Item) => this.updateImpactPathwayTask(item));
  }

  updateImpactPathwayTask(item: Item) {
    this.impactPathwayTask = this.impactPathwayService.updateImpactPathwayTask(item, this.impactPathwayTask);
    this.impactPathwayService.dispatchUpdateImpactPathwayTask(
      this.impactPathwayStep.parentId,
      this.impactPathwayStep.id,
      this.impactPathwayTask.id,
      this.impactPathwayTask
    );
  }

  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
