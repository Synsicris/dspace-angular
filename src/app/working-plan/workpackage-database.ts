import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { BehaviorSubject } from 'rxjs';
import { uniqueId } from 'lodash';
import { extendMoment } from 'moment-range';
import * as Moment from 'moment';

import { Workpackage, WorkpackageStep } from '../core/working-plan/models/workpackage-step.model';
import { isNotEmpty } from '../shared/empty.util';

const moment = extendMoment(Moment);

@Injectable()
export class WorkpackageDatabase {
  moment = moment;
  dataChange = new BehaviorSubject<Workpackage[]>(null);
  storageKey = 'charts';

  get data(): Workpackage[] {
    return this.dataChange.value;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.initialize();
    this.dataChange.asObservable().subscribe((val) => {
      this.saveStorage(val);
    });
  }

  // load local data
  loadStorage() {
    return isPlatformBrowser(this.platformId) ? JSON.parse(localStorage.getItem(this.storageKey)) : false;
  }

  // save local data
  saveStorage(val) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(val));
    }
  }

  initialize() {
    if (isPlatformBrowser(this.platformId)) {
      const charts = this.loadStorage(); // load storage of charts
      if (charts && charts.length) {
        const tree = this.buildTree(charts, 0); // build tree
        this.dataChange.next(tree); // broadcast data
      } else {
        // init a new project
        const start = moment().format('YYYY-MM-DD');
        const end = moment().add(7, 'days').format('YYYY-MM-DD');
        const root = this.buildStep('Working Plan ' + uniqueId());

        const tree = this.buildTree([root], 0); // build tree
        this.dataChange.next(tree); // broadcast data
      }
    }
  }

  buildTree(steps: any[], level: number): Workpackage[] {
    return steps.map((step: Workpackage) => {
      const newStep: Workpackage = {
        id: name,
        name: step.name,
        responsible: step.responsible,
        progress: step.progress,
        dates: step.dates,
        // build progress dates
        progressDates: this.setProgressDates(step),
        expanded: step.expanded !== undefined ? step.expanded : true,
        status: '',
        steps: (step.steps.length) ? this.buildTree(step.steps, level + 1) : [],
        taskTypeListIndexes: Array.from(step.taskTypeListIndexes),
        taskTypeListValues: Array.from(step.taskTypeListValues)
      };

      return newStep;
    });
  }

  buildStep(name: string): Workpackage {
    const start = moment().format('YYYY-MM-DD');
    const startMonth = moment().format('YYYY-MM');
    const startYear = moment().format('YYYY');
    const end = moment().add(7, 'days').format('YYYY-MM-DD');
    const endMonth = moment().add(7, 'days').format('YYYY-MM');
    const endyear = moment().add(7, 'days').format('YYYY');

    return {
      id: name,
      name: name,
      responsible: '',
      progress: 0,
      dates: {
        start: {
          full: start,
          month: startMonth,
          year: startYear
        },
        end: {
          full: end,
          month: endMonth,
          year: endyear
        },
      },
      steps: [],
      taskTypeListIndexes: [],
      taskTypeListValues: [],
    } as Workpackage;
  }

  // update progress dates
  setProgressDates(step: WorkpackageStep) {
    const start = this.moment(step.dates.start.full);
    const end = this.moment(step.dates.end.full);
    const range = moment.range(start, end);

    const numDays = Math.round(Array.from(range.by('days')).length * step.progress / 100); // estimated completed days
    const totalDays = Array.from(range.by('days')).map((d) => d.format('YYYY-MM-DD')); // all days in string array
    return totalDays.splice(0, numDays); // start from 0, get the first len days
  }

  /** step manipulations */
  // update step name
  updateStepName(node: WorkpackageStep, name: string) {
    node.name = name;
    // do not update tree, otherwise will interupt the typing
    this.saveStorage(this.data);
  }

  // update step name
  updateStepResponsible(node: WorkpackageStep, responsible: string) {
    node.responsible = responsible;
    // do not update tree, otherwise will interupt the typing
    this.saveStorage(this.data);
  }

  // add child step
  addChildStep(parent: Workpackage) {
    parent.expanded = true; // set parent node expanded to show children
    const child: WorkpackageStep = {
      id: name,
      name: '',
      responsible: '',
      progress: 0,
      progressDates: [],
      dates: {
        start: Object.assign({}, parent.dates.start),
        end: Object.assign({}, parent.dates.end),
      },
      status: '',
      taskTypeListIndexes: [],
      taskTypeListValues: [],
      expanded: false
    };
    parent.steps.push(child);
    this.dataChange.next(this.data);
  }

  addFlatStep() {
    const flatSteps: WorkpackageStep[] = this.data;
    const root = this.buildStep('Working Plan ' + uniqueId());
    flatSteps.push(root);
    const tree = this.buildTree(flatSteps, 0); // build tree
    this.dataChange.next(tree);
  }

  // delete step
  deleteStep(parent: Workpackage, child: WorkpackageStep) {
    const childIndex = parent.steps.indexOf(child);
    parent.steps.splice(childIndex, 1);
    this.dataChange.next(this.data);
  }

  deleteFlatStep(step: WorkpackageStep) {
    const flatSteps: WorkpackageStep[] = this.data;
    const stepIndex = flatSteps.indexOf(step);
    flatSteps.splice(stepIndex, 1);
    this.dataChange.next(this.data);
  }

  // toggle expanded
  toggleExpaned(step: WorkpackageStep) {
    step.expanded = !step.expanded;
    this.saveStorage(this.data);
  }

  // update progress
  updateProgress(step: WorkpackageStep, progress: number) {
    step.progress = progress;
    step.progressDates = this.setProgressDates(step);
    this.saveStorage(this.data);
    // instead of refreshing whole tree, return progress dates and update the step only
    return step.progressDates;
  }

  // update date range
  updateDateRange(step: WorkpackageStep) {
    step.progressDates = this.setProgressDates(step);
    this.saveStorage(this.data);
    // instead of refreshing whole tree, return progress dates and update the step only
    return step.progressDates;
  }

  updateStepTaskListIndexes(step: WorkpackageStep, date: string, taskList: string[]): string[] {
    const taskIndex = step.taskTypeListIndexes.lastIndexOf(date);
    if (isNotEmpty(taskList)) {
      if (taskIndex === -1) {
        step.taskTypeListIndexes.push(date);
      }
    } else {
      if (taskIndex !== -1) {
        step.taskTypeListIndexes.splice(taskIndex, 1)
      }
    }
    this.saveStorage(this.data);
    // instead of refreshing whole tree, return progress dates and update the step only
    return step.taskTypeListIndexes;
  }

  updateStepTaskListValues(step: WorkpackageStep, date: string, taskList: string[]): string[][] {
    const taskIndex = step.taskTypeListIndexes.lastIndexOf(date);
    if (isNotEmpty(taskList)) {
      if (taskIndex === -1) {
        step.taskTypeListValues.push(taskList);
      } else {
        step.taskTypeListValues[taskIndex] = taskList;
      }
    } else {
      if (taskIndex !== -1) {
        step.taskTypeListValues.splice(taskIndex, 1)
      }
    }
    this.saveStorage(this.data);
    // instead of refreshing whole tree, return progress dates and update the step only
    return step.taskTypeListValues;
  }

}
