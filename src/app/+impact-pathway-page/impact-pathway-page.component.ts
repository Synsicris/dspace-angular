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

@Component({
  selector: 'ipw-dashboard-page',
  styleUrls: ['./impact-pathway-page.component.scss'],
  templateUrl: './impact-pathway-page.component.html'
})
export class ImpactPathwayPageComponent implements OnInit {

  /**
   * The item's id
   */
  id: number;

  /**
   * The item's id
   */
  itemId$: Observable<string>;

  constructor(
    private impactPathwayService: ImpactPathwayService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) { }

  /**
   * Initialize instance variables
   */
  ngOnInit(): void {
    this.itemId$ = this.route.data.pipe(
      map((data) => data.item as RemoteData<Item>),
      redirectToPageNotFoundOn404(this.router),
      filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && !itemRD.isResponsePending),
      take(1),
      flatMap((itemRD: RemoteData<Item>) => this.impactPathwayService.isImpactPathwayLoadedById(itemRD.payload.id).pipe(
        map((loaded) => [itemRD, loaded])
      )),
      tap(([itemRD, loaded]: [RemoteData<Item>, boolean]) => {
        if (!loaded) {
          this.store.dispatch(new InitImpactPathwayAction(itemRD.payload))
        }
      }),
      map(([itemRD, loaded]: [RemoteData<Item>, boolean]) => itemRD.payload.id)
    );
  }
}
