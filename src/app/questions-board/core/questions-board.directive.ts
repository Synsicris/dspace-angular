import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

import { QuestionsBoardType } from './models/questions-board-type';

@Directive({
  selector: '[dsQuestionsBoardIcon]'
})
export class QuestionsBoardDirective {

  @Input() questionsBoardType: QuestionsBoardType|string;

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngAfterViewInit(): void {
    this.getIconClassByType().forEach((className: string) => {
      this.renderer.addClass(this.elem.nativeElement, className);
    });
  }

  /* removed the colored icons for the exploitation plan */

  private getIconClassByType(): string[] {
    let iconClasses: string[];
    switch (this.questionsBoardType) {
      case QuestionsBoardType.Question1:
        //iconClasses = ['far', 'fa-copyright', 'text-danger'];
        break;
      case QuestionsBoardType.Question2:
        //iconClasses = ['fas', 'fa-users', 'text-success'];
        break;
      case QuestionsBoardType.Question3:
       //iconClasses = ['fas', 'fa-book', 'text-warning'];
        break;
      case QuestionsBoardType.Question4:
        //iconClasses = ['fas', 'fa-cube', 'text-primary'];
        break;
      default:
        iconClasses = [];
    }
    return iconClasses;
  }

}
