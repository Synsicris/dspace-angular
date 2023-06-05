import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { ComparedVersionItemStatus } from '../../../core/project/project-version.service';
import { hasValue } from '../../../shared/empty.util';
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
    private renderer: Renderer2
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
  private getIconClassByStatus(): DirectiveAttributes {
    let attributes: DirectiveAttributes;
    if (this.status) {
      switch (this.status) {
        case ComparedVersionItemStatus.New:
          attributes = {
            classNames: ['far', 'fa-plus-square'],
            title: '(title) staus: New'
          };
          break;
        case ComparedVersionItemStatus.Changed:
          attributes = {
            classNames: ['fas', 'fa-redo-alt'],
            title: '(title) staus: Changed'
          };
          break;
        case ComparedVersionItemStatus.Done:
          attributes = {
            classNames: ['far', 'fa-check-circle'],
            title: '(title) staus: Done'
          };
          break;
        case ComparedVersionItemStatus.Canceled:
          attributes = {
            classNames: ['fas', 'fa-ban'],
            title: '(title) staus: Canceled'
          };
          break;
        case ComparedVersionItemStatus.Archieved:
          attributes = {
            classNames: ['fas', 'fa-check-circle'],
            title: '(title) staus: Archieved'
          };
          break;
        case ComparedVersionItemStatus.PartlyArchieved:
          attributes = {
            classNames: ['fas', 'fa-hourglass-half'],
            title: '(title) staus: PartlyArchieved'
          };
          break;
      }

      if (hasValue(attributes)) {
        attributes.classNames = attributes.classNames.concat('text-warning');
      }
    }
    return attributes;
  }
}