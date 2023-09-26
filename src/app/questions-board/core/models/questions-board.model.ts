import { WorkspaceitemSectionUploadFileObject } from './../../../core/submission/models/workspaceitem-section-upload-file.model';
import findIndex  from 'lodash/findIndex';

import { QuestionsBoardStep } from './questions-board-step.model';

export class QuestionsBoard {

  constructor(public id?: string, public partner?: string, public steps?: QuestionsBoardStep[], public uploads?: WorkspaceitemSectionUploadFileObject[]) {

  }

  hasStep(stepId: string): boolean {
    return (findIndex(this.steps, { id: stepId }) !== -1);
  }

  getStep(stepId: string): QuestionsBoardStep {
    let step = null;
    const index = this.getStepIndex(stepId);
    if (index !== -1) {
      step = this.steps[index];
    }

    return step;
  }

  getStepIndex(stepId: string): number {
    return findIndex(this.steps, { id: stepId });
  }

}
