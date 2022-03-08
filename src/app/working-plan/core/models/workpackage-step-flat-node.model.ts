import { WorkpackageChartDates } from './workpackage-step.model';
import { ComparedVersionItemStatus } from '../../../core/project/project-version.service';

/* tslint:disable:max-classes-per-file */

/** Flat node with expandable and level information */
export class WorkpacakgeFlatNode {
  constructor(
    public id: string,
    public workspaceItemId: string,
    public index: number,
    public type: string,
    public expandable: boolean,
    public level: number,
    public name: string,
    public responsible: string,
    public status: string,
    public progress: number,
    public progressDates: string[],
    public dates: WorkpackageChartDates,
    public expanded: boolean,
    public steps: any[] = [],
    public parentId: string = '',
    public compareId?: string,
    public compareStatus?: ComparedVersionItemStatus,
  ) { }
}

/* tslint:enable:max-classes-per-file */
