import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import { redirectOn4xx } from '../../core/shared/authorized.operators';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { ImpactPathwayService } from '../../impact-pathway-board/core/impact-pathway.service';
import { AppState } from '../../app.reducer';
import { InitImpactPathwayAction } from '../../impact-pathway-board/core/impact-pathway.actions';
import { ItemDataService } from '../../core/data/item-data.service';
import { hasValue } from '../../shared/empty.util';
import { Community } from '../../core/shared/community.model';
import { AuthService } from '../../core/auth/auth.service';
import { PrintViewService } from '../../shared/print-view/print-view.service';

@Component({
  selector: 'ds-objectives-page',
  styleUrls: ['./objectives-page.component.scss'],
  templateUrl: './objectives-page.component.html'
})
export class ObjectivesPageComponent implements OnInit, OnDestroy {

  /**
   * The item's id
   */
  id: number;

  /**
   * The impact-pathway item
   */
  objectivesItem: Item;

  initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * If the current user is a funder Organizational/Project manager
   */
  hasAnyFunderRole: boolean;

  /**
   * If the current user is an administrator
   */
  isAdmin: boolean;

  /**
   * If the current user is a funder Organizational/Project manager
   */
  isFunderProject: boolean;

  /**
   * The project community's id
   */
  projectCommunityId: string;

  /**
   * Subscription to unsubscribe
   */
  private sub: Subscription;

  /**
   * Used to know if the page is loaded
   */
  loadedPage: BehaviorSubject<boolean>;


  constructor(
    private authService: AuthService,
    private impactPathwayService: ImpactPathwayService,
    private itemService: ItemDataService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private printService: PrintViewService,
  ) {
    this.loadedPage = this.printService.loadedPage;
  }

  /**
   * Initialize instance variables
   */
  ngOnInit(): void {
    const hasAnyFunderRole$ = this.route.data.pipe(
      map((data) => (data.isFunderOrganizationalManger || data.isFunderProject || data.isFunderReader) as boolean)
    );

    const isAdmin$ = this.route.data.pipe(
      map((data) => data.isAdmin as boolean)
    );

    const isFunderProject$ = this.route.data.pipe(
      map((data) => (data.isFunderProject) as boolean)
    );

    const targetItemId$ = this.route.queryParams.pipe(
      take(1),
      map((params) => params.target)
    );

    const impactPathwayItem$ = this.route.data.pipe(
      take(1),
      map((data) => data.impactPathwayItem as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload()
    );

    const objectivesItemFromRoute$ = this.route.data.pipe(
      take(1),
      map((data) => data.objectivesItem as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload()
    );

    const objectivesItem$ = combineLatest([
      impactPathwayItem$,
      objectivesItemFromRoute$,
      targetItemId$
    ]).pipe(
      mergeMap(([impactPathwayItem, objectivesItem, targetItemId]: [Item, Item, string]) => this.impactPathwayService.isImpactPathwayLoadedById(impactPathwayItem.id).pipe(
        map((loaded) => [impactPathwayItem, objectivesItem, targetItemId, loaded])
      )),
      tap(([impactPathwayItem, objectivesItem, targetItemId, loaded]: [Item, Item, string, boolean]) => {
        if (!loaded) {
          this.store.dispatch(new InitImpactPathwayAction(impactPathwayItem, true));
        }
        this.impactPathwayService.dispatchSetTargetTask(targetItemId);
      }),
      map(([impactPathwayItem, objectivesItem, targetItemId, loaded]: [Item, Item, string, boolean]) => objectivesItem)
    );

    const projectCommunityId$ = this.route.data.pipe(
      take(1),
      map((data) => data.projectCommunity as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload(),
      map((project: Community) => project.id)
    );

    combineLatest([projectCommunityId$, objectivesItem$, hasAnyFunderRole$, isFunderProject$, isAdmin$])
      .pipe(take(1)
      ).subscribe(([projectCommunityId, objectivesItem, hasAnyFunderRole, isFunderProject, isAdmin]) => {

      this.projectCommunityId = projectCommunityId;
      this.objectivesItem = objectivesItem;
      this.hasAnyFunderRole = hasAnyFunderRole;
      this.isFunderProject = isFunderProject;
      this.isAdmin = isAdmin;
      this.initialized.next(true);
    });

    // preparing the view for printing (screenshots for report)
    this.printService.preparePrintView('objectives');
  }

  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

}
