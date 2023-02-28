import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EditItemDataService } from '../../../core/submission/edititem-data.service';
import { QuestionsBoardStateService } from '../../core/questions-board-state.service';
import { QuestionsBoardTask } from '../../core/models/questions-board-task.model';
import { QuestionsBoardStep } from '../../core/models/questions-board-step.model';
import { environment } from '../../../../environments/environment';
import { ComparedVersionItemStatus } from '../../../core/project/project-version.service';
import { CompareItemComponent } from '../../../shared/compare-item/compare-item.component';
import { ItemDetailPageModalComponent } from '../../../item-detail-page-modal/item-detail-page-modal.component';

@Component({
  selector: 'ds-questions-board-task',
  styleUrls: ['./questions-board-task.component.scss'],
  templateUrl: './questions-board-task.component.html'
})
export class QuestionsBoardTaskComponent implements OnInit {

  /**
   * The prefix to use for the i19n keys
   */
  @Input() messagePrefix: string;

  /**
   * The project community id which the subproject belong to
   */
  @Input() public projectCommunityId: string;

  @Input() public questionsBoardId: string;
  @Input() public questionsBoardStepId: string;
  @Input() public questionsBoardStepType: string;
  @Input() public questionsBoardTask: QuestionsBoardTask;
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

  private removing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private canEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  ComparedVersionItemStatus = ComparedVersionItemStatus;

  constructor(
    private editItemDataService: EditItemDataService,
    protected questionsBoardStateService: QuestionsBoardStateService,
    private modalService: NgbModal,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const adminEdit$ = this.editItemDataService.checkEditModeByIdAndType(this.questionsBoardTask.id, environment.projects.projectsEntityAdminEditMode).pipe(
      take(1)
    );
    const userEdit$ = this.editItemDataService.checkEditModeByIdAndType(this.questionsBoardTask.id, environment.projects.projectsEntityEditMode).pipe(
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
    this.router.navigate(['edit-items', this.questionsBoardTask.id + ':' + this.projectsEntityEditMode]);
    this.isRedirectingToEdit$.next(false);
  }

  public removeTask() {
    this.removing$.next(true);
    this.questionsBoardStateService.removeTaskFromStep(this.questionsBoardId, this.questionsBoardStepId, this.questionsBoardTask.id, this.taskPosition);
  }

  canEdit(): Observable<boolean> {
    return this.canEdit$.asObservable();
  }

  openItemModal() {
    const modalRef = this.modalService.open(ItemDetailPageModalComponent, { size: 'xl' });
    (modalRef.componentInstance as any).uuid = this.questionsBoardTask.id;
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
