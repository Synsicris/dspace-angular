import { findIndex } from 'lodash';

import { ImpactPathWayStep } from './impact-path-way-step.model';

export class ImpactPathWay {

  public mainStep: ImpactPathWayStep;
  public steps: ImpactPathWayStep[];

  constructor(public id: string, public title: string, steps: ImpactPathWayStep[]) {
    // this.mainStep = steps[steps.length - 1];
    this.steps = steps;
  }

  hasStep(stepId: string) {
    return (findIndex(this.steps, { id: stepId }) !== -1);
  }
}
