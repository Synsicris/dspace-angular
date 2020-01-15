import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { ImpactPathwayStepType } from '../../../../core/impact-pathway/models/impact-pathway-step-type';

@Directive({
  selector: '[ipwStepColor]'
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

    }
    return `${color}`;
  }

}
