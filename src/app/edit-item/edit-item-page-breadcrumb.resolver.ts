import { DSOBreadcrumbResolver } from '../core/breadcrumbs/dso-breadcrumb.resolver';
import { Item } from '../core/shared/item.model';
import { FollowLinkConfig } from '../shared/utils/follow-link-config.model';
import { Injectable } from '@angular/core';
import { ItemDataService } from '../core/data/item-data.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BreadcrumbConfig } from '../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { EditItemPageBreadcrumbService } from './edit-item-page-breadcrumb.service';

@Injectable()
export class EditItemPageBreadcrumbResolver extends DSOBreadcrumbResolver<Item> {

  constructor(protected breadcrumbService: EditItemPageBreadcrumbService, protected dataService: ItemDataService) {
    super(breadcrumbService, dataService);
  }

  get followLinks(): FollowLinkConfig<Item>[] {
    return [];
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BreadcrumbConfig<Item>> {
    let uuid: string = route.params.id;
    const permissionIdx = uuid.indexOf(':');
    if (permissionIdx > 0) {
      uuid = uuid.substr(0, permissionIdx);
    }
    return this.resolveByUUID(uuid, state.url);
  }

}
