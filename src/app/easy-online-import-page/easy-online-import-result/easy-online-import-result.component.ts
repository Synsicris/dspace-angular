import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EasyOnlineImport } from '../../core/easy-online-import/models/easy-online-import.model';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { ItemDataService } from '../../core/data/item-data.service';
import { Router } from '@angular/router';
import { Item } from '../../core/shared/item.model';
import { concatMap, filter, map, reduce, take } from 'rxjs/operators';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { isNotEmpty } from '../../shared/empty.util';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { getItemPageRoute } from '../../item-page/item-page-routing-paths';
import { SearchResult } from '../../shared/search/search-result.model';
import { CollectionElementLinkType } from '../../shared/object-collection/collection-element-link.type';

@Component({
  selector: 'ds-easy-online-import-result',
  templateUrl: './easy-online-import-result.component.html',
  styleUrls: ['./easy-online-import-result.component.scss']
})
export class EasyOnlineImportResultComponent implements OnChanges {

  @Input() result: EasyOnlineImport = null;

  createdItemList: BehaviorSubject<SearchResult<Item>[]> = new BehaviorSubject<SearchResult<Item>[]>([]);
  modifiedItemList: BehaviorSubject<SearchResult<Item>[]> = new BehaviorSubject<SearchResult<Item>[]>([]);
  linkType = CollectionElementLinkType.ExternalLink;

  constructor(public nameService: DSONameService,private itemService: ItemDataService, private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.result.currentValue) {
      this.getItemList(this.result.created).subscribe((list) => this.createdItemList.next(list));
      this.getItemList(this.result.modified).subscribe((list) => this.modifiedItemList.next(list));
    }
  }

  getItemList(list: string[]): Observable<SearchResult<Item>[]> {
    return from(list).pipe(
      concatMap((uuid) => this.itemService.findById(uuid).pipe(
        getFirstCompletedRemoteData(),
        map((itemRD: RemoteData<Item>) => itemRD.hasSucceeded ? itemRD.payload : null),
        filter((item) => isNotEmpty(item)),
        map((item) => Object.assign(new SearchResult(), {indexableObject: item}))
      )),
      reduce((acc: any, value: any) => [...acc, value], []),
      take(1)
    );
  }

  getItemPageRoute(item: Item): string {
    return getItemPageRoute(item);
  }

  /**
   * Prevent unnecessary rerendering
   */
  trackUpdate(index, value: SearchResult<Item>) {
    return value ? value.indexableObject._links.self.href : undefined;
  }
}
