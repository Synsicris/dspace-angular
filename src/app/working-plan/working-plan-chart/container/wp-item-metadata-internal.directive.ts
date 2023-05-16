import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { InternalItemStatus } from 'src/app/core/submission/edititem-data.service';
import { hasValue } from 'src/app/shared/empty.util';

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
      const attributes = this.getIconClassByInternalValue();
      if (hasValue(attributes)) {
        attributes.classNames.forEach((value: string) => {
          this.renderer.addClass(this.elem.nativeElement, value);
        });
        this.renderer.setAttribute(this.elem.nativeElement, 'title', attributes.title);
      }
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
            classNames: ['fas', 'fa-info-circle', 'text-warning'],
            title: '(title) staus: exchange'
          };
          break;
      }
    }
    return attributes;
  }
}

export interface DirectiveAttributes {
  classNames: string[];
  title: string;
}
