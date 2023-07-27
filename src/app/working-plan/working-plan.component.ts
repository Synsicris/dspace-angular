import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, fromEvent, Observable, OperatorFunction, Subscription } from 'rxjs';
import { delay, filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import isEqual from 'lodash/isEqual';

import { environment } from '../../environments/environment';
import { Workpackage } from './core/models/workpackage-step.model';
import { WorkingPlanStateService } from './core/working-plan-state.service';
import { CollectionDataService } from '../core/data/collection-data.service';
import { FindListOptions } from '../core/data/find-list-options.model';
import { RemoteData } from '../core/data/remote-data';
import { PaginatedList } from '../core/data/paginated-list.model';
import { Collection } from '../core/shared/collection.model';
import { getFirstSucceededRemoteWithNotEmptyData } from '../core/shared/operators';
import { hasValue, isEmpty, isNotEmpty } from '../shared/empty.util';
import { Item } from '../core/shared/item.model';
import { ProjectVersionService } from '../core/project/project-version.service';
import { NativeWindowRef, NativeWindowService } from '../core/services/window.service';
import { WorkingPlanService } from './core/working-plan.service';

@Component({
  selector: 'ds-working-plan',
  templateUrl: './working-plan.component.html',
  styleUrls: ['./working-plan.component.scss'],
})
export class WorkingPlanComponent implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy {

  /**
   * If the current user is a funder Organizational/Project manager
   */
  @Input() hasAnyFunderRole: boolean;

  /**
   * If the current user is a funder project manager
   */
  @Input() isAdmin: boolean;

  /**
   * If the current user is a funder project manager
   */
  @Input() isFunderProject: boolean;

  /**
   * If the working-plan given is a version item
   */
  @Input() isVersionOf: boolean;

  /**
   * The project community's id
   */
  @Input() public projectCommunityId: string;

  /**
   * The working Plan item
   */
  @Input() workingPlan: Item;

  /**
   * A boolean representing if compare mode is active
   */
  compareMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isPrinting$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loadedPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  workPackageCollectionId: string;

  milestoneCollectionId: string;

  private subs: Subscription[] = [];

  constructor(
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
    private cdr: ChangeDetectorRef,
    private collectionDataService: CollectionDataService,
    private projectVersionService: ProjectVersionService,
    private workingPlanService: WorkingPlanService,
    private workingPlanStateService: WorkingPlanStateService,
    private router: Router,
    private aroute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.workingPlanService.isAdmin = this.isAdmin;
    this.retrieveCollections();

    this.subs.push(
      this.workingPlanStateService.isCompareModeActive()
        .subscribe((compareMode: boolean) => this.compareMode.next(compareMode))
    );

    const params$ =
      this.aroute.queryParams
        .pipe(
          filter(params => isNotEmpty(params))
        );

    this.subs.push(
      this.isPrinting$
        .pipe(
          filter(isPrinting => isPrinting === true),
          this.reloadPage(),
        )
        .subscribe(() => this._window.nativeWindow.print())
    );

    this.subs.push(
      fromEvent(this._window.nativeWindow, 'beforeprint')
        .subscribe((event: Event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.onPrint();
        }),
      fromEvent(this._window.nativeWindow, 'afterprint')
        .pipe(
          delay(100),
          withLatestFrom(this.isPrinting$),
          filter(([, isPrinting]) => isPrinting === true),
          switchMap(() => fromPromise(this.router.navigate([], { queryParams: { view: 'default' } }))),
          this.reloadPage(),
        ).subscribe(() => this.isPrinting$.next(false))
    );

    this.subs.push(
      params$
        .pipe(
          map(params => params?.print),
          filter(printParam => isEqual(printParam, 'true') && this._window.nativeWindow)
        )
        .subscribe(() => this.isPrinting$.next(true))
    );
  }

  ngAfterViewInit(): void {
    this.workingPlanStateService.isWorkingPlanLoaded().pipe(
      take(1)
    ).subscribe(() => {
      this.workingPlanStateService.dispatchRetrieveAllWorkpackages(this.projectCommunityId, this.workingPlan, environment.workingPlan.workingPlanPlaceMetadata, this.isVersionOf);
    });
  }

  ngAfterContentChecked() {
    if (this._window.nativeWindow) {
      this.cdr.detectChanges();
      this.loadedPage.next(true);
    }
  }

  public getWorkpackages(): Observable<Workpackage[]> {
    return this.workingPlanStateService.getWorkpackages();
  }

  public isLoading(): Observable<boolean> {
    return this.workingPlanStateService.isLoading().pipe(
      map((loading) => loading && (isEmpty(this.workPackageCollectionId) || isEmpty(this.milestoneCollectionId))),
    );
  }

  onPrint() {
    this.router.navigate([], { queryParams: { view: 'print', print: true } });
  }

  reloadPage(): OperatorFunction<any, any> {
    return source =>
      source.pipe(
        tap(() => this.loadedPage.next(false)),
        delay(1),
        tap(() => this.loadedPage.next(true)),
        delay(1),
      );
  }

  ngOnDestroy(): void {
    this.workingPlanStateService.dispatchCleanState();
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  private retrieveCollections(): void {
    const findOptions: FindListOptions = {
      elementsPerPage: 10,
      currentPage: 1
    };
    const wpCollId$: Observable<Collection> = this.collectionDataService
      .getAuthorizedCollectionByCommunityAndEntityType(
        this.projectCommunityId,
        environment.workingPlan.workpackageEntityName,
        findOptions,
        true).pipe(
          getFirstSucceededRemoteWithNotEmptyData(),
          map((collections: RemoteData<PaginatedList<Collection>>) => {
            return collections.payload.page[0];
          })
        );
    const mlCollId$ = this.collectionDataService
      .getAuthorizedCollectionByCommunityAndEntityType(
        this.projectCommunityId,
        environment.workingPlan.milestoneEntityName,
        findOptions,
        true).pipe(
          getFirstSucceededRemoteWithNotEmptyData(),
          map((collections: RemoteData<PaginatedList<Collection>>) => {
            return collections.payload.page[0];
          })
        );
    combineLatest([wpCollId$, mlCollId$]).subscribe(([wpColl, mlColl]) => {
      this.workPackageCollectionId = wpColl.id;
      this.milestoneCollectionId = mlColl.id;
    });
  }
}
