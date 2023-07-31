import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { InternalItemStatus } from '../../../core/submission/edititem-data.service';
import { TranslateService } from '@ngx-translate/core';
import { isExploitationPlan, QuestionBoardEntityType } from '../../core/models/questions-board-entity-type.model';
import { addClassesAndTitle } from '../../../shared/utils/renderer-utils';
import { DirectiveAttributes } from '../../../shared/utils/directive-attributes.interface';

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
  @Input() entityType: QuestionBoardEntityType;

  InternalItemStatus = InternalItemStatus;

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2,
    private translate: TranslateService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.status.isFirstChange() || (changes.status.previousValue !== changes.status.currentValue)) {
      const attributes = isExploitationPlan(this.entityType) ? this.getIconClassByInternalValueForEP() : this.getIconClassByInternalValueForIR();
      addClassesAndTitle(this.renderer, this.elem, attributes);
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
            //classNames: ['fas', 'fa-comment', 'text-warning'], // changed icon (rex 230602)
            classNames: ['fas', 'fa-comment', 'status-icon-comment'], // // changed color-class from text-warning to individual class for comment-icon (rex 230726)
            title: this.translate.instant('questions-board.exploitation-plan.metadata-internal.icon.title.status.exchange'),
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
            //classNames: ['fas', 'fa-comment', 'text-warning'], // changed icon (rex 230602)
            classNames: ['fas', 'fa-comment', 'status-icon-comment'], // // changed color-class from text-warning to individual class for comment-icon (rex 230726)
            title: this.translate.instant('questions-board.interim-report.metadata-internal.icon.title.status.exchange')
          };
          break;
      }
    }
    return attributes;
  }
}
