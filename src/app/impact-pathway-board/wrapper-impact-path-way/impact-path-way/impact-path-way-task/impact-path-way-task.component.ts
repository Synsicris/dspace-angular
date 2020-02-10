import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { ImpactPathwayTask } from '../../../../core/impact-pathway/models/impact-pathway-task.model';
import { ImpactPathwayService } from '../../../../core/impact-pathway/impact-pathway.service';
import { hasValue, isNotEmpty, isNotUndefined } from '../../../../shared/empty.util';
import { ImpactPathwayStep } from '../../../../core/impact-pathway/models/impact-pathway-step.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'ipw-impact-path-way-task',
  styleUrls: ['./impact-path-way-task.component.scss'],
  templateUrl: './impact-path-way-task.component.html'
})
export class ImpactPathWayTaskComponent implements OnInit, OnDestroy {

  @Input() public impactPathwayId: string;
  @Input() public impactPathwayStepId: string;
  @Input() public data: ImpactPathwayTask;
  @Input() public selectable: boolean;
  @Input() public multiSelectEnabled = false;
  @Input() public targetStep: ImpactPathwayStep;
  @Input() public stepHasDetail: boolean;
  @Input() public taskPosition: number;
  @Input() public isObjectivePage: boolean;

  public hasFocus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private removing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private selectStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private subs: Subscription[] = [];

  @Output() public selected: EventEmitter<ImpactPathwayTask> = new EventEmitter();
  @Output() public deselected: EventEmitter<ImpactPathwayTask> = new EventEmitter();

  constructor(private service: ImpactPathwayService, private router: Router) {
  }

  ngOnInit(): void {
    this.service.getSelectedTask().pipe(
      filter((task: ImpactPathwayTask) => !this.multiSelectEnabled && isNotEmpty(task) && this.isSelectable()),
      map((task: ImpactPathwayTask) => task.id === this.data.id),
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

  public hasDetail() {
    return this.stepHasDetail && this.data.hasDetail();
  }

  public isDisabled() {
    return isNotUndefined(this.targetStep) && this.targetStep.hasTask(this.data.id);
  }

  public isProcessingRemove(): Observable<boolean> {
    return this.removing$.asObservable();
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
    this.removing$.next(true);
    if (this.isObjectivePage) {
      this.service.removeSubTaskFromTask(this.impactPathwayId, this.impactPathwayStepId, this.data.parentId, this.data.id, this.taskPosition);
    } else {
      this.service.removeTaskFromStep(this.impactPathwayId, this.impactPathwayStepId, this.data.id, this.taskPosition);
    }
  }

  showObjectives() {
    this.router.navigate(['objectives', this.data.parentId, 'edit'], { queryParams: { target: this.data.id } })
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
