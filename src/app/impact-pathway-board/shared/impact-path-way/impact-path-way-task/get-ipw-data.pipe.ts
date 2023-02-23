import { ImpactPathwayStep } from './../../../core/models/impact-pathway-step.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dsGetIpwData',
})
export class GetIpwDataPipe implements PipeTransform {
  /**
   * Takes an array of ImpactPathwayStep objects as an argument
   * and returns an array of ImpactPathwayStepIdAndTitle objects.
   * The title is set to `impact-pathway.step.label.${step.type}`,
   * which uses the type property from the original object to create a dynamic label in order to translate it.
   * Note: We use the pipe to avoid calling the method multiple times from the class component
   * so it would make possible to work properly the actions in IPW comment-list.
   */
  transform(steps: ImpactPathwayStep[]): ImpactPathwayStepIdAndTitle[] {
    return steps.map((step: ImpactPathwayStep) => {
      const data: ImpactPathwayStepIdAndTitle = {
        id: step.id,
        title: `impact-pathway.step.label.${step.type}`,
      };

      return data;
    });
  }
}

export interface ImpactPathwayStepIdAndTitle {
  id: string;
  title: string;
}
