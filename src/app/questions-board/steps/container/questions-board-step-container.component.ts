import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { QuestionsBoardStep } from '../../core/models/questions-board-step.model';
import { QuestionsBoardStateService } from '../../core/questions-board-state.service';
import {
  CreateSimpleItemModalComponent
} from '../../../shared/create-simple-item-modal/create-simple-item-modal.component';
import { QuestionsBoardService } from '../../core/questions-board.service';
import { SimpleItem } from '../../../shared/create-simple-item-modal/models/simple-item.model';
import { QuestionsBoardTask } from '../../core/models/questions-board-task.model';
import { ProjectGroupService } from '../../../core/project/project-group.service';
import { Community } from '../../../core/shared/community.model';
import { DragAndDropContainerComponent } from '../../shared/drag-and-drop/drag-and-drop-container.component';

@Component({
  selector: 'ds-questions-board-step-container',
  styleUrls: ['./questions-board-step-container.component.scss'],
  templateUrl: './questions-board-step-container.component.html'
})
export class QuestionsBoardStepContainerComponent extends DragAndDropContainerComponent {

  /**
   * The project community id which the subproject belong to
   */
  @Input() public projectCommunityId: string;

  /**
   * The exploitation plan step object
   */
  @Input() public exploitationPlanStep: QuestionsBoardStep;

  /**
   * The exploitation plan step behavior subject
   */
  public exploitationPlanStep$: BehaviorSubject<QuestionsBoardStep> = new BehaviorSubject<QuestionsBoardStep>(null);

  /**
   * The funding community which the exploitation Plan belong to
   */
  @Input() fundingCommunity: Community;

  /**
   * A boolean representing if compare mode is active
   */
  @Input() compareMode = false;

  /**
   * A boolean representing if item is a version of original item
   */
  @Input() isVersionOfAnItem = false;


  private processing$: Observable<boolean> = observableOf(false);

  constructor(
    protected cdr: ChangeDetectorRef,
    protected exploitationPlanService: QuestionsBoardService,
    protected exploitationPlanStateService: QuestionsBoardStateService,
    protected modalService: NgbModal,
    protected projectGroupService: ProjectGroupService
  ) {
    super(exploitationPlanService);
  }

  ngOnInit(): void {
    this.processing$ = this.exploitationPlanStateService.isProcessing();

    this.exploitationPlanStateService.getExploitationPlanStep(this.exploitationPlanStep.parentId).subscribe((steps) => {
      this.connectedToList = steps.map(step => step.id);
    });

    this.subs.push(this.exploitationPlanStateService.getExploitationPlanStepById(this.exploitationPlanStep.parentId, this.exploitationPlanStep.id)
      .subscribe((step: QuestionsBoardStep) => {
        this.exploitationPlanStep$.next(step);
      })
    );
  }

  openModal() {

    const modalRef = this.modalService.open(CreateSimpleItemModalComponent, { size: 'lg', keyboard: false, backdrop: 'static' });

    modalRef.result.then((result) => {
      if (result) {
        this.cdr.detectChanges();
      }
    }, () => null);
    modalRef.componentInstance.formConfig = this.exploitationPlanService.getExploitationPlanTaskFormConfig(this.exploitationPlanStep.type);
    modalRef.componentInstance.formHeader = this.exploitationPlanService.getExploitationPlanTaskFormHeader(this.exploitationPlanStep.type);
    modalRef.componentInstance.searchMessageInfoKey = this.exploitationPlanService.getExploitationPlanTaskSearchHeader(this.exploitationPlanStep.type);
    modalRef.componentInstance.processing = this.exploitationPlanStateService.isProcessing();
    modalRef.componentInstance.vocabularyName = this.exploitationPlanService.getTaskTypeAuthorityName(this.exploitationPlanStep.type);
    modalRef.componentInstance.searchConfiguration = this.exploitationPlanService.getSearchTaskConfigName(this.exploitationPlanStep.type);
    modalRef.componentInstance.scope = this.projectCommunityId;
    modalRef.componentInstance.startWithSearch = true;
    modalRef.componentInstance.query = this.buildExcludedTasksQuery();

    modalRef.componentInstance.createItem.subscribe((item: SimpleItem) => {
      this.exploitationPlanStateService.dispatchGenerateExploitationPlanTask(
        this.projectCommunityId,
        this.exploitationPlanStep.parentId,
        this.exploitationPlanStep.id,
        item.type.value,
        item.metadata);
    });
    modalRef.componentInstance.addItems.subscribe((items: SimpleItem[]) => {
      items.forEach((item) => {
        this.exploitationPlanStateService.dispatchAddExploitationPlanTaskAction(
          this.exploitationPlanStep.parentId,
          this.exploitationPlanStep.id,
          item.id);
      });
    });
  }

  /**
   * drop function utilized when the list is reordered
   */
  drop(event: CdkDragDrop<QuestionsBoardStep>) {

    if (event.previousContainer === event.container) {
      const newList = [...event.container.data.tasks];
      moveItemInArray(newList, event.previousIndex, event.currentIndex);
      this.exploitationPlanStateService.dispatchOrderTasks(this.exploitationPlanStep.parentId, this.exploitationPlanStep.id, newList, event.container.data.tasks);
    }
    this.isDragging.next(false);
    this.isDropAllowed.next(false);
  }


  listDropped(event: CdkDragDrop<QuestionsBoardStep>) {
    // console.log(event);
  }


  getTasks(): Observable<QuestionsBoardTask[]> {
    return this.exploitationPlanStateService.getExploitationPlanTasksByParentId(
      this.exploitationPlanStep.parentId,
      this.exploitationPlanStep.id
    );
  }

  isProcessing(): Observable<boolean> {
    return this.processing$;
  }

  private buildExcludedTasksQuery(): string {
    // const subprojectMembersGroup = this.projectGroupService.getProjectMembersGroupNameByCommunity(this.fundingCommunity);
    // let query = `(entityGrants:${ProjectGrantsTypes.Project} OR entityPolicyGroup:${subprojectMembersGroup})`;
    let query = '';
    if (this.exploitationPlanStep.getTasksIds().length > 0) {
      const excludedIdsQuery = '-(search.resourceid' + ':(' + this.exploitationPlanStep.getTasksIds().join(' OR ') + '))';
      query += `${excludedIdsQuery}`;
    }

    return query;
  }
}
