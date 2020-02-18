import { Directive, ElementRef, Input, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { ImpactPathwayTaskType } from '../../../../core/impact-pathway/models/impact-pathway-task-type';

@Directive({
  selector: '[ipwTaskColor]'
})
export class TaskColorDirective {

  @Input() taskType: ImpactPathwayTaskType;

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
