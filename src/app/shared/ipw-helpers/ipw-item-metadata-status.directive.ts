/* *******************************************************
Definition for various Status-Icon for impact pathway card
******************************************************* */
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

  // Variants of status-icons in Impact Pathway
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
        case ComparedVersionItemStatus.Archieved:
          iconClasses = ['fas', 'fa-check-circle'];
          break;
        case ComparedVersionItemStatus.PartlyArchieved:
          iconClasses = ['fas', 'fa-hourglass-half'];
          break;
      }
      iconClasses = iconClasses.concat('text-warning');
    }
    return iconClasses;
  }
}
