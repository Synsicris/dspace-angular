import { isEqual } from 'lodash';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { hasValue } from '../../shared/empty.util';

/**
 * Load the print.css file when the user navigates to a page with the view=print query parameter
 */
@Injectable()
export class PrintStyleApplier implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot): boolean {

    if (hasValue(route.queryParams.view) && isEqual(route.queryParams.view, 'print')) {
      this.loadPrintCSS();
    }

    return true;
  }

  /**
   * Append the print.css file to the head of the document
   */
  loadPrintCSS() {
    let fileRef;
    fileRef = document.createElement('link');
    fileRef.setAttribute('rel', 'stylesheet');
    fileRef.setAttribute('type', 'text/css');
    fileRef.setAttribute('href', '/assets/styles/print.css');
    if (typeof fileRef !== 'undefined') {
      document.getElementsByTagName('head')[0].appendChild(fileRef);
    }
  }
}
