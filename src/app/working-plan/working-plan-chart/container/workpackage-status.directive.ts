// DropDown for status in the Working Plan middle column (rex 230727) 

import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

import { WorkpackageStatusType } from '../../core/models/workpackage-status-type';

@Directive({
  selector: '[dsWorkpackageStatusIcon]'
})
export class WorkpackageStatusDirective implements OnChanges {

  @Input() status: string;

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.status.isFirstChange() || (changes.status.previousValue !== changes.status.currentValue)) {
      this.getIconClassByType().forEach((className: string) => {
        this.renderer.addClass(this.elem.nativeElement, className);
      });
    }
  }

  /* deactivated the general class "text-warning" for all status-icons, 
  and for each status-icon instead created an individual status class for each status-icon, 
  so that the status-icons can optionally be designed differently. (rex 230726) */

  //display of the status icon in the dropdown deactivated (rex, meeting result from 27.7.2023)
  private getIconClassByType(): string[] {
    let iconClasses = [];
    if (this.status) {
      switch (this.status) {
        /*
        case WorkpackageStatusType.done:
          //iconClasses = ['fas', 'fa-check', 'text-success'];
          iconClasses = ['fas', 'fa-check', 'status-icon-done'];
          break;
        case WorkpackageStatusType.additional:                  // no icon appears! "additional" instead of "new"
          //iconClasses = ['fas', 'fa-plus', 'text-success'];
          iconClasses = ['fas', 'fa-plus', 'status-icon-new'];
          break;
        case WorkpackageStatusType.overdue:                     // no icon appears! "overdue" instead of "canceled"
          //iconClasses = ['fas', 'fa-arrow-right', 'text-danger'];
          iconClasses = ['fas', 'fa-arrow-right', 'status-icon-canceled'];
          break;
        case WorkpackageStatusType.changed:
          //iconClasses = ['fas', 'fa-redo-alt', 'text-warning'];
          iconClasses = ['fas', 'fa-redo-alt', 'status-icon-changed'];
          break;

        // no icon appears! "removed" instead of what? Difference between canceled and removed? provisionally assigned the same color as for canceled
        case WorkpackageStatusType.removed:                     
          //iconClasses = ['fas', 'fa-trash-alt', 'text-black-50'];
          iconClasses = ['fas', 'fa-trash-alt', 'status-icon-canceled'];
          break;
          */
      }
    }
    return iconClasses;
  }
  

}
