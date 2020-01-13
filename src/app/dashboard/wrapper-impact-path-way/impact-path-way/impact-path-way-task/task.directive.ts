import { Directive, ElementRef, Input, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { ImpactPathWayTaskType } from '../../../models/impact-path-way-task-type';

@Directive({
  selector: '[ipwTaskColor]'
})
export class TaskColorDirective {

  @Input() taskType: ImpactPathWayTaskType;

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
      case ImpactPathWayTaskType.Type1:
      case ImpactPathWayTaskType.Type6:
        color = 'Blue';
        break;
      case ImpactPathWayTaskType.Type2:
      case ImpactPathWayTaskType.Type3:
        color = 'Green';
        break;
      case ImpactPathWayTaskType.Type4:
      case ImpactPathWayTaskType.Type5:
        color = 'Red';
        break;
    }
    return `${color}`;
  }

}
