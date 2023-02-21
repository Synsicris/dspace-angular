import { DSOPropertyBreadcrumbResolver } from '../core/breadcrumbs/dso-property-breadcrumb-resolver.service';
import { WorkspaceItem } from '../core/submission/models/workspaceitem.model';
import { Injectable } from '@angular/core';
import { followLink, FollowLinkConfig } from '../shared/utils/follow-link-config.model';
import { ItemDataService } from '../core/data/item-data.service';
import { WorkspaceitemDataService } from '../core/submission/workspaceitem-data.service';
import { isObservable, Observable, of } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { map, take } from 'rxjs/operators';
import { WorkspaceItemsEditPageBreadcumbService } from './workspace-items-edit-page-breadcumb.service';

@Injectable()
export class WorkspaceItemsEditPageBreadrumbResolver extends DSOPropertyBreadcrumbResolver<any, WorkspaceItem> {

  constructor(
    protected breadcrumbService: WorkspaceItemsEditPageBreadcumbService,
    protected dataService: ItemDataService,
    protected dataServiceT: WorkspaceitemDataService
  ) {
    super(breadcrumbService, dataService, dataServiceT);
  }

  get followLinks(): FollowLinkConfig<any>[] {
    return [];
  }

  get followDSOLinks(): FollowLinkConfig<WorkspaceItem>[] {
    return [followLink('item')];
  }

  mapProperty(dso: WorkspaceItem): Observable<any> {
    if (isObservable(dso?.item)) {
      return (dso.item as Observable<RemoteData<Item>>)
        .pipe(
          map(rd => rd.payload),
          take(1)
        );
    }
    return of(dso?.item);
  }

}
