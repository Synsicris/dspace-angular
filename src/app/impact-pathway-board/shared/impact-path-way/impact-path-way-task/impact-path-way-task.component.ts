import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest as combineLatestObservable, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';

import { ImpactPathwayTask } from '../../../core/models/impact-pathway-task.model';
import { ImpactPathwayService } from '../../../core/impact-pathway.service';
import { hasValue, isNotEmpty, isNotUndefined } from '../../../../shared/empty.util';
import { ImpactPathwayStep } from '../../../core/models/impact-pathway-step.model';
import { ImpactPathwayLinksService } from '../../../core/impact-pathway-links.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { EditItemDataService } from '../../../../core/submission/edititem-data.service';
import { EditItemMode } from '../../../../core/submission/models/edititem-mode.model';
import { environment } from '../../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemDetailPageModalComponent } from '../../../../item-detail-page-modal/item-detail-page-modal.component';

@Component({
  selector: 'ipw-impact-path-way-task',
  styleUrls: ['./impact-path-way-task.component.scss'],
  templateUrl: './impact-path-way-task.component.html'
})
export class ImpactPathWayTaskComponent implements OnInit, OnDestroy {

  /**
   * The project community's id
   */
  @Input() public projectCommunityId: string;
  @Input() public impactPathwayId: string;
  @Input() public impactPathwayStepId: string;
  @Input() public impactPathwayStepType: string;
  @Input() public data: ImpactPathwayTask;
  @Input() public selectable = true;
  @Input() public multiSelectEnabled = false;
  @Input() public parentStep: ImpactPathwayStep;
  @Input() public parentTask: ImpactPathwayTask;
  @Input() public stepHasDetail: boolean;
  @Input() public taskPosition: number;
  @Input() public isObjectivePage: boolean;

  public hasFocus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public selectStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isRedirectingToEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public taskHTMLDivId: string;
  public taskType$: Observable<string>;

  private removing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private subs: Subscription[] = [];
  private isTwoWayRelationSelected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private canEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Output() public selected: EventEmitter<ImpactPathwayTask> = new EventEmitter();
  @Output() public deselected: EventEmitter<ImpactPathwayTask> = new EventEmitter();

  constructor(
    private editItemDataService: EditItemDataService,
    private impactPathwayService: ImpactPathwayService,
    private impactPathwayLinksService: ImpactPathwayLinksService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.taskHTMLDivId = this.buildHTMLDivId();
    this.taskType$ = this.impactPathwayService.getImpactPathwayTaskType(
      this.impactPathwayStepType,
      this.data.type,
      this.isObjectivePage);
    this.impactPathwayService.getSelectedTask().pipe(
      filter((task: ImpactPathwayTask) => !this.multiSelectEnabled && isNotEmpty(task) && this.isTaskSelectable()),
      map((task: ImpactPathwayTask) => task.id === this.data.id),
    ).subscribe((hasFocus) => this.selectStatus.next(hasFocus));

    this.editItemDataService.checkEditModeByIDAndType(this.data.id, environment.projects.projectsEntityEditMode).pipe(
      take(1)
    ).subscribe((canEdit: boolean) => {
      this.canEdit$.next(canEdit);
    });

    this.subs.push(this.selectStatus.pipe(
      distinctUntilChanged(),
      filter(() => this.isTaskSelectable()))
      .subscribe((status: boolean) => {
        if (status) {
          this.selected.emit(this.data);
          this.hasFocus$.next(true);
        } else {
          this.deselected.emit(this.data);
          this.hasFocus$.next(false);
        }
      })
    );
  }

  public buildHTMLDivId() {
    return `task-${this.impactPathwayStepId}-${this.data.id}`;
  }

  public canShowRelationButton(isTwoWayRelation: boolean): Observable<boolean> {
    return combineLatestObservable(this.impactPathwayLinksService.isEditingLink(),
      this.impactPathwayLinksService.isEditingLinkOnOtherTask(this.taskHTMLDivId),
      this.impactPathwayLinksService.isEditingLinkOnTask(this.taskHTMLDivId)).pipe(
      map(([isEditing, isEditingOnOtherTask, isEditingOnTask]) => !isEditing ||
        isEditingOnOtherTask || (isEditingOnTask && this.isTwoWayRelationSelected.value !== isTwoWayRelation))
    );
  }

