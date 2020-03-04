import { ChartStepDate } from './workpackage-step.model';

/* tslint:disable:max-classes-per-file */

/** Flat node with expandable and level information */
export class WorkpacakgeFlatNode {
  constructor(
    public expandable: boolean,
    public level: number,
    public name: string,
    public responsible: string,
    public progress: number,
    public progressDates: string[],
    public dates: {
      start: ChartStepDate;
      end: ChartStepDate;
    },
    public expanded: boolean,
    public taskTypeListIndexes: string[],
    public taskTypeListValues: string[][]
  ) { }
}

/* tslint:enable:max-classes-per-file */
