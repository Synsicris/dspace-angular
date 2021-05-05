import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatSelectChange } from '@angular/material/select';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { BehaviorSubject, Observable, of as observableOf, Subscription } from 'rxjs';
import { ResizeEvent } from 'angular-resizable-element';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { findIndex } from 'lodash';

import { startWith, mergeMap, map } from 'rxjs/operators';

import { range } from '../../../shared/array.util';
import { CreateSimpleItemModalComponent } from '../../../shared/create-simple-item-modal/create-simple-item-modal.component';
import { SimpleItem } from '../../../shared/create-simple-item-modal/models/simple-item.model';
import { WorkpacakgeFlatNode } from '../../../core/working-plan/models/workpackage-step-flat-node.model';
import {
  Workpackage,
  WorkpackageChartDate,
  WorkpackageStep,
  WorkpackageTreeObject
} from '../../../core/working-plan/models/workpackage-step.model';
import { moment, WorkingPlanService } from '../../../core/working-plan/working-plan.service';
import { WorkingPlanStateService } from '../../../core/working-plan/working-plan-state.service';
import { VocabularyEntry } from '../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { hasValue, isNotEmpty, isNotNull } from '../../../shared/empty.util';
import { VocabularyOptions } from '../../../core/submission/vocabularies/models/vocabulary-options.model';
import { ChartDateViewType } from '../../../core/working-plan/working-plan.reducer';
import { environment } from '../../../../environments/environment';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { getAllSucceededRemoteDataPayload, getFirstSucceededRemoteListPayload } from '../../../core/shared/operators';
import { EditItemMode } from '../../../core/submission/models/edititem-mode.model';
import { EditItemDataService } from '../../../core/submission/edititem-data.service';
import { EditItem } from '../../../core/submission/models/edititem.model';
import { ContextMenuEntryComponent } from '../../../shared/context-menu/context-menu-entry.component';


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

  /**
   * The current project'id
   */
  @Input() public projectId: string;

  /**
   * Array containing a list of Workpackage object
   */
  @Input() public workpackages: Observable<Workpackage[]>;

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
  responsibleVocabularyOptions: VocabularyOptions;
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap: Map<string, WorkpacakgeFlatNode> = new Map<string, WorkpacakgeFlatNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap: Map<string, WorkpackageTreeObject> = new Map<string, WorkpackageTreeObject>();

  treeControl: FlatTreeControl<WorkpacakgeFlatNode>;
  treeFlattener: MatTreeFlattener<WorkpackageTreeObject, WorkpacakgeFlatNode>;
  dataSource: MatTreeFlatDataSource<WorkpackageTreeObject, WorkpacakgeFlatNode>;

  chartData;

  sidebarNamesStyle = {
    'min-width': 25 + 'rem'
  };
  sidebarResponsibleStyle = {
    'min-width': 30 + 'rem'
  };
  sidebarResponsibleStatus = true;

  /**
   * The responsible column status (used to expand and collapse the column).
   */
  sidebarStatusStyle = {};
  /**
   * List of Edit Modes available on each node for the current user
   */
  private editModes$: BehaviorSubject<Map<string, EditItemMode[]>> = new BehaviorSubject<Map<string, EditItemMode[]>>(new Map());

  private chartStatusTypeList$: BehaviorSubject<VocabularyEntry[]> = new BehaviorSubject<VocabularyEntry[]>([]);
  private subs: Subscription[] = [];

  constructor(
    protected cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private translate: TranslateService,
    private workingPlanService: WorkingPlanService,
    private workingPlanStateService: WorkingPlanStateService,
    private editItemService: EditItemDataService,
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<WorkpacakgeFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.responsibleVocabularyOptions = new VocabularyOptions(
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
        .subscribe((statusList: VocabularyEntry[]) => {
          this.chartStatusTypeList$.next(statusList);
        }));

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
          // Retrieve edit modes
          this.retrieveEditMode(node.id);
          if (node.expanded) {
            this.treeControl.expand(node);
          } else {
            this.treeControl.collapse(node);
          }
        });
      }
    });
  }

  /**
   * Set the responsible column status (used to expand and collapse the column).
   */
  sidebarStatusToggle() {
    this.sidebarResponsibleStatus = !this.sidebarResponsibleStatus;
  }

  /**
   * Check if edit mode is available.
   */
  isEditAvailable(nodeId): Observable<boolean> {
    return this.editModes$.asObservable().pipe(
      map((editModes) => isNotEmpty(editModes) && editModes.has(nodeId) && editModes.get(nodeId).length > 0)
    );
  }

  /**
   * Returns the edit modes.
   */
  getEditModes(): Observable<Map<string, EditItemMode[]>> {
    return this.editModes$;
  }

  /** utils of building tree */
  transformer = (node: Workpackage, level: number) => {
    const flatNode = new WorkpacakgeFlatNode(
      node.id,
      node.workspaceItemId,
      this.getIndex(node, level),
      node.type,
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
    this.updateTreeMap(flatNode, node);
    return flatNode;
  }

  hasChild = (_: number, _nodeData: WorkpacakgeFlatNode) => _nodeData.expandable;

  /** tree nodes manipulations */

  updateTreeMap(flatNode: WorkpacakgeFlatNode, nestedNode: WorkpackageTreeObject) {
    if (this.flatNodeMap.has(flatNode.id)) {
      this.flatNodeMap.delete(flatNode.id);
    }
    if (this.nestedNodeMap.has(nestedNode.id)) {
      this.nestedNodeMap.delete(nestedNode.id);
    }

    this.flatNodeMap.set(flatNode.id, flatNode);
    this.nestedNodeMap.set(nestedNode.id, nestedNode);
  }

  addChildStep(flatNode: WorkpacakgeFlatNode) {
    const nestedNode: Workpackage = this.nestedNodeMap.get(flatNode.id) as Workpackage;
    const modalRef = this.modalService.open(CreateSimpleItemModalComponent, { size: 'lg' });

    modalRef.result.then((result) => {
      if (result) {
        this.cdr.detectChanges();
      }
    }, () => null);
    modalRef.componentInstance.formConfig = this.workingPlanService.getWorkpackageStepFormConfig();
    modalRef.componentInstance.formHeader = this.workingPlanService.getWorkpackageStepFormHeader();
    modalRef.componentInstance.processing = this.workingPlanStateService.isProcessing();
    modalRef.componentInstance.excludeListId = [nestedNode.id];
    modalRef.componentInstance.excludeFilterName = 'parentWorkpackageId';
    modalRef.componentInstance.vocabularyName = this.workingPlanService.getWorkpackageStepTypeAuthorityName();
    modalRef.componentInstance.searchConfiguration = this.workingPlanService.getWorkpackageStepSearchConfigName();
    modalRef.componentInstance.scope = this.projectId;

    modalRef.componentInstance.createItem.subscribe((item: SimpleItem) => {
      const metadata = this.workingPlanService.setDefaultForStatusMetadata(item.metadata);
      this.workingPlanStateService.dispatchGenerateWorkpackageStep(this.projectId, flatNode.id, item.type.value, metadata);
      // the 'this.editModes$' map is auto-updated by the ngOnInit subscribe
    });
    modalRef.componentInstance.addItems.subscribe((items: SimpleItem[]) => {
      items.forEach((item) => {
        this.workingPlanStateService.dispatchAddWorkpackageStep(
          flatNode.id,
          item.id,
          item.workspaceItemId);
      });
    });
  }

  deleteStep(flatNode: WorkpacakgeFlatNode) {
    // if root, ignore
    if (this.treeControl.getLevel(flatNode) < 1) {
      const parentNode = this.nestedNodeMap.get(flatNode.id);
      this.workingPlanStateService.dispatchRemoveWorkpackage(parentNode.id, parentNode.workspaceItemId);
    } else {
      const parentNode: Workpackage = this.nestedNodeMap.get(flatNode.parentId);
      const childNode: WorkpackageStep = this.nestedNodeMap.get(flatNode.id);
      this.workingPlanStateService.dispatchRemoveWorkpackageStep(parentNode.id, childNode.id, childNode.workspaceItemId);
    }
    // We use 'next' to be sure that the event is emitted
    this.editModes$.value.delete(flatNode.id);
    this.editModes$.next(this.editModes$.value);
  }

  getParentStep(node: WorkpacakgeFlatNode): WorkpacakgeFlatNode {
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

  updateDateRange(flatNode: WorkpacakgeFlatNode, startDate: string, endDate: string) {

    // create new dates object
    const startMoment = this.moment(startDate); // create start moment
    const startDateObj: WorkpackageChartDate = {
      full: startMoment.format(this.dateFormat),
      month: startMoment.format(this.dateMonthFormat),
      year: startMoment.format(this.dateYearFormat)
    };

    const endMoment = this.moment(endDate); // create start moment
    const endDateObj: WorkpackageChartDate = {
      full: endMoment.format(this.dateFormat),
      month: endMoment.format(this.dateMonthFormat),
      year: endMoment.format(this.dateYearFormat)
    };

    const dates = {
      start: startDateObj,
      end: endDateObj
    };

    // update flat node dates
    flatNode = Object.assign({}, flatNode, {
      dates: dates
    });

    // update nested node dates
    const nestedNode = Object.assign({}, this.nestedNodeMap.get(flatNode.id), {
      dates: dates
    });

    // rebuild calendar if the root is updated
    if (flatNode.level === 0) {
      this.buildCalendar();
    }

    this.updateField(
      flatNode,
      nestedNode,
      [environment.workingPlan.workingPlanStepDateStartMetadata, environment.workingPlan.workingPlanStepDateEndMetadata],
      [nestedNode.dates.start.full, nestedNode.dates.end.full]
    );
  }

  updateStepName(flatNode: WorkpacakgeFlatNode, name: string) {
    const nestedNode: Workpackage = Object.assign({}, this.nestedNodeMap.get(flatNode.id), {
      name: name
    });

    this.updateField(flatNode, nestedNode, ['dc.title'], [name]);
  }

  updateStepResponsible(flatNode: WorkpacakgeFlatNode, responsible: string) {
    const nestedNode = Object.assign({}, this.nestedNodeMap.get(flatNode.id), {
      responsible: responsible
    });
    this.updateField(flatNode, nestedNode, [environment.workingPlan.workingPlanStepResponsibleMetadata], [responsible]);
  }

  updateStepStatus(flatNode: WorkpacakgeFlatNode, $event: MatSelectChange,) {
    const nestedNode = Object.assign({}, this.nestedNodeMap.get(flatNode.id), {
      status: $event.value
    });
    this.updateField(flatNode, nestedNode, [environment.workingPlan.workingPlanStepStatusMetadata], [$event.value]);
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
      case 'responsible':
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

      // Moment range sometimes does not include all the months, so use the end of the month to get the correct range
      const endForMonth = this.moment(step.dates.end.full).endOf('month');
      const dateRangeForMonth = this.moment.range(start, endForMonth);

      // Moment range sometimes does not include all the quarters, so use the end of the quarter to get the correct range
      const endForQuarter = this.moment(step.dates.end.full).endOf('quarter');
      const dateRangeForQuarter = this.moment.range(start, endForQuarter);

      // Moment range sometimes does not include all the years, so use the end of the year to get the correct range
      const endForYear = this.moment(step.dates.end.full, this.dateFormat).endOf('year');
      const dateRangeForYear = this.moment.range(start, endForYear);

      const days = Array.from(dateRange.by('days'));
      const months = Array.from(dateRangeForMonth.by('months'));
      const quarters = Array.from(dateRangeForQuarter.by('quarters'));
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
    });
  }

  formatDate(date: string): string {
    if (this.chartDateView.value === ChartDateViewType.day) {
      return moment(date).format('DD MMM');
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
      return date === this.today;
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
    return (node.progressDates.indexOf(date) > -1);
  }

  isDateInsideRange(date: string, node: Workpackage): boolean {
    return date >= node.dates.start.full && date <= node.dates.end.full;
  }

  isMoving(): Observable<boolean> {
    return this.workingPlanStateService.isWorkingPlanMoving();
  }

  canMoveDown(flatNode: WorkpacakgeFlatNode, level: number, index: number) {
    let data: any[];
    if (level === 0) {
      data = this.dataSource.data;
    } else {
      const parentNode: Workpackage = this.nestedNodeMap.get(flatNode.parentId);
      data = parentNode.steps;
    }

    return data.length === 0 || index === (data.length - 1);
  }

  canMoveUp(flatNode: WorkpacakgeFlatNode, level: number, index: number) {
    let data: any[];
    if (level === 0) {
      data = this.dataSource.data;
    } else {
      const parentNode: Workpackage = this.nestedNodeMap.get(flatNode.parentId);
      data = parentNode.steps;
    }

    return data.length === 0 || index === 0;
  }

  moveWorkpackage(flatNode: WorkpacakgeFlatNode, level: number, oldIndex: number, newIndex: number) {
    if (level === 0) {
      this.workingPlanStateService.dispatchMoveWorkpackage(flatNode.id, oldIndex, newIndex);
    } else {
      const parentNestedNode: Workpackage = this.nestedNodeMap.get(flatNode.parentId);
      const childNestedNode: WorkpackageStep = this.nestedNodeMap.get(flatNode.id);
      this.workingPlanStateService.dispatchMoveWorkpackageStep(
        parentNestedNode.id,
        parentNestedNode,
        childNestedNode.id,
        oldIndex,
        newIndex
      );
    }
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

  getQuarterInYear() {
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
      days.push(...this.getDaysInMonth(`${year}-${month}`));
    });

    return days;
  }

  getStatusValues(): Observable<VocabularyEntry[]> {
    return this.chartStatusTypeList$;
  }

  isProcessingWorkpackageRemove(node: WorkpacakgeFlatNode): Observable<boolean> {
    return this.workingPlanService.isProcessingWorkpackageRemove(node.id);
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

  getIndex(node: Workpackage, level: number) {
    if (level === 0) {
      return findIndex(this.dataSource.data, { id: node.id });
    } else {
      const parentFlatNode = this.flatNodeMap.get(node.parentId);
      if (isNotNull(parentFlatNode)) {
        return findIndex(parentFlatNode.steps, { id: node.id });
      } else {
        return -1;
      }
    }
  }

  private _getLevel = (node: WorkpacakgeFlatNode) => node.level;

  private _isExpandable = (node: WorkpacakgeFlatNode) => node.expandable;

  private _getChildren = (node: Workpackage): Observable<WorkpackageStep[]> => observableOf(node.steps);

  private updateField(flatNode: WorkpacakgeFlatNode, nestedNode: WorkpackageTreeObject, metadata: string[], value: any[]) {
    // Update reference in the maps
    this.updateTreeMap(flatNode, nestedNode);

    // dispatch action to update item metadata
    if (this.treeControl.getLevel(flatNode) < 1) {
      this.workingPlanService.updateWorkpackageMetadata(
        nestedNode.id,
        nestedNode,
        [...metadata],
        [...value]
      );
    } else {
      const parentNestedNode: Workpackage = this.nestedNodeMap.get(flatNode.parentId);
      const childNestedNode: WorkpackageStep = this.nestedNodeMap.get(flatNode.id);
      this.workingPlanService.updateWorkpackageStepMetadata(
        parentNestedNode.id,
        childNestedNode.id,
        childNestedNode,
        [...metadata],
        [...value]
      );
    }
  }

  /**
   * Retrieve edit modes.
   *
   * @param nodeId string
   */
  private retrieveEditMode(nodeId: string) {
    this.subs.push(this.editItemService.findById(nodeId + ':none', true, true, followLink('modes')).pipe(
      getAllSucceededRemoteDataPayload(),
      mergeMap((editItem: EditItem) => editItem.modes.pipe(
        getFirstSucceededRemoteListPayload())
      ),
      startWith([])
    ).subscribe((editModes: EditItemMode[]) => {
      this.editModes$.next(this.editModes$.value.set(nodeId, editModes));
    }));
  }
}
