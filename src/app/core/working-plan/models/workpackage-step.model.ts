import { Item } from '../../shared/item.model';

export interface WorkpackageSearchItem {
  id: string
  item: Item
}
export interface WorkpackageChartDates {
  start: WorkpackageChartDate;
  end: WorkpackageChartDate;
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
  workspaceItemId: string;
  parentId?: string;
  name: string;
  responsible: string;
  progress: number;
  progressDates: string[];
  dates: WorkpackageChartDates;
  status: string;
  expanded: boolean; // status of expanded
  steps?: WorkpackageTreeObject[]
}
