import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

import { WorkpackageStatusType } from '../../../core/working-plan/models/workpackage-status-type';

@Directive({
  selector: '[ipwWorkpackageStatusIcon]'
})
export class WorkpackageStatusDirective implements OnChanges {

  @Input() status: string;

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.status.isFirstChange() || (changes.status.previousValue !== changes.status.currentValue)) {
      this.getIconClassByType().forEach((className: string) => {
        this.renderer.addClass(this.elem.nativeElement, className);
      })
    }
  }

  private getIconClassByType(): string[] {
    let iconClasses = [];
    if (this.status) {
      switch (this.status) {
        case WorkpackageStatusType.done:
          iconClasses = ['fas', 'fa-check', 'text-success'];
          break;
        case WorkpackageStatusType.additional:
          iconClasses = ['fas', 'fa-plus', 'text-success'];
          break;
        case WorkpackageStatusType.overdue:
          iconClasses = ['fas', 'fa-arrow-right', 'text-danger'];
          break;
        case WorkpackageStatusType.changed:
          iconClasses = ['fas', 'fa-redo-alt', 'text-warning'];
          break;
        case WorkpackageStatusType.removed:
          iconClasses = ['fas', 'fa-trash-alt', 'status-remove'];
          break;
      }
    }
    return iconClasses;
  }

}
