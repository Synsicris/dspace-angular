import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemDataService } from '../data/item-data.service';

import { RemoteData } from '../data/remote-data';
import { Item } from '../shared/item.model';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteData } from '../shared/operators';
import { ProjectVersionService } from './project-version.service';

/**
 * This class represents a resolver that requests a specific project boolean by item id before the route is activated
 */
@Injectable()
export class VersionOfAnItemResolver implements Resolve<Observable<boolean>> {

  routeParam = 'id';

  constructor(private itemDataService: ItemDataService, private projectVersion: ProjectVersionService) {
  }

  /**
   * Method for resolving a version based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<boolean> Emits if item is version of an item
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.itemDataService.findById(
      route.params[this.routeParam]
    ).pipe(
      getFirstCompletedRemoteData(),
      map((itemRd: RemoteData<Item>) => {
        if (itemRd.isError) {
          return false;
        }
        const item = itemRd.payload;
        return this.projectVersion.isVersionOfAnItem(item);
      })
    );
  }
}
