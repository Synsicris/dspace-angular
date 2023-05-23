import { AfterViewInit, Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[dsShowTitleForTruncatedText]'
})
export class ShowTitleForTruncatedTextDirective implements AfterViewInit {

  constructor(
    private elem: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    if (this.isTextTruncated) {
      // Set the title attribute to the text of the element
      this.renderer.setAttribute(this.elem.nativeElement, 'title', this.elem.nativeElement.innerText);
    }
  }

  /**
   * Check if the text of the element is truncated
   * @readonly
   * @type {boolean}
   */
  get isTextTruncated(): boolean {
    return this.elem.nativeElement.offsetWidth < this.elem.nativeElement.scrollWidth;
  }
}
