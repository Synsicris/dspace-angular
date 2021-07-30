import { Component, Input } from '@angular/core';
import { EasyOnlineImport } from '../../core/easy-online-import/models/easy-online-import.model';
import { from, Observable } from 'rxjs';
import { ItemDataService } from '../../core/data/item-data.service';
import { Router } from '@angular/router';
import { Item } from '../../core/shared/item.model';
import { concatMap, filter, map, reduce, take, tap } from 'rxjs/operators';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { isNotEmpty } from '../../shared/empty.util';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { getItemPageRoute } from '../../+item-page/item-page-routing-paths';

@Component({
  selector: 'ds-easy-online-import-result',
  templateUrl: './easy-online-import-result.component.html',
  styleUrls: ['./easy-online-import-result.component.scss']
})
export class EasyOnlineImportResultComponent {

  @Input() result: EasyOnlineImport = null;

  constructor(public nameService: DSONameService,private itemService: ItemDataService, private router: Router) { }

  getItemList(list: string[]): Observable<Item[]> {
    return from(list).pipe(
      concatMap((uuid) => this.itemService.findById(uuid).pipe(
        tap((i) => console.log(i)),
        getFirstCompletedRemoteData(),
        tap((i) => console.log(i)),
        map((itemRD: RemoteData<Item>) => itemRD.hasSucceeded ? itemRD.payload : null),
        filter((item) => isNotEmpty(item))
      )),
      reduce((acc: any, value: any) => [...acc, value], []),
      take(1)
    );
  }

  navigateToItem(item: Item) {
    this.router.navigateByUrl(getItemPageRoute(item));
  }
}
