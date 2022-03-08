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

  /**
   * Base item Id to compare with
   * @type {String}
   */
  @Input() baseItemId: string;

  /**
   * Versioned item id to compare
   * @type {String}
   */
  @Input() versioneditemId: string;

  /**
   * Items that will be compared
   * @type {Observable<[Item, Item]>}
   */
  items$: Observable<[Item, Item]>;

  /**
   * Metadata key list that will be compared
   * @type {BehaviorSubject<string[]>}
   */
  metadataKeys$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(undefined);

  constructor(private itemdataService: ItemDataService) { }

  /**
   * Initialize component by recieving the two items from api and creating the metadataKey list
   */
  ngOnInit(): void {
    this.items$ = this.getItemsData().pipe(
      tap((items: [Item, Item]) => {
        this.getMetaDataKeys(items);
      })
    );
  }

  /**
   * Combine both requests of items
   */
  getItemsData(): Observable<[Item, Item]> {
    const t = combineLatest(
      this.getSingleItemData(this.baseItemId),
      this.getSingleItemData(this.versioneditemId),
    );
    return t;
  }

  /**
   * Construct the items api request
   * @param itemId id of the item
   */
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
    if (baseItemMetadataValues.length > versionedItemMetadataValues.length) {
      return 'table-success';
    } else if (baseItemMetadataValues.length < versionedItemMetadataValues.length) {
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
