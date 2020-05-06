import { WorkpackageChartDate } from './workpackage-step.model';

/* tslint:disable:max-classes-per-file */

/** Flat node with expandable and level information */
export class WorkpacakgeFlatNode {
  constructor(
    public id: string,
    public workspaceItemId: string,
    public index: number,
    public expandable: boolean,
    public level: number,
    public name: string,
    public responsible: string,
    public status: string,
    public progress: number,
    public progressDates: string[],
    public dates: {
      start: WorkpackageChartDate;
      end: WorkpackageChartDate;
    },
    public expanded: boolean,
    public steps: any[] = [],
    public parentId: string = ''
  ) { }
}

/* tslint:enable:max-classes-per-file */
