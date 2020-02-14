import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, flatMap, map, take, tap } from 'rxjs/operators';

import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { redirectToPageNotFoundOn404 } from '../core/shared/operators';
import { ImpactPathwayService } from '../core/impact-pathway/impact-pathway.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { InitImpactPathwayAction } from '../core/impact-pathway/impact-pathway.actions';
import { ItemDataService } from '../core/data/item-data.service';
import { isNotEmpty } from '../shared/empty.util';

@Component({
  selector: 'ipw-objectives-page',
  styleUrls: ['./objectives-page.component.scss'],
  templateUrl: './objectives-page.component.html'
})
export class ObjectivesPageComponent implements OnInit {

  /**
   * The item's id
   */
  id: number;

  /**
   * The item's id
   */
  itemId$: Observable<string>;

  /**
   * The target item's id
   */
  targetItemId$: Observable<string>;

  constructor(
    private impactPathwayService: ImpactPathwayService,
    private itemService: ItemDataService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) { }

  /**
   * Initialize instance variables
   */
  ngOnInit(): void {
    this.targetItemId$ = this.route.queryParams.pipe(
      take(1),
      map((params) => params.target)
    );

    this.itemId$ = this.route.data.pipe(
      map((data) => data.item as RemoteData<Item>),
      redirectToPageNotFoundOn404(this.router),
      filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && !itemRD.isResponsePending),
      take(1),
      flatMap((itemRD: RemoteData<Item>) => {
        const parentId = itemRD.payload.firstMetadataValue('impactpathway.relation.parent');
        return this.itemService.findById(parentId).pipe(
          filter((parentItemRD: RemoteData<Item>) => parentItemRD.hasSucceeded && isNotEmpty(parentItemRD.payload)),
          take(1),
          map((parentItemRD: RemoteData<Item>) => [itemRD, parentItemRD])
        )
      }),
      flatMap(([itemRD, parentItemRD]: [RemoteData<Item>, RemoteData<Item>] ) => this.impactPathwayService.isImpactPathwayLoadedById(parentItemRD.payload.id).pipe(
        map((loaded) => [itemRD, parentItemRD, loaded])
      )),
      tap(([itemRD, parentItemRD, loaded]: [RemoteData<Item>, RemoteData<Item>, boolean]) => {
        if (!loaded) {
          this.store.dispatch(new InitImpactPathwayAction(parentItemRD.payload))
        }
      }),
      map(([itemRD, parentItemRD, loaded]: [RemoteData<Item>, RemoteData<Item>, boolean]) => itemRD.payload.id)
    );
  }
}