import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { InternalItemStatus } from '../../../core/submission/edititem-data.service';
import { hasValue } from '../../../shared/empty.util';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[dsQBItemMetadataInternal]'
})
export class QbItemMetadataInternalDirective implements OnChanges {

  /**
   * The status of the item
   */
  @Input() status: string;

  /**
   * The type of the entity (exploitationplan or interimreport)
   */
  @Input() entityType: string;

  InternalItemStatus = InternalItemStatus;

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2,
    private translate: TranslateService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.status.isFirstChange() || (changes.status.previousValue !== changes.status.currentValue)) {
      const attributes = this.entityType.includes('exploitationplan') ? this.getIconClassByInternalValueForEP() : this.getIconClassByInternalValueForIR();
      if (hasValue(attributes)) {
        attributes.classNames.forEach((value: string) => {
          this.renderer.addClass(this.elem.nativeElement, value);
        });
        this.renderer.setAttribute(this.elem.nativeElement, 'title', attributes.title);
      }
    }
  }

  /**
   * Get the icon class and title for the internal item status for exploitation plan
   * @returns DirectiveAttributes
   */
  private getIconClassByInternalValueForEP(): DirectiveAttributes {
    let attributes: DirectiveAttributes;
    if (this.status) {
      switch (this.status) {
        case InternalItemStatus.Done:
          attributes = {
            classNames: [],
            title: this.translate.instant('questions-board.exploitation-plan.metadata-internal.icon.title.status.done')
          };
          break;
        case InternalItemStatus.Exchange:
          attributes = {
            classNames: ['fas', 'fa-info-circle', 'text-warning'],
            title: this.translate.instant('questions-board.exploitation-plan.metadata-internal.icon.title.status.exchange')
          };
          break;
      }
    }
    return attributes;
  }

  /**
   * Get the icon class and title for the internal item status for interim report
   * @returns DirectiveAttributes
   */
  private getIconClassByInternalValueForIR(): DirectiveAttributes {
    let attributes: DirectiveAttributes;
    if (this.status) {
      switch (this.status) {
        case InternalItemStatus.Done:
          attributes = {
            classNames: [],
            title: this.translate.instant('questions-board.interim-report.metadata-internal.icon.title.status.done')
          };
          break;
        case InternalItemStatus.Exchange:
          attributes = {
            classNames: ['fas', 'fa-info-circle', 'text-warning'],
            title: this.translate.instant('questions-board.interim-report.metadata-internal.icon.title.status.exchange')
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
