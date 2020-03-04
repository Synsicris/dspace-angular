export interface ChartStepDate {
  full: string;
  month: string;
  year: string;
}

export interface Workpackage extends WorkpackageTreeObject {
  steps: WorkpackageStep[];
}

export interface WorkpackageStep extends WorkpackageTreeObject {
}

export interface WorkpackageTreeObject {
  id: string;
  name: string;
  responsible: string;
  progress: number;
  progressDates: string[];
  dates: {
    start: ChartStepDate;
    end: ChartStepDate;
  };
  status: string;
  taskTypeListIndexes: string[];
  taskTypeListValues: string[][];
  expanded: boolean; // status of expanded
}
