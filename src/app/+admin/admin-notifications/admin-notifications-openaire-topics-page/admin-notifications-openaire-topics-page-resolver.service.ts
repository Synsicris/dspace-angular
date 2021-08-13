import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

/**
 * Interface for the route parameters.
 */
export interface AdminNotificationsOpenaireTopicsPageParams {
  pageId?: string;
  pageSize?: number;
  currentPage?: number;
}

/**
 * This class represents a resolver that retrieve the route data before the route is activated.
 */
@Injectable()
export class AdminNotificationsOpenaireTopicsPageResolver implements Resolve<AdminNotificationsOpenaireTopicsPageParams> {

  /**
   * Method for resolving the parameters in the current route.
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns AdminNotificationsOpenaireTopicsPageParams Emits the route parameters
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): AdminNotificationsOpenaireTopicsPageParams {
    return {
      pageId: route.queryParams.pageId,
      pageSize: parseInt(route.queryParams.pageSize, 10),
      currentPage: parseInt(route.queryParams.page, 10)
    };
  }
}
