import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgbActiveModal, NgbDropdownConfig, NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathwayStep } from '../../core/impact-pathway/models/impact-pathway-step.model';
import { ImpactPathwayService } from '../../core/impact-pathway/impact-pathway.service';
import { ImpactPathwayTask } from '../../core/impact-pathway/models/impact-pathway-task.model';
import { hasValue, isEmpty } from '../../shared/empty.util';

@Component({
  selector: 'ipw-search-task',
  styleUrls: ['./search-task.component.scss'],
  templateUrl: './search-task.component.html'
})
export class SearchTaskComponent implements OnInit, OnDestroy {

  @Input() step: ImpactPathwayStep;

  public availableTaskList$: Observable<ImpactPathwayTask[]>;
  public filteredTaskList$: BehaviorSubject<ImpactPathwayTask[]> = new BehaviorSubject<ImpactPathwayTask[]>([]);
  public selectable = true;
  public selectedTasks: ImpactPathwayTask[] = [];

  private subs: Subscription[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private service: ImpactPathwayService,
    private typeaheadConfig: NgbTypeaheadConfig,
    private dropdownConfig: NgbDropdownConfig
  ) {

    // customize default values of typeaheads used by this component tree
    typeaheadConfig.showHint = true;
    // customize default values of dropdowns used by this component tree
    dropdownConfig.autoClose = false;
  }

  ngOnInit(): void {
    if (isEmpty(this.step)) {
      this.availableTaskList$ = this.service.getAvailableImpactPathwayTasks();
    } else {
      this.availableTaskList$ = this.service.getAvailableImpactPathwayTasksByStepType(this.step.type);
    }

    this.subs.push(this.availableTaskList$.pipe(
      first()
    ).subscribe((taskList: ImpactPathwayTask[]) => {
      this.filteredTaskList$.next(taskList);
    }));
  }

  onSubmit() {
    this.selectedTasks.forEach((task) => {
      // this.step.addTask(this.service.cloneTask(task, this.step.id));
    });

    this.activeModal.close(true)
  }

  onTaskDeselected(task: ImpactPathwayTask) {
    const index: number = this.selectedTasks.indexOf(task);
    if (index !== -1) {
      this.selectedTasks.splice(index, 1);
    }
  }

  onTaskSelected(task: ImpactPathwayTask) {
    this.selectedTasks.push(task)
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
