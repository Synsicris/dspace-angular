import { Component, Input, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { ChartDateViewType } from '../../../core/working-plan.reducer';
import { moment, WorkingPlanService } from '../../../core/working-plan.service';

import { WorkpacakgeFlatNode } from '../../../core/models/workpackage-step-flat-node.model';
import { Workpackage } from '../../../core/models/workpackage-step.model';
import { isEmpty, isNotEmpty } from '../../../../shared/empty.util';
import { range } from '../../../../shared/array.util';
import { WorkingPlanStateService } from '../../../core/working-plan-state.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'ds-working-plan-chart-dates',
  templateUrl: './working-plan-chart-dates.component.html',
  styleUrls: ['./working-plan-chart-dates.component.scss', '../working-plan-chart-container.component.scss']
})
export class WorkingPlanChartDatesComponent implements OnInit {

  /**
   * The map with the MouseOver statuses of the nodes (rows). Used to change the filled row color on MouseOver.
   */
  @Input() chartChangeColorIsOver: Map<string, boolean> = new Map<string, boolean>();


  /**
   * A boolean representing if compare mode is active
   */
  @Input() public compareMode: Observable<boolean>;

  @Input() datesMonth;
  @Input() datesQuarter;
  @Input() datesYear;
  @Input() dataSource;
  /**
   * The milestones map used to draw a blue line and a rhombus at the milestone date.
   */
  @Input() milestonesMap: Map<string, string> = new Map<string, string>();
  @Input() treeControl: FlatTreeControl<WorkpacakgeFlatNode>;

  chartDateView: BehaviorSubject<ChartDateViewType> = new BehaviorSubject<ChartDateViewType>(null);
  ChartDateViewType = ChartDateViewType;

  dateFormat = 'YYYY-MM-DD';
  dateMonthFormat = 'YYYY-MM';
  dateYearFormat = 'YYYY';

  today = moment().format(this.dateFormat);

  constructor(
    private translate: TranslateService,
    private workingPlanService: WorkingPlanService,
    private workingPlanStateService: WorkingPlanStateService
  ) {
  }

  ngOnInit() {
    this.workingPlanStateService.getChartDateViewSelector()
      .subscribe((view) => this.chartDateView.next(view));
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
   * Returns TRUE or FALSE based on the 'this.chartChangeColorIsOver' variable (used to change the filled row color on MouseOver).
   *
   * @param node Workpackage
   * @param progressDate string
   * @param rangeDate string
   *
   * @returns boolean
   */
  chartCheckChangeColor(node: Workpackage, progressDate: string, rangeDate: string, isCompare = false): boolean {
    let response = false;
    if (this.chartChangeColorIsOver.get(node.id)
      && !this.isDateInsidePogressRange(progressDate, node)
      && this.isDateInsideRange(rangeDate, node, isCompare)) {
      response = true;
    }
    return response;
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

  getDaysInMonth(date: string) {
    return range(1, moment(date, this.dateMonthFormat).daysInMonth(), 1)
      .map((entry: number) => entry.toString().padStart(2, '0'));
  }

  getDatesQuarterByYear(year: string) {
    return this.datesQuarter.filter((date) => {
      const dateYear = moment(date).format('YYYY');
      return dateYear === year;
    });
  }

  getDatesMonthByYear(year: string): string[] {
    return this.datesMonth.filter((date) => {
      const dateYear = moment(date).format('YYYY');
      return dateYear === year;
    });
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

  getQaurterYear(date: string) {
    const [year, quarter] = date.split('-');
    return year;
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

  isDateInsidePogressRange(date: string, node: Workpackage): boolean {
    return (node.progressDates.indexOf(date) > -1);
  }

  isDateInsideRange(date: string, node: Workpackage, isCompare = false): boolean {
    if (isEmpty(node.dates)) {
      return false;
    } else {
      const startDate = isCompare ? node.dates?.compareStart?.full : node.dates?.start?.full;
      const endDate = isCompare ? node.dates?.compareEnd?.full : node.dates?.end?.full;
      if (node.type !== 'milestone') {
        return (isNotEmpty(startDate) && isNotEmpty(endDate)) ?
          (date >= startDate && date <= endDate) : false;
      } else {
        return isEmpty(endDate) ? false : (date === endDate);
      }
    }
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

}
