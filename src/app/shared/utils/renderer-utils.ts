import { ElementRef, Renderer2 } from '@angular/core';
import { DirectiveAttributes } from './directive-attributes.interface';
import { hasNoValue } from '../empty.util';

export function addClasses(renderer: Renderer2, elem: ElementRef, classNames: string[]) {
  classNames.forEach((className: string) => {
    renderer.addClass(elem.nativeElement, className);
  });
}

export function addTitle(renderer: Renderer2, elem: ElementRef, title: string) {
  renderer.setAttribute(elem.nativeElement, 'title', title);
}

export function addClassesAndTitle(renderer: Renderer2, elem: ElementRef, attributes: DirectiveAttributes) {
  if (hasNoValue(attributes)) {
    return;
  }
  addClasses(renderer, elem, attributes.classNames);
  addTitle(renderer, elem, attributes.title);
}
