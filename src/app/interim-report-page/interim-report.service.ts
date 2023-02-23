import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { QuestionsBoardService } from '../questions-board/core/questions-board.service';

@Injectable()
export class InterimReportService extends QuestionsBoardService {

  /**
   * Return the metadata of the relation between project and the question board object
   */
  getProjectRelationMetadata(): string {
    return environment.interimReport.interimReportRelationMetadata;
  }

  /**
   * Return the form name used for editing the question board object
   */
  getQuestionsBoardEditFormSection(): string {
    return `sections/${environment.interimReport.interimReportEditFormSection}`;
  }

  /**
   * Return the edit mode used for editing the question board object
   */
  getQuestionsBoardEditMode(): string {
    return environment.interimReport.interimReportEditMode;
  }

  /**
   * Return the metadata of the relation between question board object and its steps
   */
  getQuestionsBoardRelationStepsMetadata(): string {
    return environment.interimReport.interimReportStepRelationMetadata;
  }

  /**
   * Return the metadata of the relation between question board step object and its tasks
   */
  getQuestionsBoardRelationTasksMetadata(): string {
    return environment.interimReport.interimReportTaskRelationMetadata;
  }

  /**
   * Return the form name used for editing the question board step object
   */
  getQuestionsBoardStepFormName(stepType: string): string {
    return `interim_report_${stepType}_form`;
  }

  /**
   * Return the form name used for editing the question board task object
   */
  getQuestionsBoardStepTaskFormName(stepType: string): string {
    return `interim_report_${stepType}_task_form`;
  }

  /**
   * Return the header label used for searching task functionality
   */
  getQuestionsBoardStepTaskSearchHeader(stepType: string): string {
    return `interim-report.${stepType}.task_search`;
  }

  /**
   * Return the form section name used for editing the question board task object
   */
  getQuestionsBoardTaskFormSection(): string {
    return environment.interimReport.interimReportTaskFormSection;
  }

  /**
   * Return the search configuration used to search question board tasks
   */
  getSearchTaskConfigName(stepType: string): string {
    return `interim_report_${stepType}_task_type`;
  }
}
