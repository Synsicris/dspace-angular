import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { differenceWith, unionWith } from 'lodash';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ItemDataService } from '../../core/data/item-data.service';
import { Item } from '../../core/shared/item.model';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../../core/shared/operators';
import { environment } from '../../../environments/environment';
import { MetadataValue } from '../../core/shared/metadata.models';
import { _isMetadataEqualComparator } from './compare-item.util';

@Component({
  selector: 'ds-compare-item',
  templateUrl: './compare-item.component.html',
  styleUrls: ['./compare-item.component.scss']
})
export class CompareItemComponent implements OnInit {

  /**
   * The base item for comparison
   */
  @Input() baseItemId: string;

  /**
   * The versioned item to compare
   */
  @Input() versionedItemId: string;

  /**
   * The items to compare
   */
  public items$: Observable<[Item, Item]>;

  /**
   * The list of metadata to show in the comparison
   */
  public metadataKeys$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(undefined);

  /**
   * The base item
   */
  protected baseItem$: Observable<Item>;

  /**
   * The versioned item
   */
  protected versionedItem$: Observable<Item>;

  /**
   * The list of metadata added in the base item
   */
  protected metadataAddedList$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(undefined);

  /**
   * The list of metadata removed in the base item
   */
  protected metadataRemovedList$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(undefined);

  constructor(public activeModal: NgbActiveModal, private itemService: ItemDataService) {
  }

  /**
   * Initialize component by recieving the two items from api and creating the metadataKey list
   */
  ngOnInit(): void {
    this.baseItem$ = this.getSingleItemData(this.baseItemId);
    this.versionedItem$ = this.getSingleItemData(this.versionedItemId);
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
    return combineLatest([
      this.baseItem$,
      this.versionedItem$
    ]);
  }

  /**
   * Construct the items api request
   * @param itemId id of the item
   */
  getSingleItemData(itemId: string): Observable<Item> {
    return this.itemService.findById(itemId).pipe(
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
    const baseItemMetadataList = Object.keys(items[0].metadata).filter((metadata) => excludedMetadata.indexOf(metadata) === -1);
    const versionedItemMetadataList = Object.keys(items[1].metadata).filter((metadata) => excludedMetadata.indexOf(metadata) === -1);

    const metadataAddedList = differenceWith(baseItemMetadataList, versionedItemMetadataList);
    const metadataRemovedList = differenceWith(versionedItemMetadataList, baseItemMetadataList);
    const unionList = unionWith(baseItemMetadataList, versionedItemMetadataList);

    this.metadataKeys$.next(unionList);
    this.metadataAddedList$.next(metadataAddedList);
    this.metadataRemovedList$.next(metadataRemovedList);
  }

  /**
   * Return the row style based on metadata comparison
   *
   * @param metadataName                 The current metadata to show
   * @param baseItemMetadataValues      The base item metadata values
   * @param versionedItemMetadataValues The versioned item metadata values
   */
  getClass(metadataName: string, baseItemMetadataValues: MetadataValue[], versionedItemMetadataValues: MetadataValue[]): string {
    console.log(metadataName);
    if (this.metadataAddedList$.value.includes(metadataName)) {
      return 'table-success';
    }

    if (this.metadataRemovedList$.value.includes(metadataName)) {
      return 'table-danger';
    }

    if (baseItemMetadataValues.length !== versionedItemMetadataValues.length) {
      return 'table-warning';
    }

    const differenceList = differenceWith(baseItemMetadataValues, versionedItemMetadataValues, _isMetadataEqualComparator);
    if (differenceList.length > 0) {
      return 'table-warning';
    }
  }

}
