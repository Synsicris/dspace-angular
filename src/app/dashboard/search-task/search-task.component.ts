import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgbActiveModal, NgbDropdownConfig, NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathWayStep } from '../models/impact-path-way-step.model';
import { DashboardService } from '../dashboard.service';
import { ImpactPathWayTask } from '../models/impact-path-way-task.model';
import { hasValue, isEmpty } from '../../shared/empty.util';

@Component({
  selector: 'ipw-search-task',
  styleUrls: ['./search-task.component.scss'],
  templateUrl: './search-task.component.html'
})
export class SearchTaskComponent implements OnInit, OnDestroy {

  @Input() step: ImpactPathWayStep;

  public availableTaskList$: Observable<ImpactPathWayTask[]>;
  public filteredTaskList$: BehaviorSubject<ImpactPathWayTask[]> = new BehaviorSubject<ImpactPathWayTask[]>([]);
  public selectable = true;
  public selectedTasks: ImpactPathWayTask[] = [];

  private subs: Subscription[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private service: DashboardService,
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
      this.availableTaskList$ = this.service.getAvailableImpactPathWayTasks();
    } else {
      this.availableTaskList$ = this.service.getAvailableImpactPathWayTasksByStepType(this.step.type);
    }

    this.subs.push(this.availableTaskList$.pipe(
      first()
    ).subscribe((taskList: ImpactPathWayTask[]) => {
      this.filteredTaskList$.next(taskList);
    }));
  }

  onSubmit() {
    this.selectedTasks.forEach((task) => {
      this.step.addTask(this.service.cloneTask(task, this.step.id));
    });

    this.activeModal.close(true)
  }

  onTaskDeselected(task: ImpactPathWayTask) {
    const index: number = this.selectedTasks.indexOf(task);
    if (index !== -1) {
      this.selectedTasks.splice(index, 1);
    }
  }

  onTaskSelected(task: ImpactPathWayTask) {
    this.selectedTasks.push(task)
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
