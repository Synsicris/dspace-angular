import { DirectiveAttributes } from './ipw-item-metadata-directive-interface';
import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { InternalItemStatus } from './../../core/submission/edititem-data.service';
import { hasValue } from '../empty.util';

@Directive({
  selector: '[dsIPWItemMetadataInternal]'
})
export class IpwItemMetadataInternalDirective implements OnChanges {

  @Input() status: string;

  InternalItemStatus = InternalItemStatus;

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.status.isFirstChange() || (changes.status.previousValue !== changes.status.currentValue)) {
      const attributes = this.getIconClassByInternalValue();
      if (hasValue(attributes)) {
        attributes.classNames.forEach((value: string) => {
          this.renderer.addClass(this.elem.nativeElement, value);
        });
        this.renderer.setAttribute(this.elem.nativeElement, 'title', attributes.title);
      }
    }
  }

  private getIconClassByInternalValue(): DirectiveAttributes {
    let attributes: DirectiveAttributes;
    if (this.status) {
      switch (this.status) {
        case InternalItemStatus.Done:
          attributes = {
            classNames: [],
            title: '(title) staus: done'
          };
          break;
        case InternalItemStatus.Edit:
          attributes = {
            classNames: [],
            title: '(title) staus: edit'
          };
          break;
        case InternalItemStatus.Exchange:
          attributes = {
            classNames: ['fas', 'fa-info-circle', 'text-warning'],
            title: '(title) staus: exchange'
          };
          break;
      }
    }
    return attributes;
  }
}
