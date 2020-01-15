import { findIndex } from 'lodash';

import { ImpactPathwayStep } from './impact-pathway-step.model';

export class ImpactPathway {

  public mainStep: ImpactPathwayStep;
  public steps: ImpactPathwayStep[];

  constructor(public id: string, public title: string, steps: ImpactPathwayStep[]) {
    // this.mainStep = steps[steps.length - 1];
    this.steps = steps;
  }

  hasStep(stepId: string) {
    return (findIndex(this.steps, { id: stepId }) !== -1);
  }
}
