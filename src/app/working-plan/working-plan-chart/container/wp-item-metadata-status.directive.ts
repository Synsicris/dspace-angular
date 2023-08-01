import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { ComparedVersionItemStatus } from '../../../core/project/project-version.service';
import { hasValue } from '../../../shared/empty.util';
import { TranslateService } from '@ngx-translate/core';
import { DirectiveAttributes } from '../../../shared/utils/directive-attributes.interface';
import { addClassesAndTitle } from '../../../shared/utils/renderer-utils';

@Directive({
  selector: '[dsWPItemMetadataStatus]'
})
export class WpItemMetadataStatusDirective implements OnChanges {

  @Input() status: string;

  ComparedVersionItemStatus = ComparedVersionItemStatus;

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2,
    private translate: TranslateService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.status.isFirstChange() || (changes.status.previousValue !== changes.status.currentValue)) {
      addClassesAndTitle(this.renderer, this.elem, this.getIconClassByStatus());
    }
  }

  /**
   * Get the icon class and title for the item status
   * @returns DirectiveAttributes
   */

  /* deactivated the general class "text-warning" for all status-icons, 
  and for each status-icon instead created an individual status class for each status-icon, 
  so that the status-icons can optionally be designed differently. (rex 230726) */

  private getIconClassByStatus(): DirectiveAttributes {
    let attributes: DirectiveAttributes;
    if (this.status) {
      switch (this.status) {
        case ComparedVersionItemStatus.New:
          attributes = {
            classNames: ['far', 'fa-plus-square', 'status-icon-new'],
            //classNames: ['far', 'fa-star', 'status-icon-new'],
            title: this.translate.instant('working-plan.metadata-status.icon.title.status.new')
          };
          break;
        case ComparedVersionItemStatus.Changed:
          attributes = {
            classNames: ['fas', 'fa-redo-alt', 'status-icon-changed'],
            //classNames: ['fas', 'fa-circle-notch', 'status-icon-changed'],
            title: this.translate.instant('working-plan.metadata-status.icon.title.status.changed')
          };
          break;
        case ComparedVersionItemStatus.Done:
          attributes = {
            classNames: ['far', 'fa-check-circle', 'status-icon-done'],
            title: this.translate.instant('working-plan.metadata-status.icon.title.status.done')
          };
          break;
        case ComparedVersionItemStatus.Canceled:
          attributes = {
            classNames: ['fas', 'fa-ban', 'status-icon-canceled'],
            title: this.translate.instant('working-plan.metadata-status.icon.title.status.canceled')
          };
          break;
        case ComparedVersionItemStatus.Archieved:
          attributes = {
            classNames: ['far', 'fa-check-circle', 'status-icon-archieved'],
            title: this.translate.instant('working-plan.metadata-status.icon.title.status.archieved')
          };
          break;
        case ComparedVersionItemStatus.PartlyArchieved:
          attributes = {
            classNames: ['fas', 'fa-hourglass-half', 'status-icon-partlyarchieved'],
            title: this.translate.instant('working-plan.metadata-status.icon.title.status.partly-archieved')
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
