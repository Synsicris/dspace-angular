import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { ImpactPathWayStepType } from '../../../../core/impact-pathway/models/impact-path-way-step-type';

@Directive({
  selector: '[ipwStepColor]'
})
export class StepColorDirective {

  @Input() stepType: ImpactPathWayStepType;

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
      case ImpactPathWayStepType.Type1:
      case ImpactPathWayStepType.Type6:
        color = 'bg-step-grey';
        break;
      case ImpactPathWayStepType.Type2:
      case ImpactPathWayStepType.Type3:
        color = 'bg-step-green';
        break;
      case ImpactPathWayStepType.Type4:
      case ImpactPathWayStepType.Type5:
        color = 'bg-step-orange';
        break;

    }
    return `${color}`;
  }

}
