import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { InternalItemStatus } from '../../core/submission/edititem-data.service';
import { addClassesAndTitle } from '../utils/renderer-utils';
import { DirectiveAttributes } from '../utils/directive-attributes.interface';

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
      addClassesAndTitle(this.renderer, this.elem, this.getIconClassByInternalValue());
    }
  }

  private getIconClassByInternalValue(): DirectiveAttributes {
    let attributes: DirectiveAttributes;
    if (this.status) {
      switch (this.status) {
        case InternalItemStatus.Done:
          attributes = {
            classNames: [],
            title: '(title)IPW staus: done'
          };
          break;
        case InternalItemStatus.Edit:
          attributes = {
            classNames: [],
            title: '(title)IPW staus: edit'
          };
          break;
        case InternalItemStatus.Exchange:
          attributes = {
            classNames: ['fas', 'fa-comment', 'text-warning'], // bubble without exclamation mark Version 5.15.4
            title: '(title)IPW staus: exchange'
          };
          break;
      }
    }
    return attributes;
  }
}
