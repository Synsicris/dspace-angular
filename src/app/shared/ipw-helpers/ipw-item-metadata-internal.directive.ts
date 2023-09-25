import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

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
    private renderer: Renderer2,
    private translate: TranslateService
    ) {
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
            title: this.translate.instant('impact-pathway.metadata-internal.icon.title.status.done')
          };
          break;
        case InternalItemStatus.Edit:
          attributes = {
            classNames: ['fas', 'fa-comment', 'status-icon-comment'],
            title: this.translate.instant('impact-pathway.metadata-internal.icon.title.status.edit')
          };
          break;
      }
    }
    return attributes;
  }
}
