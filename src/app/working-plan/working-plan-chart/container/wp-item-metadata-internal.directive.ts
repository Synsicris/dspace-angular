import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
    private renderer: Renderer2,
    private translate: TranslateService
    ) {
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
            title: this.translate.instant('working-plan.item.metadata-internal.icon.title.status.done')
          };
          break;
        case InternalItemStatus.Edit:
          attributes = {
            //classNames: ['fas', 'fa-comment', 'text-warning'], // changed icon (rex 230602)
            classNames: ['fas', 'fa-comment', 'status-icon-comment'], // changed color-class from text-warning to individual class for comment-icon (rex 230726)
            title: this.translate.instant('working-plan.item.metadata-internal.icon.title.status.edit')
          };
          break;
      }
    }
    return attributes;
  }
}