  public canHideRelationButtons(isTwoWayRelation: boolean): Observable<boolean> {
    return combineLatestObservable(this.impactPathwayLinksService.isEditingLinkOnOtherTask(this.taskHTMLDivId),
      this.impactPathwayLinksService.isEditingLinkOnTask(this.taskHTMLDivId)).pipe(
      map(([isEditingOnOtherTask, isEditingOnTask]) => isEditingOnOtherTask ||
        (isEditingOnTask && this.isTwoWayRelationSelected.value !== isTwoWayRelation))
    );
  }

  public canShowRelationCheckBox(): Observable<boolean> {
    // return this.impactPathwayLinksService.isEditingLinkOnOtherStepAndTask(this.impactPathwayStepId, this.taskHTMLDivId);
    return this.impactPathwayLinksService.isEditingLinkOnOtherTask(this.taskHTMLDivId);
  }

  public isEditingRelationOnTask(isTwoWayRelation: boolean): Observable<boolean> {
    return this.impactPathwayLinksService.isEditingLinkOnTask(this.taskHTMLDivId).pipe((
      map((isEditing) => isEditing && this.isTwoWayRelationSelected.value === isTwoWayRelation)
    ));
  }

  public isEditingRelation(): Observable<boolean> {
    return this.impactPathwayLinksService.isEditingLink();
  }

  public isTaskPartOfRelation(): Observable<boolean> {
    return this.impactPathwayLinksService.isLinkedWithActiveEditingTask(this.taskHTMLDivId);
  }

  public hasDetail() {
    return this.stepHasDetail && this.data.hasDetail();
  }

  public isDisabled() {
    return ((!this.isObjectivePage && isNotUndefined(this.parentStep) && this.parentStep.hasTask(this.data.id)) ||
      (this.isObjectivePage && isNotUndefined(this.parentTask) && this.parentTask.hasSubTask(this.data.id)));
  }

  public isProcessingRemove(): Observable<boolean> {
    return this.removing$.asObservable();
  }

  public onCheckBoxChange(event: MatCheckboxChange) {
    // const target = event.target as any;
    if (event.checked) {
      this.impactPathwayLinksService.dispatchAddRelation(
        this.taskHTMLDivId,
        this.impactPathwayId,
        this.impactPathwayStepId,
        this.data.id,
        this.data.title);
    } else {
      this.impactPathwayLinksService.dispatchRemoveRelation(this.taskHTMLDivId, this.data.id);
    }
  }

  public navigateToEditItemPage(): void {
    this.isRedirectingToEdit$.next(true);
    this.editItemDataService.searchEditModesByID(this.data.id).pipe(
      filter((editModes: EditItemMode[]) => editModes && editModes.length > 0),
      map((editModes: EditItemMode[]) => editModes[0]),
      take(1)
    ).subscribe((editMode: EditItemMode) => {
      this.router.navigate(['edit-items', this.data.id + ':' + editMode.name]);
      this.isRedirectingToEdit$.next(false);
    });
  }

  public setEditRelations(isTwoWayRelation: boolean): void {
    this.isTwoWayRelationSelected.next(isTwoWayRelation);
    this.impactPathwayLinksService.setEditLinks(
      this.impactPathwayId,
      this.impactPathwayStepId,
      this.isTwoWayRelationSelected.value,
      this.taskHTMLDivId,
      this.data.id
    );
  }

  public saveRelations(): void {
    this.impactPathwayLinksService.completeEditingLinks();
  }

  public setFocus(event): void {
    if (this.isTaskSelectable()) {
      if (this.selectStatus.value) {
        this.selectStatus.next(false);
      } else {
        this.selectStatus.next(true);
      }
    }
  }

  public removeTask() {
    this.removing$.next(true);
    if (this.isObjectivePage) {
      this.impactPathwayService.removeSubTaskFromTask(this.impactPathwayId, this.impactPathwayStepId, this.data.parentId, this.data.id, this.taskPosition);
    } else {
      this.impactPathwayService.removeTaskFromStep(this.impactPathwayId, this.impactPathwayStepId, this.data.id, this.taskPosition);
    }
  }

  public showObjectives() {
    const navExtras = { queryParams: { target: this.data.id }, relativeTo: this.route };
    this.router.navigate(['objectives', this.data.parentId], navExtras);
  }

  private isTaskSelectable() {
    return isNotUndefined(this.selectable) ? (!this.isDisabled() && this.selectable) : this.data.hasParent();
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  canEdit(): Observable<boolean> {
    return this.canEdit$.asObservable();
  }

  openItemModal() {
    const modalRef = this.modalService.open(ItemDetailPageModalComponent, { size: 'xl' });
    (modalRef.componentInstance as any).uuid = this.data.id;
  }
}
