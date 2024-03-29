import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RemoteData } from '../../data/remote-data';
import { ItemDataService } from '../../data/item-data.service';
import { Item } from '../../shared/item.model';
import { followLink, FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { getFirstCompletedRemoteData } from '../../shared/operators';
import { Store } from '@ngrx/store';
import { ResolvedAction } from '../../resolving/resolver.actions';

/**
 * The self links defined in this list are expected to be requested somewhere in the near future
 * Requesting them as embeds will limit the number of requests
 */
export const ITEM_PAGE_LINKS_TO_FOLLOW: FollowLinkConfig<Item>[] = [
  followLink('owningCollection', {},
    followLink('parentCommunity', {},
      followLink('parentCommunity'))
  ),
  followLink('bundles', {}, followLink('bitstreams')),
  followLink('relationships'),
  followLink('version', {}, followLink('versionhistory')),
  followLink('metrics')
];

/**
 * This class represents a resolver that requests a specific item before the route is activated
 */
@Injectable()
export class ProjectItemPageResolver implements Resolve<RemoteData<Item>> {

  routeParam = 'id';

  constructor(
    private itemService: ItemDataService,
    private store: Store<any>
  ) {
  }

  /**
   * Method for resolving an item based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Item>> {
    const itemRD$ = this.itemService.findById(route.params[this.routeParam],
      true,
      false,
      ...ITEM_PAGE_LINKS_TO_FOLLOW
    ).pipe(
      getFirstCompletedRemoteData()
    );

    itemRD$.subscribe((itemRD: RemoteData<Item>) => {
      this.store.dispatch(new ResolvedAction(state.url, itemRD.payload));
    });

    return itemRD$;
  }
}
