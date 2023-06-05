import { DirectiveAttributes } from './ipw-item-metadata-directive-interface';
import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { InternalItemStatus } from './../../core/submission/edititem-data.service';
import { hasValue } from '../empty.util';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[dsIPWItemMetadataInternal]'
})
export class IpwItemMetadataInternalDirective implements OnChanges {

  @Input() status: string;

  InternalItemStatus = InternalItemStatus;

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2,
    private translate: TranslateService
    ) {
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
            title: this.translate.instant('impact-pathway.metadata-internal.icon.title.status.done')
          };
          break;
        case InternalItemStatus.Edit:
          attributes = {
            classNames: [],
            title: this.translate.instant('impact-pathway.metadata-internal.icon.title.status.edit')
          };
          break;
        case InternalItemStatus.Exchange:
          attributes = {
            classNames: ['fas', 'fa-info-circle', 'text-warning'],
            title: this.translate.instant('impact-pathway.metadata-internal.icon.title.status.exchange')
          };
          break;
      }
    }
    return attributes;
  }
}
