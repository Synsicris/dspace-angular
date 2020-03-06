import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MAT_DATE_FORMATS, MatSelectChange } from '@angular/material';

import { Observable, of as observableOf } from 'rxjs';
import { ResizeEvent } from 'angular-resizable-element';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { WorkpackageDatabase } from '../../workpackage-database';
import { range } from '../../../shared/array.util';
import { CreateSimpleItemModalComponent } from '../../../shared/create-simple-item-modal/create-simple-item-modal.component';
import { SimpleItem } from '../../../shared/create-simple-item-modal/models/simple-item.model';
import { ChartStepTaskTypeList } from '../../../core/working-plan/models/workpackage-step-task-type';
import { WorkpacakgeFlatNode } from '../../../core/working-plan/models/workpackage-step-flat-node.model';
import {
  Workpackage,
  WorkpackageStep,
  WorkpackageTreeObject
} from '../../../core/working-plan/models/workpackage-step.model';
import { moment, WorkingPlanService } from '../../../core/working-plan/working-plan.service';
import { WorkingPlanStateService } from '../../../core/working-plan/working-plan-state.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD MMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export enum ChartDateViewType {
  day = 'day',
  month = 'month',
  year = 'year'
}

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'ipw-working-plan-chart-container',
  templateUrl: './working-plan-chart-container.component.html',
  styleUrls: ['./working-plan-chart-container.component.scss'],
  providers: [
    WorkpackageDatabase,
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class WorkingPlanChartContainerComponent implements OnInit {
  @Input() workpackages: Observable<Workpackage[]>;

  dateFormat = 'YYYY-MM-DD';
  dateMonthFormat = 'YYYY-MM';
  dateYearFormat = 'YYYY';
  disableProgress = true;
  moment = moment;
  dates: string[] = []; // all days in chart
  datesMonth: string[] = []; // all months in chart
  datesYear: string[] = []; // all years in chart
  today = moment().format(this.dateFormat);
  chartDateView: BehaviorSubject<ChartDateViewType> = new BehaviorSubject<ChartDateViewType>(null);
  chartStepTaskTypeList = ChartStepTaskTypeList;

  ChartDateViewType = ChartDateViewType;

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap: Map<WorkpacakgeFlatNode, WorkpackageTreeObject> = new Map<WorkpacakgeFlatNode, WorkpackageTreeObject>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap: Map<WorkpackageTreeObject, WorkpacakgeFlatNode> = new Map<WorkpackageTreeObject, WorkpacakgeFlatNode>();

  treeControl: FlatTreeControl<WorkpacakgeFlatNode>;
  treeFlattener: MatTreeFlattener<WorkpackageTreeObject, WorkpacakgeFlatNode>;
  dataSource: MatTreeFlatDataSource<WorkpackageTreeObject, WorkpacakgeFlatNode>;

  chartData;

  sidebarStyle = {};

  constructor(
    protected cdr: ChangeDetectorRef,
    private database: WorkpackageDatabase,
    private modalService: NgbModal,
    private workingPlanService: WorkingPlanService,
    private workingPlanStateService: WorkingPlanStateService
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<WorkpacakgeFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit(): void {
    this.workingPlanStateService.getChartDateViewSelector()
      .subscribe((view) => this.chartDateView.next(view));

    this.workpackages.subscribe((tree: Workpackage[]) => {
      if (tree) {
        this.chartData = tree;
        const steps = [];

        tree.forEach((step) => {
          steps.push(step);
          console.log(step);
        });

        this.dataSource.data = steps;
        console.log(this.dataSource.data.length);
        this.buildCalendar();
        /** expand tree based on status */
        this.treeControl.dataNodes.forEach((node) => {
          if (node.expanded) {
            this.treeControl.expand(node);
          } else {
            this.treeControl.collapse(node);
          }
        });
      }
    });
  }

  /** utils of building tree */
  transformer = (node: Workpackage, level: number) => {
    const flatNode = new WorkpacakgeFlatNode(
      node.id,
      (node.steps && node.steps.length !== 0),
      level,
      node.name,
      node.responsible,
      node.progress,
      node.progressDates,
      node.dates,
      node.expanded,
      node.taskTypeListIndexes,
      node.taskTypeListValues,
      node.steps,
      node.parentId
    );
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  private _getLevel = (node: WorkpacakgeFlatNode) => node.level;

  private _isExpandable = (node: WorkpacakgeFlatNode) => node.expandable;

  private _getChildren = (node: Workpackage): Observable<WorkpackageStep[]> => observableOf(node.steps);

  hasChild = (_: number, _nodeData: WorkpacakgeFlatNode) => _nodeData.expandable;

  /** end of utils of building tree */

  /** tree nodes manipulations */

  createChart() {
    this.database.addFlatStep();
  }

  updateStepName(node: WorkpacakgeFlatNode, name: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.updateStepName(nestedNode, name);
  }

  updateStepResponsible(node: WorkpacakgeFlatNode, responsible: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.updateStepResponsible(nestedNode, responsible);
  }

/*
  addChildStep(node: WorkpacakgeFlatNode) {
    const nestedNode: Workpackage = this.flatNodeMap.get(node) as Workpackage;
    this.database.addChildStep(nestedNode);
  }
*/

  addChildStep(node: WorkpacakgeFlatNode) {
    const nestedNode: Workpackage = this.flatNodeMap.get(node) as Workpackage;
    const modalRef = this.modalService.open(CreateSimpleItemModalComponent, { size: 'lg' });

    modalRef.result.then((result) => {
      if (result) {
        this.cdr.detectChanges();
      }
    }, () => null);
    modalRef.componentInstance.formConfig = this.workingPlanService.getWorkpackageStepFormConfig();
    modalRef.componentInstance.processing = this.workingPlanStateService.isProcessing();
    modalRef.componentInstance.excludeListId = [nestedNode.id];
    modalRef.componentInstance.excludeFilterName = 'parentWorkpackageId';
    modalRef.componentInstance.authorityName = this.workingPlanService.getWorkpackageStepTypeAuthorityName();
    modalRef.componentInstance.searchConfiguration = this.workingPlanService.getWorkpackageStepSearchConfigName();
    modalRef.componentInstance.createItem.subscribe((item: SimpleItem) => {
      console.log(item);
      this.workingPlanStateService.dispatchGenerateWorkpackageStep(node.id, item.type.value, item.metadata, modalRef)
    });
    modalRef.componentInstance.addItems.subscribe((items: SimpleItem[]) => {
      items.forEach((item) => {
        this.workingPlanStateService.dispatchAddWorkpackageStep(
          node.id,
          item.id,
          modalRef);
      })
    });
  }

  deleteStep(node: WorkpacakgeFlatNode) {
    // if root, ignore
    if (this.treeControl.getLevel(node) < 1) {
      const parentNode = this.flatNodeMap.get(node);
      this.workingPlanStateService.dispatchRemoveWorkpackage(parentNode.id);
      // this.database.deleteFlatStep(parentNode);
    } else {
      const parentFlatNode = this.getParentStep(node);
      const parentNode = this.flatNodeMap.get(parentFlatNode) as Workpackage;
      const childNode = this.flatNodeMap.get(node) as WorkpackageStep;
      this.workingPlanStateService.dispatchRemoveWorkpackageStep(parentNode.id, childNode.id);
      // this.database.deleteStep(parentNode, childNode);
    }
  }

  getParentStep(node: WorkpacakgeFlatNode) {
    const { treeControl } = this;
    const currentLevel = treeControl.getLevel(node);
    // if root, ignore
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = treeControl.dataNodes.indexOf(node) - 1;
    // loop back to find the nearest upper node
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = treeControl.dataNodes[i];
      if (treeControl.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
  }

  toggleExpanded(node: WorkpacakgeFlatNode) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.toggleExpaned(nestedNode);
  }

  updateProgress(node: WorkpacakgeFlatNode, progress: number) {
    const nestedNode = this.flatNodeMap.get(node);
    node.progressDates = this.database.updateProgress(nestedNode, progress);
  }

  updateDateRange(node: WorkpacakgeFlatNode) {
    const startMoment = this.moment(node.dates.start.full); // create start moment
    node.dates.start.full = startMoment.format(this.dateFormat); // convert moment to string
    node.dates.start.month = startMoment.format(this.dateMonthFormat); // convert moment to string
    node.dates.start.year = startMoment.format(this.dateYearFormat); // convert moment to string

    const endMoment = this.moment(node.dates.end.full); // create start moment
    node.dates.end.full = endMoment.format(this.dateFormat); // convert moment to string
    node.dates.end.month = endMoment.format(this.dateMonthFormat); // convert moment to string
    node.dates.end.year = endMoment.format(this.dateYearFormat); // convert moment to string

    const nestedNode = this.flatNodeMap.get(node);
    /** rebuild calendar if the root is updated */
    if (node.level === 0) {
      this.buildCalendar();
    }
    node.progressDates = this.database.updateDateRange(nestedNode);
  }

  /** resize and validate */
  validate(event: ResizeEvent): boolean {
    const MIN_DIMENSIONS_PX = 200;
    return !(event.rectangle.width &&
      (event.rectangle.width < MIN_DIMENSIONS_PX));
  }

  onResizeEnd(event: ResizeEvent): void {
    this.sidebarStyle = {
      width: `${event.rectangle.width}px`
    };
  }

  buildCalendar() {
    this.dates = [];
    this.datesMonth = [];
    this.datesYear = [];

    this.dataSource.data.forEach((step: Workpackage) => {
      const start = this.moment(step.dates.start.full);
      const end = this.moment(step.dates.end.full);
      // Moment range sometimes does not include all the month, so use the end of the month to get the correct range
      const endForMonth = this.moment(step.dates.end.full).endOf('month');
      const dateRange = this.moment.range(start, end);
      const dateRangeForMonth = this.moment.range(start, endForMonth);

      const days = Array.from(dateRange.by('days'));
      const months = Array.from(dateRangeForMonth.by('months'));
      const years = Array.from(dateRange.by('years'));

      this.dates = this.dates.concat(days
        .map((d) => d.format(this.dateFormat))
        .filter((d) => !this.dates.includes(d))).sort();

      this.datesMonth = this.datesMonth.concat(months
        .map((d) => d.format(this.dateMonthFormat))
        .filter((d) => !this.datesMonth.includes(d))).sort();

      this.datesYear = this.datesYear.concat(years
        .map((d) => d.format(this.dateYearFormat))
        .filter((d) => !this.datesYear.includes(d))).sort();
    })
  }

  formatDate(date: string): string {
    if (this.chartDateView.value === ChartDateViewType.day) {
      return moment(date).format('DD MMM')
    } else if (this.chartDateView.value === ChartDateViewType.month) {
      return moment(date).format('MMM YYYY');
    } else {
      return moment(date).format('YYYY');
    }
  }

  isToday(date): boolean {
    if (this.chartDateView.value === ChartDateViewType.day) {
      return date === this.today
    } else if (this.chartDateView.value === ChartDateViewType.month) {
      return moment(date).format(this.dateMonthFormat) === moment(this.today).format(this.dateMonthFormat);
    } else {
      return moment(date).format(this.dateYearFormat) === moment(this.today).format(this.dateYearFormat);
    }
  }

  isDateInsidePogressRange(date: string, node: Workpackage): boolean {
    return (node.progressDates.indexOf(date) > -1)
  }

  isDateInsideRange(date: string, node: Workpackage): boolean {
    return date >= node.dates.start.full && date <= node.dates.end.full
  }

  getMonthInYear() {
    return range(1, 12)
      .map((entry: number) => entry.toString().padStart(2, '0'));
  }

  getDaysInMonth(date: string) {
    return range(1, moment(date, this.dateMonthFormat).daysInMonth())
      .map((entry: number) => entry.toString().padStart(2, '0'));
  }

  onTaskTypeSelection($event: MatSelectChange, date: string, node: WorkpacakgeFlatNode) {
    const nestedNode = this.flatNodeMap.get(node);
    node.taskTypeListValues = this.database.updateStepTaskListValues(nestedNode, date, $event.value);
    node.taskTypeListIndexes = this.database.updateStepTaskListIndexes(nestedNode, date, $event.value);
  }

  getTaskIndex(date: string, node: Workpackage) {
    return node.taskTypeListIndexes.indexOf(date);
  }

  getTaskValues(date: string, node: Workpackage) {
    const index = node.taskTypeListIndexes.indexOf(date);
    return (index > -1) ? node.taskTypeListValues[index] : [];
  }

  isProcessingWorkpackageRemove(node: WorkpacakgeFlatNode): Observable<boolean> {
    const flatNode = this.flatNodeMap.get(node);
    return this.workingPlanService.isProcessingWorkpackageRemove(flatNode.id);
  }
}
