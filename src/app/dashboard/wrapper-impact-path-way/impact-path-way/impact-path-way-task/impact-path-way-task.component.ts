import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { ImpactPathWayTask } from '../../../models/impact-path-way-task.model';
import { DashboardService } from '../../../dashboard.service';
import { hasValue, isNotEmpty, isNotUndefined } from '../../../../shared/empty.util';
import { ImpactPathWayStep } from '../../../models/impact-path-way-step.model';

@Component({
  selector: 'ipw-impact-path-way-task',
  styleUrls: ['./impact-path-way-task.component.scss'],
  templateUrl: './impact-path-way-task.component.html'
})
export class ImpactPathWayTaskComponent implements OnInit, OnDestroy {

  @Input() public data: ImpactPathWayTask;
  @Input() public selectable: boolean;
  @Input() public multiSelectEnabled = false;
  @Input() public targetStep: ImpactPathWayStep;

  public hasFocus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private selectStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private subs: Subscription[] = [];

  @Output() public selected: EventEmitter<ImpactPathWayTask> = new EventEmitter();
  @Output() public deselected: EventEmitter<ImpactPathWayTask> = new EventEmitter();

  constructor(private service: DashboardService) {
  }

  ngOnInit(): void {
    this.service.getSelectedTask().pipe(
      filter((task: ImpactPathWayTask) => !this.multiSelectEnabled && isNotEmpty(task) && this.isSelectable()),
      map((task: ImpactPathWayTask) => task.item.id === this.data.item.id),
    ).subscribe((hasFocus) => this.selectStatus.next(hasFocus));

    this.subs.push(this.selectStatus.pipe(
      distinctUntilChanged(),
      filter(() => this.isSelectable()))
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

  public isDisabled() {
    return isNotUndefined(this.targetStep) && this.targetStep.hasTask(this.data);
  }

  private isSelectable() {
    return isNotUndefined(this.selectable) ? (!this.isDisabled() && this.selectable) : this.data.hasParent();
  }

  public setFocus(event): void {
    if (this.isSelectable()) {
      if (this.selectStatus.value) {
        this.selectStatus.next(false);
      } else {
        this.selectStatus.next(true);
      }
    }
  }

  removeTask() {
    this.service.removeTaskFromStep(this.data);
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
