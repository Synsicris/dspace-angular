import { isEqual } from 'lodash';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { hasValue } from '../../shared/empty.util';

/**
 * This class is used to add a class to the body tag when the user is in print mode.
 * Print mode is activated by adding the query parameter 'view=print' to the url.
 */
@Injectable()
export class PrintStyleApplier implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot): boolean {

    if (hasValue(route.queryParams.view) && isEqual(route.queryParams.view, 'print')) {
      document.getElementsByTagName('body')[0].classList.add('print-mode');
    } else {
      document.getElementsByTagName('body')[0].classList.remove('print-mode');
    }

    return true;
  }
}
