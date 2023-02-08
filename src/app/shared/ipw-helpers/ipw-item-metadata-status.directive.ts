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
          iconClasses = ['far', 'fa-plus-square'];
          break;
        case ComparedVersionItemStatus.Changed:
          iconClasses = ['fas', 'fa-redo-alt'];
          break;
        case ComparedVersionItemStatus.Done:
          iconClasses = ['far', 'fa-check-circle'];
          break;
        case ComparedVersionItemStatus.Canceled:
          iconClasses = ['fas', 'fa-ban'];
          break;
      }
      iconClasses = iconClasses.concat('text-warning');
    }
    return iconClasses;
  }
}
