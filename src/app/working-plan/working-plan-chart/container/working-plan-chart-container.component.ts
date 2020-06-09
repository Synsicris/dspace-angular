import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MAT_DATE_FORMATS, MatSelectChange } from '@angular/material';

import { BehaviorSubject, Observable, of as observableOf, Subscription } from 'rxjs';
import { ResizeEvent } from 'angular-resizable-element';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { findIndex } from 'lodash';

import { range } from '../../../shared/array.util';
import { CreateSimpleItemModalComponent } from '../../../shared/create-simple-item-modal/create-simple-item-modal.component';
import { SimpleItem } from '../../../shared/create-simple-item-modal/models/simple-item.model';
import { WorkpacakgeFlatNode } from '../../../core/working-plan/models/workpackage-step-flat-node.model';
import {
  Workpackage,
  WorkpackageStep,
  WorkpackageTreeObject
} from '../../../core/working-plan/models/workpackage-step.model';
import { moment, WorkingPlanService } from '../../../core/working-plan/working-plan.service';
import { WorkingPlanStateService } from '../../../core/working-plan/working-plan-state.service';
import { AuthorityEntry } from '../../../core/integration/models/authority-entry.model';
import { hasValue } from '../../../shared/empty.util';
import { AuthorityOptions } from '../../../core/integration/models/authority-options.model';
import { ChartDateViewType } from '../../../core/working-plan/working-plan.reducer';
import { environment } from '../../../../environments/environment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD MMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'ipw-working-plan-chart-container',
  templateUrl: './working-plan-chart-container.component.html',
  styleUrls: ['./working-plan-chart-container.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class WorkingPlanChartContainerComponent implements OnInit, OnDestroy {
  @Input() workpackages: Observable<Workpackage[]>;

  dateFormat = 'YYYY-MM-DD';
  dateMonthFormat = 'YYYY-MM';
  dateYearFormat = 'YYYY';
  disableProgress = true;
  moment = moment;
  dates: string[] = []; // all days in chart
  datesMonth: string[] = []; // all months in chart
  datesQuarter: string[] = []; // all quarters in chart
  datesYear: string[] = []; // all years in chart
  today = moment().format(this.dateFormat);
  chartDateView: BehaviorSubject<ChartDateViewType> = new BehaviorSubject<ChartDateViewType>(null);
  ChartDateViewType = ChartDateViewType;
  responsibleAuthorityOptions: AuthorityOptions;
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap: Map<WorkpacakgeFlatNode, WorkpackageTreeObject> = new Map<WorkpacakgeFlatNode, WorkpackageTreeObject>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap: Map<WorkpackageTreeObject, WorkpacakgeFlatNode> = new Map<WorkpackageTreeObject, WorkpacakgeFlatNode>();

  treeControl: FlatTreeControl<WorkpacakgeFlatNode>;
  treeFlattener: MatTreeFlattener<WorkpackageTreeObject, WorkpacakgeFlatNode>;
  dataSource: MatTreeFlatDataSource<WorkpackageTreeObject, WorkpacakgeFlatNode>;

  chartData;

  sidebarNamesStyle = {
    'min-width': 20 + 'rem'
  };
  sidebarResponsibleStyle = {
    'min-width': 18 + 'rem'
  };
  sidebarStatusStyle = {};

  private chartStatusTypeList$: BehaviorSubject<AuthorityEntry[]> = new BehaviorSubject<AuthorityEntry[]>([]);
  private subs: Subscription[] = [];

  constructor(
    protected cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private translate: TranslateService,
    private workingPlanService: WorkingPlanService,
    private workingPlanStateService: WorkingPlanStateService
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<WorkpacakgeFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.responsibleAuthorityOptions = new AuthorityOptions(
      environment.workingPlan.workingPlanStepResponsibleAuthority,
      environment.workingPlan.workingPlanStepResponsibleMetadata,
      null,
      true
    );
  }

  ngOnInit(): void {
    this.workingPlanStateService.getChartDateViewSelector()
      .subscribe((view) => this.chartDateView.next(view));

    this.subs.push(
      this.workingPlanService.getWorkpackageStatusTypes()
        .subscribe((statusList: AuthorityEntry[]) => this.chartStatusTypeList$.next(statusList)));

    this.workpackages.subscribe((tree: Workpackage[]) => {
      if (tree) {
        this.chartData = tree;
        const steps = [];

        tree.forEach((step) => {
          steps.push(step);
        });

        this.dataSource.data = steps;
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
      node.workspaceItemId,
      this.getIndex(node),
      (node.steps && node.steps.length !== 0),
      level,
      node.name,
      node.responsible,
      node.status,
      node.progress,
      node.progressDates,
      node.dates,
      (node.steps && node.steps.length !== 0),
      node.steps,
      node.parentId
    );
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  hasChild = (_: number, _nodeData: WorkpacakgeFlatNode) => _nodeData.expandable;

  /** tree nodes manipulations */

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
      const metadata = this.workingPlanService.setDefaultForStatusMetadata(item.metadata);
      this.workingPlanStateService.dispatchGenerateWorkpackageStep(node.id, item.type.value, metadata, modalRef)
    });
    modalRef.componentInstance.addItems.subscribe((items: SimpleItem[]) => {
      items.forEach((item) => {
        this.workingPlanStateService.dispatchAddWorkpackageStep(
          node.id,
          item.id,
          item.workspaceItemId,
          modalRef);
      })
    });
  }

  deleteStep(node: WorkpacakgeFlatNode) {
    // if root, ignore
    if (this.treeControl.getLevel(node) < 1) {
      const parentNode = this.flatNodeMap.get(node);
      this.workingPlanStateService.dispatchRemoveWorkpackage(parentNode.id, parentNode.workspaceItemId);
    } else {
      const parentFlatNode = this.getParentStep(node);
      const parentNode = this.flatNodeMap.get(parentFlatNode) as Workpackage;
      const childNode = this.flatNodeMap.get(node) as WorkpackageStep;
      this.workingPlanStateService.dispatchRemoveWorkpackageStep(parentNode.id, childNode.id, childNode.workspaceItemId);
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

  /** end of utils of building tree */

  getStatusTypeLabel(statusType: string) {
    const index = findIndex(this.chartStatusTypeList$.value, (entry) => entry.value === statusType);
    return (index !== -1) ? this.chartStatusTypeList$.value[index].display : statusType;
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
    nestedNode.dates = node.dates;

    /** rebuild calendar if the root is updated */
    if (node.level === 0) {
      this.buildCalendar();
    }

    this.updateField(
      node,
      [environment.workingPlan.workingPlanStepDateStartMetadata, environment.workingPlan.workingPlanStepDateEndMetadata],
      [nestedNode.dates.start.full, nestedNode.dates.end.full]
    );
  }

  updateStepName(node: WorkpacakgeFlatNode, name: string) {
    const nestedNode = this.flatNodeMap.get(node);
    nestedNode.name = name;
    this.updateField(node, ['dc.title'], [name]);
  }

  updateStepResponsible(node: WorkpacakgeFlatNode, responsible: string) {
    const nestedNode = this.flatNodeMap.get(node);
    nestedNode.responsible = responsible;
    this.updateField(node, [environment.workingPlan.workingPlanStepResponsibleMetadata], [responsible]);
  }

  updateStepStatus(node: WorkpacakgeFlatNode, $event: MatSelectChange,) {
    const nestedNode = this.flatNodeMap.get(node);
    nestedNode.status = $event.value;
    this.updateField(node, [environment.workingPlan.workingPlanStepStatusMetadata], [$event.value]);
  }

  /** resize and validate */

  onResizeEnd(event: ResizeEvent, field: string): void {
    const style: any = {
      width: event.rectangle.width + 'px'
    };

    switch (field) {
      case 'names':
        this.sidebarNamesStyle = style;
        break;
      case 'Responsible':
        this.sidebarResponsibleStyle = style;
        break;
      case 'status':
        this.sidebarStatusStyle = style;
        break;
    }
  }

  buildCalendar() {
    this.dates = [];
    this.datesMonth = [];
    this.datesYear = [];

    this.dataSource.data.forEach((step: Workpackage) => {
      const start = this.moment(step.dates.start.full, this.dateFormat);
      const end = this.moment(step.dates.end.full, this.dateFormat);
      const dateRange = moment.range(start, end);

      // Moment range sometimes does not include all the month, so use the end of the month to get the correct range
      const endForMonth = this.moment(step.dates.end.full).endOf('month');
      const dateRangeForMonth = this.moment.range(start, endForMonth);

      // Moment range sometimes does not include all the year, so use the end of the year to get the correct range
      const endForYear = this.moment(step.dates.end.full, this.dateFormat).endOf('year');
      const dateRangeForYear = this.moment.range(start, endForYear);

      const days = Array.from(dateRange.by('days'));
      const months = Array.from(dateRangeForMonth.by('months'));
      const quarters = Array.from(dateRange.by('quarters'));
      const years = Array.from(dateRangeForYear.by('year'));

      this.dates = this.dates.concat(days
        .map((d) => d.format(this.dateFormat))
        .filter((d) => !this.dates.includes(d))).sort();

      this.datesMonth = this.datesMonth.concat(months
        .map((d) => d.format(this.dateMonthFormat))
        .filter((d) => !this.datesMonth.includes(d))).sort();

      this.datesQuarter = this.datesQuarter.concat(quarters
        .map((d) => d.format(this.dateYearFormat) + '-' + d.quarter().toString())
        .filter((d) => !this.datesQuarter.includes(d))).sort();

      this.datesYear = this.datesYear.concat(years
        .map((d) => d.format(this.dateYearFormat))
        .filter((d) => !this.datesYear.includes(d))).sort();
    })
  }

  formatDate(date: string): string {
    if (this.chartDateView.value === ChartDateViewType.day) {
      return moment(date).format('DD MMM')
    } else if (this.chartDateView.value === ChartDateViewType.month) {
      return moment(date).format('MMM');
    } else if (this.chartDateView.value === ChartDateViewType.quarter) {
      const parts = date.split('-');
      return this.getQuarterLabel(parts[1]);
    } else {
      return moment(date).format('YYYY');
    }
  }

  getQuarterLabel(quarter: string) {
    let label;
    switch (quarter) {
      case '1':
        label = 'working-plan.chart.toolbar.date-view.quarter.first';
        break;
      case '2':
        label = 'working-plan.chart.toolbar.date-view.quarter.second';
        break;
      case '3':
        label = 'working-plan.chart.toolbar.date-view.quarter.third';
        break;
      case '4':
        label = 'working-plan.chart.toolbar.date-view.quarter.fourth';
        break;
    }
    return this.translate.instant(label);
  }

  isToday(date): boolean {
    if (this.chartDateView.value === ChartDateViewType.day) {
      return date === this.today
    } else if (this.chartDateView.value === ChartDateViewType.month) {
      return moment(date).format(this.dateMonthFormat) === moment(this.today).format(this.dateMonthFormat);
    } else if (this.chartDateView.value === ChartDateViewType.quarter) {
      return moment(date).quarter() === moment(this.today).quarter();
    } else {
      return moment(date).format(this.dateYearFormat) === moment(this.today).format(this.dateYearFormat);
    }
  }

  /** other methods */

  isDateInsidePogressRange(date: string, node: Workpackage): boolean {
    return (node.progressDates.indexOf(date) > -1)
  }

  isDateInsideRange(date: string, node: Workpackage): boolean {
    return date >= node.dates.start.full && date <= node.dates.end.full
  }

  isMoving(): Observable<boolean> {
    return this.workingPlanStateService.isWorkingPlanMoving();
  }

  moveWorkpackage(node: Workpackage, oldIndex: number, newIndex: number) {
    this.workingPlanStateService.dispatchMoveWorkpackage(node.id, oldIndex, newIndex);
  }

  getMonthInYear() {
    return range(1, 12)
      .map((entry: number) => entry.toString().padStart(2, '0'));
  }

  getMonthInQuarter(date: string) {
    const [year, quarter] = date.split('-');
    const start: number = (1 + (3 * (parseInt(quarter, 10) - 1)));
    const end: number = (3 * parseInt(quarter, 10));
    return range(start, end)
      .map((entry: number) => entry.toString().padStart(2, '0'));

  }

  getQaurterYear(date: string) {
    const [year, quarter] = date.split('-');
    return year;
  }

  getQaurterInYear() {
    return range(1, 4)
      .map((entry: number) => entry.toString());
  }

  getDaysInMonth(date: string) {
    return range(1, moment(date, this.dateMonthFormat).daysInMonth(), 1)
      .map((entry: number) => entry.toString().padStart(2, '0'));
  }

  getDaysInQuarter(date: string) {
    const days: string[] = [];
    const [year, quarter] = date.split('-');
    const months = this.getMonthInQuarter(date);
    months.forEach((month) => {
      days.push(...this.getDaysInMonth(`${year}-${month}`))
    });

    return days;
  }

  getStatusValues(): Observable<AuthorityEntry[]> {
    return this.chartStatusTypeList$;
  }

  isProcessingWorkpackageRemove(node: WorkpacakgeFlatNode): Observable<boolean> {
    const flatNode = this.flatNodeMap.get(node);
    return this.workingPlanService.isProcessingWorkpackageRemove(flatNode.id);
  }

  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  getDatesMonthByYear(year: string): string[] {
    return this.datesMonth.filter((date) => {
      const dateYear = moment(date).format('YYYY');
      return dateYear === year;
    });
  }

  getDatesQuarterByYear(year: string) {
    return this.datesQuarter.filter((date) => {
      const dateYear = moment(date).format('YYYY');
      return dateYear === year;
    });
  }

  getIndex(node: Workpackage) {
    return findIndex(this.dataSource.data, { id: node.id });
  }

  private _getLevel = (node: WorkpacakgeFlatNode) => node.level;

  private _isExpandable = (node: WorkpacakgeFlatNode) => node.expandable;

  private _getChildren = (node: Workpackage): Observable<WorkpackageStep[]> => observableOf(node.steps);

  private updateField(node: WorkpacakgeFlatNode, metadata: string[], value: any[]) {
    if (this.treeControl.getLevel(node) < 1) {
      const nestedNode = this.flatNodeMap.get(node);
      this.workingPlanService.updateWorkpackageMetadata(
        nestedNode.id,
        nestedNode,
        [...metadata],
        [...value]
      );
    } else {
      const parentFlatNode = this.getParentStep(node);
      const parentNode = this.flatNodeMap.get(parentFlatNode) as Workpackage;
      const childNode = this.flatNodeMap.get(node) as WorkpackageStep;
      this.workingPlanService.updateWorkpackageStepMetadata(
        parentNode.id,
        childNode.id,
        childNode,
        [...metadata],
        [...value]
      );
    }
  }
}
