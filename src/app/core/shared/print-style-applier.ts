import isEqual from 'lodash/isEqual';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { hasValue } from '../../shared/empty.util';
import { DOCUMENT } from '@angular/common';

/**
 * This class is used to add a class to the body tag when the user is in print mode.
 * Print mode is activated by adding the query parameter 'view=print' to the url.
 */
@Injectable()
export class PrintStyleApplier implements CanActivate {

  constructor(@Inject(DOCUMENT) private _document: Document) {
  }
  canActivate(route: ActivatedRouteSnapshot): boolean {

    let elements;
    if (hasValue(route.queryParams.view)) {
      elements = this._document.getElementsByTagName('body');
      if (elements && elements[0]) {
        if (isEqual(route.queryParams.view, 'print')) {
          elements[0].classList.add('print-mode');
        } else {
          elements[0].classList.remove('print-mode');
        }
      }
    }

    return true;
  }
}
