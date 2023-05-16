import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { ComparedVersionItemStatus } from '../../../core/project/project-version.service';
import { hasValue } from '../../../shared/empty.util';


@Directive({
  selector: '[dsQBItemMetadataStatus]'
})
export class QbItemMetadataStatusDirective implements OnChanges  {

  /**
   * The status of the item
   */
  @Input() status: string;

  /**
   * The type of the entity (exploitationplan or interimreport)
   */
  @Input() entityType: string;

  ComparedVersionItemStatus = ComparedVersionItemStatus;

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.status.isFirstChange() || (changes.status.previousValue !== changes.status.currentValue)) {
      const attributes = this.entityType.includes('exploitationplan') ? this.getIconClassByStatusForEP() : this.getIconClassByStatusForIR();
      if (hasValue(attributes)) {
        attributes.classNames.forEach((className: string) => {
          this.renderer.addClass(this.elem.nativeElement, className);
        });
        this.renderer.setAttribute(this.elem.nativeElement, 'title', attributes.title);
      }
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
            classNames: ['far', 'fa-plus-square'],
            title: '(title)EP staus: New'
          };
          break;
        case ComparedVersionItemStatus.Changed:
          attributes = {
            classNames: ['fas', 'fa-redo-alt'],
            title: '(title)EP staus: Changed'
          };
          break;
        case ComparedVersionItemStatus.Done:
          attributes = {
            classNames: ['far', 'fa-check-circle'],
            title: '(title)EP staus: Done'
          };
          break;
        case ComparedVersionItemStatus.Canceled:
          attributes = {
            classNames: ['fas', 'fa-ban'],
            title: '(title)EP staus: Canceled'
          };
          break;
        case ComparedVersionItemStatus.Archieved:
          attributes = {
            classNames: ['fas', 'fa-check-circle'],
            title: '(title)EP staus: Archieved'
          };
          break;
        case ComparedVersionItemStatus.PartlyArchieved:
          attributes = {
            classNames: ['fas', 'fa-hourglass-half'],
            title: '(title)EP staus: PartlyArchieved'
          };
          break;
      }

      if (hasValue(attributes)) {
        attributes.classNames = attributes.classNames.concat('text-warning');
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
            classNames: ['far', 'fa-plus-square'],
            title: '(title)IR staus: New'
          };
          break;
        case ComparedVersionItemStatus.Changed:
          attributes = {
            classNames: ['fas', 'fa-redo-alt'],
            title: '(title)IR staus: Changed'
          };
          break;
        case ComparedVersionItemStatus.Done:
          attributes = {
            classNames: ['far', 'fa-check-circle'],
            title: '(title)IR staus: Done'
          };
          break;
        case ComparedVersionItemStatus.Canceled:
          attributes = {
            classNames: ['fas', 'fa-ban'],
            title: '(title)IR staus: Canceled'
          };
          break;
        case ComparedVersionItemStatus.Archieved:
          attributes = {
            classNames: ['fas', 'fa-check-circle'],
            title: '(title)IR staus: Archieved'
          };
          break;
        case ComparedVersionItemStatus.PartlyArchieved:
          attributes = {
            classNames: ['fas', 'fa-hourglass-half'],
            title: '(title)IR staus: PartlyArchieved'
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

export interface DirectiveAttributes {
  classNames: string[];
  title: string;
}
