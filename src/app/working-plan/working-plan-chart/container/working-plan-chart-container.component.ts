import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatSelectChange } from '@angular/material/select';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { BehaviorSubject, Observable, of as observableOf, Subscription } from 'rxjs';
import { ResizeEvent } from 'angular-resizable-element';
import { NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { findIndex } from 'lodash';

import { map, take } from 'rxjs/operators';

import { range } from '../../../shared/array.util';
import { CreateSimpleItemModalComponent } from '../../../shared/create-simple-item-modal/create-simple-item-modal.component';
import { SimpleItem } from '../../../shared/create-simple-item-modal/models/simple-item.model';
import { WorkpacakgeFlatNode } from '../../core/models/workpackage-step-flat-node.model';
import {
  Workpackage,
  WorkpackageChartDate,
  WorkpackageStep,
  WorkpackageTreeObject
} from '../../core/models/workpackage-step.model';
import { moment, WorkingPlanService, WpMetadata, WpStepMetadata } from '../../core/working-plan.service';
import { WorkingPlanStateService } from '../../core/working-plan-state.service';
import { VocabularyEntry } from '../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { hasValue, isEmpty, isNotEmpty, isNotNull } from '../../../shared/empty.util';
import { VocabularyOptions } from '../../../core/submission/vocabularies/models/vocabulary-options.model';
import { ChartDateViewType } from '../../core/working-plan.reducer';
import { environment } from '../../../../environments/environment';
import { EditItemDataService } from '../../../core/submission/edititem-data.service';
import { SearchConfig } from 'src/app/core/shared/search/search-filters/search-config.model';
import { CdkDragDrop, CdkDragSortEvent, CdkDragStart } from '@angular/cdk/drag-drop';
import { NgbDateStructToString, stringToNgbDateStruct } from '../../../shared/date.util';
import { Item } from '../../../core/shared/item.model';
import { EditItemMode } from '../../../core/submission/models/edititem-mode.model';

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
 * Defines the UpdateData parameters.
 */
interface UpdateData {
  flatNode: WorkpacakgeFlatNode;
  nestedNode: WorkpackageTreeObject;
  metadata: string[];
  values: string[];
}

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
   * The current project community's id
   */
  @Input() public projectCommunityId: string;

  /**
   * The working Plan item
   */
  @Input() workingPlan: Item;

  /**
   * Array containing a list of Workpackage object
   */
  @Input() public workpackages: Observable<Workpackage[]>;

  /**
   * The collection id for workpackage entity in the given project
   */
  @Input() public workPackageCollectionId: string;

  /**
   * The collection id for milestone entity in the given project
   */
  @Input() public milestoneCollectionId: string;

  private defaultDates: any = {
    start: {
      full: moment().format('YYYY-MM-DD'),
      month: moment().format('YYYY-MM'),
      year: moment().format('YYYY')
    },
    end: {
      full: moment().add(7, 'days').format('YYYY-MM-DD'),
      month: moment().add(7, 'days').format('YYYY-MM'),
      year: moment().add(7, 'days').format('YYYY')
    },
  };

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
  workpackageVocabularyOptions: VocabularyOptions;
  milestoneVocabularyOptions: VocabularyOptions;
  /**
   * The number of days of the ChangeAllStartDate dropdown.
   */
  changeStartDateDays = '1';
  /**
   * The direction of the ChangeAllStartDate dropdown.
   */
  changeStartDateDirection = 'later';
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap: Map<string, WorkpacakgeFlatNode> = new Map<string, WorkpacakgeFlatNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap: Map<string, WorkpackageTreeObject> = new Map<string, WorkpackageTreeObject>();

  treeControl: FlatTreeControl<WorkpacakgeFlatNode>;
  treeFlattener: MatTreeFlattener<WorkpackageTreeObject, WorkpacakgeFlatNode>;
  dataSource: MatTreeFlatDataSource<WorkpackageTreeObject, WorkpacakgeFlatNode>;

  /**
   * The sorting options for the chart.
   */
  sortOptions$: Observable<SearchConfig>;
  /**
   * The active sorting option.
   */
  sortSelected$: Observable<string>;
  /**
   * The active sorting option value.
   */
  sortSelectedValue: string;
  /**
   * The old selected sorting option.
   */
  sortSelectedOld: string;
  /**
   * If TRUE the tree Drag&Drop is active.
   */
  dragAndDropIsActive: boolean;
  isDragging: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isDropAllowed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  chartData;

  sidebarNamesMinWidth = 350;
  sidebarNamesStyle = {
    'min-width': this.sidebarNamesMinWidth + 'px'
  };

  sidebarResponsibleMinWidth = 450;
  sidebarResponsibleStyle = {
    'min-width': this.sidebarResponsibleMinWidth + 'px'
  };
  sidebarResponsibleStatus = true;

  /**
   * The map with the MouseOver statuses of the nodes (rows). Used to change the filled row color on MouseOver.
   */
  chartChangeColorIsOver: Map<string, boolean> = new Map<string, boolean>();

  /**
   * The responsible column status (used to expand and collapse the column).
   */
  sidebarStatusStyle = {};

  /**
   * The milestones map used to draw a blue line and a rhombus at the milestone date.
   */
  milestonesMap: Map<string, string> = new Map<string, string>();

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
  }

  ngOnInit(): void {
    this.workpackageVocabularyOptions = new VocabularyOptions(
      environment.workingPlan.workingPlanStepResponsibleAuthority,
      environment.workingPlan.workingPlanStepResponsibleMetadata,
      this.workPackageCollectionId,
      true
    );
    this.milestoneVocabularyOptions = new VocabularyOptions(
      environment.workingPlan.workingPlanStepResponsibleAuthority,
      environment.workingPlan.workingPlanStepResponsibleMetadata,
      this.milestoneCollectionId,
      true
    );
    this.dragAndDropIsActive = false;
    this.sortSelected$ = this.workingPlanStateService.getWorkpackagesSortOption();

    this.workingPlanStateService.getChartDateViewSelector()
      .subscribe((view) => this.chartDateView.next(view));

    this.subs.push(
      this.workingPlanService.getWorkpackageStatusTypes()
        .subscribe((statusList: VocabularyEntry[]) => {
          this.chartStatusTypeList$.next(statusList);
        }),
      this.sortSelected$.subscribe(
        (sortOption: string) => {
          this.sortSelectedValue = sortOption;
          this.sortSelectedOld = sortOption;
          if (sortOption === environment.workingPlan.workingPlanPlaceMetadata) {
            this.dragAndDropIsActive = true;
          }
        }
      )
    );

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
          // MouseOver Map
          this.chartChangeColorIsOver.set(node.id, false);
          // Milestones border and rhombus
          if (node.type === 'milestone' && isNotEmpty(node.dates?.end)) {
            this.milestonesMap.set(node.id, node.dates.end.full);
          }
          if (node.expanded) {
            this.treeControl.expand(node);
          } else {
            this.treeControl.collapse(node);
          }
        });
      }
    });

    this.sortOptions$ = this.workingPlanService.getWorkpackageSortOptions();
  }

  /**
   * Set the responsible column status (used to expand and collapse the column).
   */
  sidebarStatusToggle() {
    this.sidebarResponsibleStatus = !this.sidebarResponsibleStatus;
  }

  /**
   * Set the map with the nodes (rows) ids (used to change the filled row color on MouseOver).
   *
   * @param nodeId string
   * @param isOver boolean
   */
  chartChangeColor(nodeId: string, isOver: boolean): void {
    this.chartChangeColorIsOver.set(nodeId, isOver);
  }

  /**
   * Returns TRUE or FALSE based on the 'this.chartChangeColorIsOver' variable (used to change the filled row color on MouseOver).
   *
   * @param node Workpackage
   * @param progressDate string
   * @param rangeDate string
   *
   * @returns boolean
   */
  chartCheckChangeColor(node: Workpackage, progressDate: string, rangeDate: string): boolean {
    let response = false;
    if (this.chartChangeColorIsOver.get(node.id)
      && !this.isDateInsidePogressRange(progressDate, node)
      && this.isDateInsideRange(rangeDate, node)) {
      response = true;
    }
    return response;
  }

  /**
   * Returns TRUE if the node is the last node of the year (used to draw a red line at the end of the year).
   *
   * @param date string
   * @param type string
   *
   * @returns boolean
   */
  chartCheckEndOfTheYear(date: string, type: string): boolean {
    let output = false;
    let momentDate;
    if (type === 'month') {
      momentDate = moment(date, 'YYYY-MM');
      if (momentDate.format('MM') === '12') {
        output = true;
      }
    } else if (type === 'quarter') {
      momentDate = date.split('-');
      if (momentDate[1] === '4') {
        output = true;
      }
    } else {
      output = true;
    }
    return output;
  }

  /**
   * Returns TRUE if the node date match a milestone date (used to draw a blue line at the milestone date).
   *
   * @param date string
   *
   * @returns boolean
   */
  chartCheckMilestone(date: string): boolean {
    const milestoneDates = Array.from(this.milestonesMap.values());
    let output = false;
    if (milestoneDates.indexOf(date) !== -1) {
      output = true;
    }
    return output;
  }

  /**
   * Returns TRUE if the node id match a milestone id (used to draw a rhombus at the milestone date).
   *
   * @param nodeId string
   * @param date string
   *
   * @returns boolean
   */
  chartCheckNodeMilestone(nodeId: string, date: string): boolean {
    let output = false;
    if (this.milestonesMap.has(nodeId) && this.milestonesMap.get(nodeId) === date) {
      output = true;
    }
    return output;
  }

  /**
   * Check if edit mode is available.
   *
   * @param nodeId string
   *
   * @returns Observable<boolean>
   */
  isEditAvailable(nodeId): Observable<boolean> {
    return this.editModes$.asObservable().pipe(
      map((editModes) => isNotEmpty(editModes) && editModes.has(nodeId) && editModes.get(nodeId).length > 0)
    );
  }

  /**
   * Returns the edit modes.
   *
   * @returns Observable<Map<string, EditItemMode[]>>
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
    modalRef.componentInstance.searchMessageInfoKey = this.workingPlanService.getWorkingPlanTaskSearchHeader();
    modalRef.componentInstance.processing = this.workingPlanStateService.isProcessing();
    modalRef.componentInstance.vocabularyName = this.workingPlanService.getWorkpackageStepTypeAuthorityName();
    modalRef.componentInstance.searchConfiguration = this.workingPlanService.getWorkpackageStepSearchConfigName();
    modalRef.componentInstance.scope = this.projectCommunityId;
    modalRef.componentInstance.query = this.buildExcludedTasksQuery(flatNode);

    modalRef.componentInstance.createItem.subscribe((item: SimpleItem) => {
      const metadata = this.workingPlanService.setDefaultForStatusMetadata(item.metadata);
      this.workingPlanStateService.dispatchGenerateWorkpackageStep(this.projectCommunityId, flatNode.id, item.type.value, metadata);
      // the 'this.editModes$' map is auto-updated by the ngOnInit subscribe
      if (flatNode.type === 'milestone') {
        this.milestonesMap.set(flatNode.id, flatNode.dates.end.full);
      }
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
    // MouseOver map update
    this.chartChangeColorIsOver.delete(flatNode.id);
    // Milestones map update
    this.milestonesMap.delete(flatNode.id);
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

  /**
   * Update the number of days of the ChangeAllStartDate dropdown.
   *
   * @param days string
   */
  updateChangeStartDateDays(days: string): void {
    this.changeStartDateDays = days;
  }

  /**
   * Update the direction of the ChangeAllStartDate dropdown.
   *
   * @param direction string
   */
  updateChangeStartDateDirection(direction: string): void {
    this.changeStartDateDirection = direction;
  }

  /**
   * Reset the SortBy dropdown to the actual value.
   *
   * @param isOpen boolean
   */
  resetSortDropdown(isOpen: boolean): void {
    if (isOpen) {
      this.sortSelectedValue = this.sortSelectedOld;
    }
  }

  /**
   * Update the chart with the new sort option.
   */
  updateSort() {
    if (this.sortSelectedValue !== this.sortSelectedOld) {
      this.workingPlanStateService.dispatchRetrieveAllWorkpackages(this.projectCommunityId, this.workingPlan.uuid, this.sortSelectedValue);
    }
  }

  /**
   * Update all the nodes date range.
   */
  updateAllDateRange(): void {
    let startDate;
    let endDate;
    let startStringDate;
    let endStringDate;
    const updateAllMap: Map<string, { startDate: string, endDate: string }> = new Map();

    this.flatNodeMap.forEach((node: WorkpacakgeFlatNode) => {
      // skip node if dates has not been set
      if (node.type === 'milestone' && isEmpty(node.dates?.end?.full)) {
        return;
      } else if (isEmpty(node.dates?.start?.full) || isEmpty(node.dates?.end?.full)) {
        return;
      }

      if (node.type === 'milestone') {
        startDate = this.moment(node.dates.end.full, this.dateFormat);
      } else {
        startDate = this.moment(node.dates.start.full, this.dateFormat);
      }
      endDate = this.moment(node.dates.end.full, this.dateFormat);
      if (this.changeStartDateDirection === 'later') {
        startStringDate = startDate.add(this.changeStartDateDays, 'days').format(this.dateFormat);
        endStringDate = endDate.add(this.changeStartDateDays, 'days').format(this.dateFormat);
      } else {
        startStringDate = startDate.subtract(this.changeStartDateDays, 'days').format(this.dateFormat);
        endStringDate = endDate.subtract(this.changeStartDateDays, 'days').format(this.dateFormat);
      }
      updateAllMap.set(node.id, { 'startDate': startStringDate, 'endDate': endStringDate });
    });
    this.updateAllDateRanges(updateAllMap);
  }

  updateDateRange(flatNode: WorkpacakgeFlatNode, startDate: string|NgbDate, endDate: string|NgbDate) {
    if (startDate instanceof NgbDate) {
      startDate = NgbDateStructToString(startDate);
    }
    if (endDate instanceof NgbDate) {
      endDate = NgbDateStructToString(endDate);
    }
    const nodeData: UpdateData = this._updateDateRangeOperations(flatNode, startDate, endDate);

    this.updateField(
      nodeData.flatNode,
      nodeData.nestedNode,
      nodeData.metadata,
      nodeData.values
    );
  }

  updateAllDateRanges(updateAllMap: Map<string, { startDate: string, endDate: string }>): void {
    let nodeData;
    const nodeDataArray: UpdateData[] = [];

    updateAllMap.forEach((data: { startDate: string, endDate: string }, index: string) => {
      nodeData = this._updateDateRangeOperations(this.flatNodeMap.get(index), data.startDate, data.endDate);
      nodeDataArray.push(nodeData);
    });

    this.updateAllField(nodeDataArray);
  }

  updateStepName(flatNode: WorkpacakgeFlatNode, name: string) {
    const nestedNode: Workpackage = Object.assign({}, this.nestedNodeMap.get(flatNode.id), {
      name: name
    });

    this.updateField(flatNode, nestedNode, ['dc.title'], [name]);
  }

  updateStepResponsible(flatNode: WorkpacakgeFlatNode, responsible: VocabularyEntry) {
    const nestedNode = Object.assign({}, this.nestedNodeMap.get(flatNode.id), {
      responsible: responsible.value
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

  validateResizeNames = (resizeEvent: any) => {
    const eventWidth = resizeEvent.rectangle.width;
    return eventWidth >= this.sidebarNamesMinWidth;
  }

  validateResizeResponsible = (resizeEvent: any) => {
    const eventWidth = resizeEvent.rectangle.width;
    return eventWidth >= this.sidebarResponsibleMinWidth;
  }

  buildCalendar() {
    this.dates = [];
    this.datesMonth = [];
    this.datesQuarter = [];
    this.datesYear = [];
    const stepToProcess: any[] = this.dataSource.data
      .filter((step: Workpackage) => {
        if (step.type === 'milestone') {
          return isNotEmpty(step.dates?.end?.full);
        } else {
          return isNotEmpty(step.dates?.start?.full) && isNotEmpty(step.dates?.end?.full);
        }
      } )
      .map((step: Workpackage) => ({
        dates: step.dates,
        type: step.type
      }));

    if (stepToProcess.length === 0) {
      stepToProcess.push({
        dates: this.defaultDates,
        type: null
      });
    }

    stepToProcess
      .forEach((step: any) => {
        let start;
        const end = this.moment(step.dates.end.full, this.dateFormat);
        if (step.type === 'milestone') {
          start = this.moment(this.moment(step.dates.end.full, this.dateFormat).subtract(1, 'days').format(this.dateFormat), this.dateFormat);
        } else {
          start = this.moment(step.dates.start.full, this.dateFormat);
        }
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
    this.adjustDates();
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
    if (isEmpty(node.dates)) {
      return false;
    } else if (node.type !== 'milestone') {
      return (isNotEmpty(node.dates?.start?.full) && isNotEmpty(node.dates?.end?.full)) ?
        (date >= node.dates.start.full && date <= node.dates.end.full) : false;
    } else {
      return isEmpty(node.dates?.end?.full) ? false : (date === node.dates.end.full);
    }
  }

  isMoving(): Observable<boolean> {
    return this.workingPlanStateService.isWorkingPlanMoving();
  }

  canAddChildStep(node: WorkpacakgeFlatNode) {
    return node.level === 0 && node.type !== environment.workingPlan.milestoneEntityName;
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

  drop(event: CdkDragDrop<MatTreeFlatDataSource<WorkpackageTreeObject, WorkpacakgeFlatNode>, any>) {
    this.isDragging.next(false);
    this.isDropAllowed.next(false);
    // ignore drops outside of the tree
    if (!event.isPointerOverContainer) {
      return;
    }
    // Tree Update
    if (event.previousIndex !== event.currentIndex) {
      const destNode = this.treeControl.dataNodes[event.currentIndex];
      if (event.item.data.parentId === destNode.parentId && event.item.data.level === destNode.level) {
        this.moveWorkpackage(event.item.data, event.item.data.level, event.item.data.index, destNode.index);
      }
    }
  }

  dragStarted(event: CdkDragStart<WorkpacakgeFlatNode[]>) {
    this.isDragging.next(true);
    this.isDropAllowed.next(true);
  }

  dragEntered(event: CdkDragSortEvent<WorkpacakgeFlatNode, WorkpacakgeFlatNode>) {
    this.isDragging.next(true);
    const destNode = this.treeControl.dataNodes[event.currentIndex];
    if (event.item.data.parentId === destNode.parentId && event.item.data.level === destNode.level) {
      this.isDropAllowed.next(true);
    } else {
      this.isDropAllowed.next(false);
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

  isProcessingWorkpackage(): Observable<boolean> {
    return this.workingPlanService.isProcessingWorkpackage();
  }

  /**
   * Check, inside the state, if the node has been added in the last operation.
   *
   * @param nodeId string
   * @returns Observable<boolean>
   */
  hasBeenNowAdded(nodeId): Observable<boolean> {
    return this.workingPlanService.getLastAddedNodesList().pipe(
      map((nodeIdArray: string[]) => {
        return nodeIdArray.indexOf(nodeId) > -1;
      })
    );
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

  private _updateDateRangeOperations(flatNode: WorkpacakgeFlatNode, startDate: string, endDate: string): UpdateData {
    // create new dates object
    const dates = Object.create({});
    let startMoment;
    let startDateObj: WorkpackageChartDate;
    let endDateObj: WorkpackageChartDate;
    if (endDate) {
      const endMoment = this.moment(endDate); // create start moment
      endDateObj = {
        full: endMoment.format(this.dateFormat),
        month: endMoment.format(this.dateMonthFormat),
        year: endMoment.format(this.dateYearFormat)
      };
      dates.end = endDateObj;
    }

    if (flatNode.type !== 'milestone' && startDate) {
      startMoment = this.moment(startDate); // create start moment
      startDateObj = {
        full: startMoment.format(this.dateFormat),
        month: startMoment.format(this.dateMonthFormat),
        year: startMoment.format(this.dateYearFormat)
      };
      dates.start = startDateObj;
    }

    // update flat node dates
    flatNode = Object.assign({}, flatNode, {
      dates: dates
    });

    // update nested node dates
    const nestedNode = Object.assign({}, this.nestedNodeMap.get(flatNode.id), {
      dates: dates
    });

    // Update reference in the maps
    this.updateTreeMap(flatNode, nestedNode);

    // rebuild calendar if the root is updated
    if (flatNode.level === 0) {
      this.buildCalendar();
    }

    let values = [];
    if (nestedNode.type !== 'milestone') {
      values = [nestedNode.dates?.start?.full, nestedNode.dates?.end?.full];
    } else {
      values = [null, nestedNode.dates?.end?.full];
    }

    return {
      'flatNode': flatNode,
      'nestedNode': nestedNode,
      'metadata': [environment.workingPlan.workingPlanStepDateStartMetadata, environment.workingPlan.workingPlanStepDateEndMetadata],
      'values': values
    };
  }

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
   * Dispatch the update of all nodes metadata.
   *
   * @param nodeDataArray UpdateData[]
   */
  private updateAllField(nodeDataArray: UpdateData[]): void {
    const wpMetadata: WpMetadata[] = [];
    const wpStepMetadata: WpStepMetadata[] = [];
    let parentNestedNode: Workpackage;
    let childNestedNode: WorkpackageStep;
    nodeDataArray.forEach((nodeData) => {
      this.updateTreeMap(nodeData.flatNode, nodeData.nestedNode);
      if (this.treeControl.getLevel(nodeData.flatNode) < 1) {
        wpMetadata.push({
          'nestedNodeId': nodeData.nestedNode.id,
          'nestedNode': nodeData.nestedNode,
          'metadata': [...nodeData.metadata],
          'values': [...nodeData.values],
          'hasAuthority': false
        });
      } else {
        parentNestedNode = this.nestedNodeMap.get(nodeData.flatNode.parentId);
        childNestedNode = this.nestedNodeMap.get(nodeData.flatNode.id);
        wpStepMetadata.push({
          'parentNestedNodeId': parentNestedNode.id,
          'childNestedNodeId': childNestedNode.id,
          'childNestedNode': childNestedNode,
          'metadata': [...nodeData.metadata],
          'values': [...nodeData.values],
          'hasAuthority': false
        });
      }
    });
    // dispatch action to update item metadata
    if (wpMetadata.length !== 0 || wpStepMetadata.length !== 0) {
      this.workingPlanService.updateAllWorkpackageMetadata(wpMetadata, wpStepMetadata);
    }
  }

  /**
   * Retrieve edit modes.
   *
   * @param nodeId string
   */
  private retrieveEditMode(nodeId: string): void {
    this.subs.push(this.editItemService.searchEditModesByID(nodeId).pipe(
      take(1)
    ).subscribe((availableModes: EditItemMode[]) => {
      const modes = availableModes.filter((mode) => mode.name === environment.projects.projectsEntityEditMode);
      this.editModes$.next(this.editModes$.value.set(nodeId, modes));
    }));
  }

  /**
   * Corrects the months and quarters headers adding what's missing to complete the years.
   */
  private adjustDates(): void {
    if (this.datesMonth.length > 0) {
      const dateFormat = 'YYYY-MM';
      const firstDateMonth = moment(this.datesMonth[0], dateFormat);
      const lastDateMonth = moment(this.datesMonth[this.datesMonth.length - 1], dateFormat);

      const beforeStart = moment(firstDateMonth.format('YYYY') + '-01', dateFormat);
      const afterLimit = moment(lastDateMonth.format('YYYY') + '-12', dateFormat);

      const beforeRange = moment.range(beforeStart, firstDateMonth);
      const afterRange = moment.range(lastDateMonth, afterLimit);

      const beforeRangeArray = Array.from(beforeRange.by('months'));
      const afterRangeArray = Array.from(afterRange.by('months'));
      this.datesMonth = this.datesMonth.concat(
        beforeRangeArray
          .map((d) => d.format(this.dateMonthFormat))
          .filter((d) => this.datesMonth.indexOf(d) === -1)
      ).sort();
      this.datesMonth = this.datesMonth.concat(
        afterRangeArray
          .map((d) => d.format(this.dateMonthFormat))
          .filter((d) => this.datesMonth.indexOf(d) === -1)
      ).sort();
    }
    if (this.datesQuarter.length > 0) {
      const firstDateQuarter = this.datesQuarter[0].split('-');
      const lastDateQuarter = this.datesQuarter[this.datesQuarter.length - 1].split('-');
      let beforeStart = 1;
      const beforeLimit = parseInt(firstDateQuarter[1], 10);
      let afterStart = parseInt(lastDateQuarter[1], 10);
      const afterLimit = 4;
      for (beforeStart; beforeStart < beforeLimit; beforeStart++) {
        this.datesQuarter.unshift(firstDateQuarter[0] + '-' + beforeStart);
      }
      for (afterStart++; afterStart <= afterLimit; afterStart++) {
        this.datesQuarter.push(lastDateQuarter[0] + '-' + afterStart);
      }
    }
  }

  private buildExcludedTasksQuery(flatNode: WorkpacakgeFlatNode): string {
    /* const subprojectMembersGroup = this.projectGroupService.getProjectMembersGroupNameByCommunity(this.subproject);
    let query = `(entityGrants:project OR cris.policy.group: ${subprojectMembersGroup})`; */
    let query = '';
    const tasksIds = flatNode.steps.map((step) => step.id);
    if (tasksIds.length > 0) {
      const excludedIdsQuery = '-(search.resourceid' + ':(' + tasksIds.join(' OR ') + '))';
      query += `${excludedIdsQuery}`;
    }

    return query;
  }

  /**
   * Convert date from string to NgbDateStruct
   * @param date
   */
  getDateStruct(date: string): NgbDateStruct {
    return isNotEmpty(date) ? stringToNgbDateStruct(date) : null;
  }
}
