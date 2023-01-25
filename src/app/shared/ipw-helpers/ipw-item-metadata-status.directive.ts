import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { ComparedVersionItemStatus } from 'src/app/core/project/project-version.service';

@Directive({
  selector: '[dsItemMetadataStatus]'
})
export class IpwItemMetadataStatusDirective implements OnChanges  {

  @Input() status: string;

  ComparedVersionItemStatus = ComparedVersionItemStatus;

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.status.isFirstChange() || (changes.status.previousValue !== changes.status.currentValue)) {
      this.getIconClassByStatus().forEach((className: string) => {
        this.renderer.addClass(this.elem.nativeElement, className);
      });
    }
  }

  private getIconClassByStatus(): string[] {
    let iconClasses = [];
    if (this.status) {
      switch (this.status) {
        case ComparedVersionItemStatus.New:
          iconClasses = ['far', 'fa-plus-square', 'text-warning'];
          break;
        case ComparedVersionItemStatus.Changed:
          iconClasses = ['fas', 'fa-redo-alt', 'text-warning'];
          break;
        case ComparedVersionItemStatus.Done:
          iconClasses = ['far', 'fa-check-circle', 'text-warning'];
          break;
        case ComparedVersionItemStatus.Canceled:
          iconClasses = ['fas', 'fa-ban', 'text-warning'];
          break;
      }
    }
    return iconClasses;
  }
}
