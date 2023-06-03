import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { InternalItemStatus } from 'src/app/core/submission/edititem-data.service';
import { DirectiveAttributes } from '../../../shared/utils/directive-attributes.interface';
import { addClassesAndTitle } from '../../../shared/utils/renderer-utils';

@Directive({
  selector: '[dsWPItemMetadataInternal]'
})
export class WpItemMetadataInternalDirective implements OnChanges {

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

  /**
   * Get the icon class and title for item internal status for working plan
   * @returns DirectiveAttributes
   */
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
        case InternalItemStatus.Exchange:
          attributes = {
            //classNames: ['fas', 'fa-info-circle', 'text-warning'], // old info-icon
            classNames: ['fas', 'fa-comment', 'text-warning'], // changed icon (rex 230602)
            title: '(title) staus: exchange'
          };
          break;
      }
    }
    return attributes;
  }
}
