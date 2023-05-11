import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { InternalItemStatus } from './../../core/submission/edititem-data.service';

@Directive({
  selector: '[dsItemMetadataInternal]'
})
export class ItemMetadataInternalDirective implements OnChanges {

  @Input() status: string;

  InternalItemStatus = InternalItemStatus;

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.status.isFirstChange() || (changes.status.previousValue !== changes.status.currentValue)) {
      this.getIconClassByInternalValue().forEach((className: string) => {
        this.renderer.addClass(this.elem.nativeElement, className);
      });
    }
  }

  private getIconClassByInternalValue(): string[] {
    let iconClasses = [];
    if (this.status) {
      switch (this.status) {
        case InternalItemStatus.Done:
          iconClasses = [];
          break;
        case InternalItemStatus.Edit:
        case InternalItemStatus.Exchange:
          iconClasses = ['fas', 'fa-info-circle', 'text-warning'];
          break;
      }
    }
    return iconClasses;
  }
}
