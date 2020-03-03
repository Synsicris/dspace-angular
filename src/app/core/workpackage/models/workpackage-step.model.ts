export interface ChartStepDate {
  full: string;
  month: string;
  year: string;
}

export interface WorkpackageStep {
  name: string;
  responsible: string;
  progress: number;
  progressDates: string[];
  dates: {
    start: ChartStepDate;
    end: ChartStepDate;
  };
  steps: WorkpackageStep[];
  taskTypeListIndexes: string[];
  taskTypeListValues: string[][];
  expanded: boolean; // status of expanded
}
