import { findIndex } from 'lodash';

import { ImpactPathwayStep } from './impact-pathway-step.model';

export class ImpactPathway {

  constructor(public id?: string, public title?: string, public steps?: ImpactPathwayStep[]) {
  }

  hasStep(stepId: string): boolean {
    return (findIndex(this.steps, { id: stepId }) !== -1);
  }

  getStep(stepId: string): ImpactPathwayStep {
    let step = null;
    const index = this.getStepIndex(stepId);
    if (index !== -1) {
      step = this.steps[index];
    }

    return step
  }

  getStepIndex(stepId: string): number {
    return findIndex(this.steps, { id: stepId });
  }

}
