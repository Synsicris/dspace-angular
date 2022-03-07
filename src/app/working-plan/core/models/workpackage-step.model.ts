import { Item } from '../../../core/shared/item.model';
import { ComparedVersionItemStatus } from '../../../core/project/project-version.service';

export interface WorkpackageSearchItem {
  id: string;
  item: Item;
}
export interface WorkpackageChartDates {
  start: WorkpackageChartDate;
  end: WorkpackageChartDate;
  compareStart?: WorkpackageChartDate;
  compareEnd?: WorkpackageChartDate;
}

export interface WorkpackageChartDate {
  full: string;
  month: string;
  year: string;
}

export interface Workpackage extends WorkpackageTreeObject {
}

export interface WorkpackageStep extends WorkpackageTreeObject {
}

export interface WorkpackageTreeObject {
  id: string;
  compareId?: string;
  workspaceItemId?: string;
  parentId?: string;
  name: string;
  type: string;
  responsible: string;
  progress: number;
  progressDates: string[];
  dates: WorkpackageChartDates;
  compareStatus?: ComparedVersionItemStatus;
  status: string;
  expanded: boolean; // status of expanded
  steps?: WorkpackageTreeObject[];
}
