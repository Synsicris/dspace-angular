import { ItemDataService } from './../../core/data/item-data.service';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { Item } from 'src/app/core/shared/item.model';
import { tap } from 'rxjs/operators';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from 'src/app/core/shared/operators';
import { combineLatest } from 'rxjs';
import { environment } from '../../../environments/environment';

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
    const excludedMetadata = !!environment.projects.excludeComparisonMetadata ? environment.projects.excludeComparisonMetadata : [];
    let metadatakeys = Object.keys(items[0].metadata).concat(Object.keys(items[1].metadata));
    metadatakeys = metadatakeys.filter((metadata) => excludedMetadata.indexOf(metadata) === -1);
    this.metadataKeys$.next(metadatakeys);
  }

  /**
   * Compare metadata values
   * @param baseItemMetadataValues base item metadata values
   * @param versionedItemMetadataValues versioned item metadata values
   */
  getClass(baseItemMetadataValues, versionedItemMetadataValues) {
    if (baseItemMetadataValues.length < versionedItemMetadataValues.length) {
      return 'table-success';
    } else if (baseItemMetadataValues.length > versionedItemMetadataValues.length) {
      return 'table-danger';
    } else {
      let cssClass = '';
      baseItemMetadataValues.forEach((el) => {
        if (versionedItemMetadataValues.indexOf(el) === -1) {
          cssClass = 'table-warning';
        }
      });
      return cssClass;
    }
  }

}
