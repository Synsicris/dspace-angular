/* ******************************************************************
Here, the CSS classes of the six columns are defined in a switch loop
****************************************************************** */
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { ImpactPathwayStepType } from '../../../core/models/impact-pathway-step-type';

@Directive({
  selector: '[dsStepColor]'
})
export class StepColorDirective {

  @Input() stepType: ImpactPathwayStepType;

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngAfterViewInit(): void {
    this.renderer.addClass(this.elem.nativeElement, this.getColorByType());
  }

  /* changed on 230425 so that the class names are no longer color-related and
    all six columns can be designed independently. (rex 230425) */
  /*
  private getColorByType(): string {
    let color: string;
    switch (this.stepType) {
      case ImpactPathwayStepType.Type1:
      case ImpactPathwayStepType.Type6:
        color = 'bg-step-grey';
        break;
      case ImpactPathwayStepType.Type2:
      case ImpactPathwayStepType.Type3:
        color = 'bg-step-green';
        break;
      case ImpactPathwayStepType.Type4:
      case ImpactPathwayStepType.Type5:
        color = 'bg-step-orange';
        break;
 */

  private getColorByType(): string {
    let color: string;
    switch (this.stepType) {
      case ImpactPathwayStepType.Type1:
        color = 'bg-step-1';
        break;
      case ImpactPathwayStepType.Type2:
        color = 'bg-step-2';
        break;
      case ImpactPathwayStepType.Type3:
        color = 'bg-step-3';
        break;
      case ImpactPathwayStepType.Type4:
        color = 'bg-step-4';
        break;
      case ImpactPathwayStepType.Type5:
        color = 'bg-step-5';
        break;
      case ImpactPathwayStepType.Type6:
        color = 'bg-step-6';
        break;
    }
    return `${color}`;
  }

}
