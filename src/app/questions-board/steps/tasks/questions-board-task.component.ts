import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { hasValue } from '../../../shared/empty.util';
import { EditItemDataService } from '../../../core/submission/edititem-data.service';
import { QuestionsBoardService } from '../../core/questions-board.service';
import { QuestionsBoardStateService } from '../../core/questions-board-state.service';
import { QuestionsBoardTask } from '../../core/models/questions-board-task.model';
import { QuestionsBoardStep } from '../../core/models/questions-board-step.model';
import { environment } from '../../../../environments/environment';
import { ComparedVersionItemStatus } from '../../../core/project/project-version.service';
import { CompareItemComponent } from '../../../shared/compare-item/compare-item.component';
import { ItemDetailPageModalComponent } from '../../../item-detail-page-modal/item-detail-page-modal.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ds-questions-board-task',
  styleUrls: ['./questions-board-task.component.scss'],
  templateUrl: './questions-board-task.component.html'
})
export class QuestionsBoardTaskComponent implements OnInit, OnDestroy {

  /**
   * The project community id which the subproject belong to
   */
  @Input() public projectCommunityId: string;

  @Input() public exploitationPlanId: string;
  @Input() public exploitationPlanStepId: string;
  @Input() public exploitationPlanStepType: string;
  @Input() public exploitationPlanTask: QuestionsBoardTask;
  @Input() public selectable = true;
  @Input() public multiSelectEnabled = false;
  @Input() public parentStep: QuestionsBoardStep;
  @Input() public stepHasDetail: boolean;
  @Input() public taskPosition: number;
  @Input() public isObjectivePage: boolean;
  @Input() public data: QuestionsBoardTask;
  /**
   * The edit mode to use
   */
  private projectsEntityEditMode: string;

  /**
   * If the working-plan given is a version item
   */
  @Input() isVersionOf: boolean;

  /**
   * A boolean representing if compare mode is active
   */
  @Input() compareMode = false;


  public hasFocus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public selectStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isRedirectingToEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public taskType$: Observable<string>;

  private removing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private subs: Subscription[] = [];
  private canEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  ComparedVersionItemStatus = ComparedVersionItemStatus;

  constructor(
    private editItemDataService: EditItemDataService,
    protected exploitationPlanService: QuestionsBoardService,
    protected exploitationPlanStateService: QuestionsBoardStateService,
    private modalService: NgbModal,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.taskType$ = this.exploitationPlanService.getExploitationPlanTaskType(this.exploitationPlanStepType, this.exploitationPlanTask.type);

    const adminEdit$ = this.editItemDataService.checkEditModeByIdAndType(this.exploitationPlanTask.id, environment.projects.projectsEntityAdminEditMode).pipe(
      take(1)
    );
    const userEdit$ = this.editItemDataService.checkEditModeByIdAndType(this.exploitationPlanTask.id, environment.projects.projectsEntityEditMode).pipe(
      take(1)
    );

    combineLatest([adminEdit$, userEdit$])  .subscribe(([canAdminEdit, canUserEdit]: [boolean, boolean]) => {
      if (canUserEdit) {
        this.projectsEntityEditMode = environment.projects.projectsEntityEditMode;
      } else if (canAdminEdit) {
        this.projectsEntityEditMode = environment.projects.projectsEntityAdminEditMode;
      }

      this.canEdit$.next(canAdminEdit || canUserEdit);
    });
  }

  public isProcessingRemove(): Observable<boolean> {
    return this.removing$.asObservable();
  }

  public navigateToEditItemPage(): void {
    this.isRedirectingToEdit$.next(true);
    this.router.navigate(['edit-items', this.exploitationPlanTask.id + ':' + this.projectsEntityEditMode]);
    this.isRedirectingToEdit$.next(false);
  }

  public removeTask() {
    this.removing$.next(true);
    this.exploitationPlanStateService.removeTaskFromStep(this.exploitationPlanId, this.exploitationPlanStepId, this.exploitationPlanTask.id, this.taskPosition);
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  canEdit(): Observable<boolean> {
    return this.canEdit$.asObservable();
  }

  openItemModal() {
    const modalRef = this.modalService.open(ItemDetailPageModalComponent, { size: 'xl' });
    (modalRef.componentInstance as any).uuid = this.exploitationPlanTask.id;
  }

  /**
   * Open a modal for item metadata comparison
   */
  openCompareModal() {
    const modalRef = this.modalService.open(CompareItemComponent, { size: 'xl' });
    (modalRef.componentInstance as CompareItemComponent).baseItemId = this.data.id;
    (modalRef.componentInstance as CompareItemComponent).versionedItemId = this.data.compareId;
  }
}
