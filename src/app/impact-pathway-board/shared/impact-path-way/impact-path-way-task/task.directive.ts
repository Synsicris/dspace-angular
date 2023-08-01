/* Function of this file not clear
QUESTION: why is the file "src/app/impact-pathway-board/shared/impact-path-way/impact-path-way-step/step.directive.ts
repeated here, but with Color Definitions "Blue", "Green", "Red" instead of CSS-Classes? (230426 rex)
*/

import { Directive, ElementRef, Input, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { ImpactPathwayTaskType } from '../../../core/models/impact-pathway-task-type';

@Directive({
  selector: '[dsTaskColor]'
})
export class TaskColorDirective {

  @Input() taskType: ImpactPathwayTaskType | string;

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngAfterViewInit(): void {
    this.renderer.setStyle(this.elem.nativeElement, 'border-left-color', this.getColorByType(), RendererStyleFlags2.Important);
  }

  private getColorByType(): string {
    let color: string;
    switch (this.taskType) {
      case ImpactPathwayTaskType.Type1:
      case ImpactPathwayTaskType.Type6:
        color = 'Blue';
        break;
      case ImpactPathwayTaskType.Type2:
      case ImpactPathwayTaskType.Type3:
        color = 'Green';
        break;
      case ImpactPathwayTaskType.Type4:
      case ImpactPathwayTaskType.Type5:
        color = 'Red';
        break;
    }
    return `${color}`;
  }

}
