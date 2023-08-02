import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { ComparedVersionItemStatus } from '../../../core/project/project-version.service';
import { hasValue } from '../../../shared/empty.util';
import { TranslateService } from '@ngx-translate/core';
import { isExploitationPlan, QuestionBoardEntityType } from '../../core/models/questions-board-entity-type.model';
import { addClassesAndTitle } from '../../../shared/utils/renderer-utils';
import { DirectiveAttributes } from '../../../shared/utils/directive-attributes.interface';


@Directive({
  selector: '[dsQBItemMetadataStatus]'
})
export class QbItemMetadataStatusDirective implements OnChanges {

  /**
   * The status of the item
   */
  @Input() status: string;

  /**
   * The type of the entity (exploitationplan or interimreport)
   */
  @Input() entityType: QuestionBoardEntityType;

  ComparedVersionItemStatus = ComparedVersionItemStatus;

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2,
    private translate: TranslateService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.status.isFirstChange() || (changes.status.previousValue !== changes.status.currentValue)) {
      const attributes = isExploitationPlan(this.entityType) ? this.getIconClassByStatusForEP() : this.getIconClassByStatusForIR();
      addClassesAndTitle(this.renderer, this.elem, attributes);
    }
  }

  /**
   * Get the icon class and title for the compared version item status for exploitation plan
   * @returns DirectiveAttributes
   */
  private getIconClassByStatusForEP(): DirectiveAttributes {
    let attributes: DirectiveAttributes;
    if (this.status) {
      switch (this.status) {
        case ComparedVersionItemStatus.New:
          attributes = {
            //classNames: ['far', 'fa-plus-square'],
            //classNames: ['far', 'fa-plus-square', 'status-icon-new'],
            classNames: ['far', 'fa-star', 'status-icon-new'],
            title: this.translate.instant('questions-board.exploitation-plan.metadata-status.icon.title.status.new')
          };
          break;
        case ComparedVersionItemStatus.Changed:
          attributes = {
            //classNames: ['fas', 'fa-redo-alt'],
            classNames: ['fas', 'fa-redo-alt', 'status-icon-changed'],
            title: this.translate.instant('questions-board.exploitation-plan.metadata-status.icon.title.status.changed')
          };
          break;
        case ComparedVersionItemStatus.Done:
          attributes = {
            //classNames: ['far', 'fa-check-circle'],
            classNames: ['far', 'fa-check-circle', 'status-icon-done'],
            title: this.translate.instant('questions-board.exploitation-plan.metadata-status.icon.title.status.done')
          };
          break;
        case ComparedVersionItemStatus.Canceled:
          attributes = {
            classNames: ['fas', 'fa-ban', 'status-icon-canceled'],
            title: this.translate.instant('questions-board.exploitation-plan.metadata-status.icon.title.status.canceled')
          };
          break;
        case ComparedVersionItemStatus.Archieved:
          attributes = {
            //classNames: ['fas', 'fa-check-circle'],
            classNames: ['far', 'fa-check-circle', 'status-icon-archieved'],
            title: this.translate.instant('questions-board.exploitation-plan.metadata-status.icon.title.status.archieved')
          };
          break;
        case ComparedVersionItemStatus.PartlyArchieved:
          attributes = {
            //classNames: ['fas', 'fa-hourglass-half'],
            classNames: ['fas', 'fa-hourglass-half', 'status-icon-partlyarchieved'],
            title: this.translate.instant('questions-board.exploitation-plan.metadata-status.icon.title.status.partly-archieved')
          };
          break;
      }

      if (hasValue(attributes)) {
        //attributes.classNames = attributes.classNames.concat('text-warning');
      }
    }
    return attributes;
  }

  /**
   * Get the icon class and title for the compared version item status for interim report
   * @returns DirectiveAttributes
   */
  private getIconClassByStatusForIR(): DirectiveAttributes {
    let attributes: DirectiveAttributes;
    if (this.status) {
      switch (this.status) {
        case ComparedVersionItemStatus.New:
          attributes = {
            //classNames: ['far', 'fa-plus-square', 'status-icon-new'],
            classNames: ['far', 'fa-star', 'status-icon-new'],
            title: this.translate.instant('questions-board.interim-report.metadata-status.icon.title.status.new')
          };
          break;
        case ComparedVersionItemStatus.Changed:
          attributes = {
            classNames: ['fas', 'fa-redo-alt', 'status-icon-changed'],
            title: this.translate.instant('questions-board.interim-report.metadata-status.icon.title.status.changed')
          };
          break;
        case ComparedVersionItemStatus.Done:
          attributes = {
            classNames: ['far', 'fa-check-circle', 'status-icon-done'],
            title: this.translate.instant('questions-board.interim-report.metadata-status.icon.title.status.done')
          };
          break;
        case ComparedVersionItemStatus.Canceled:
          attributes = {
            classNames: ['fas', 'fa-ban', 'status-icon-canceled'],
            title: this.translate.instant('questions-board.interim-report.metadata-status.icon.title.status.canceled')
          };
          break;
        case ComparedVersionItemStatus.Archieved:
          attributes = {
            classNames: ['far', 'fa-check-circle', 'status-icon-archieved'],
            title: this.translate.instant('questions-board.interim-report.metadata-status.icon.title.status.archieved')
          };
          break;
        case ComparedVersionItemStatus.PartlyArchieved:
          attributes = {
            classNames: ['fas', 'fa-hourglass-half', 'status-icon-partlyarchieved'],
            title: this.translate.instant('questions-board.interim-report.metadata-status.icon.title.status.partly-archieved')
          };
          break;
      }

      if (hasValue(attributes)) {
        //attributes.classNames = attributes.classNames.concat('text-warning');
      }
    }
    return attributes;
  }
}
