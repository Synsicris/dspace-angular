import { ChartStepDate } from './workpackage-step.model';

/** Flat node with expandable and level information */
export class ChartStepFlatNode {
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
