import { ItemDataService } from './../../core/data/item-data.service';
import { Metadata } from '../../core/shared/metadata.utils';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { Item } from 'src/app/core/shared/item.model';
import { combineAll, merge, mergeAll, tap } from 'rxjs/operators';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from 'src/app/core/shared/operators';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'ds-compare-item',
  templateUrl: './compare-item.component.html',
  styleUrls: ['./compare-item.component.scss']
})
export class CompareItemComponent implements OnInit {

  @Input() baseItemId: string;
  @Input() versioneditemId: string;

  items$: Observable<[Item, Item]>;
  baseItem$: Observable<Item>;
  versioneditem$: Observable<Item>;
  metadataKeys$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(undefined);
  // get metadata filtered configuration
  // metadata comparison

  constructor(private itemdataService: ItemDataService) { }

  ngOnInit(): void {

    this.baseItem$ = this.getSingleItemData(this.baseItemId);
    this.versioneditem$ = this.getSingleItemData(this.versioneditemId);
    this.items$ = this.getItemsData().pipe(
      tap(res => {
        console.log(res);
        this.getMetaDataKeys(res);
      })
    );
  }

  getItemsData(): Observable<[Item, Item]> {
    const t = combineLatest(
      this.baseItem$,
      this.versioneditem$,
    );
    return t;
  }

  getSingleItemData(itemId: string): Observable<Item> {
    return this.itemdataService.findById(itemId).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload()
    );
  }

  /**
   * Get the metadata list that will be compared
   * @param items the two items being compared
   */
  getMetaDataKeys(items: Item[]) {
    const metadatakeys = Object.assign(Object.keys(items[0].metadata), Object.keys(items[1].metadata));
    this.metadataKeys$.next(metadatakeys);
  }

  /**
   * Compare metadata values
   * @param baseItemMetadataValues base item metadata values
   * @param versionedItemMetadataValues versioned item metadata values
   */
  getClass(baseItemMetadataValues, versionedItemMetadataValues) {
    console.log(baseItemMetadataValues, versionedItemMetadataValues);
    return '';
  }

}
