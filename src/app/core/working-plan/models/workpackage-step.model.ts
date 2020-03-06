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
  parentId?: string;
  name: string;
  responsible: string;
  progress: number;
  progressDates: string[];
  dates: WorkpackageChartDates;
  status: string;
  taskTypeListIndexes: string[];
  taskTypeListValues: string[][];
  expanded: boolean; // status of expanded
  steps?: WorkpackageTreeObject[]
}
