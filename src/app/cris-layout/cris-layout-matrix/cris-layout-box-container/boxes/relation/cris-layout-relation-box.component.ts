import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { TranslateService } from '@ngx-translate/core';
import { CrisLayoutBox, RelationBoxConfiguration } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';
import { BehaviorSubject, forkJoin, Observable, Subscription } from 'rxjs';
import { Community } from '../../../../../core/shared/community.model';
import { ActivatedRoute } from '@angular/router';
import { RemoteData } from '../../../../../core/data/remote-data';
import { filter, map, take } from 'rxjs/operators';
import { hasValue } from '../../../../../shared/empty.util';

@Component({
  selector: 'ds-cris-layout-search-box',
  templateUrl: './cris-layout-relation-box.component.html',
  styleUrls: ['./cris-layout-relation-box.component.scss']
})
@RenderCrisLayoutBoxFor(LayoutBox.RELATION)
export class CrisLayoutRelationBoxComponent extends CrisLayoutBoxModelComponent implements OnInit, OnDestroy {

  /**
   * Filter used for set scope in discovery invocation
   */
  searchFilter: string;
  /**
   * Name of configuration for this box
   */
  configuration: string;
  /**
   * flag for enable/disable search bar
   */
  searchEnabled = false;
  /**
   * The width of the sidebar (bootstrap columns)
   */
  sideBarWidth = 1;

  /**
   * The project community which the entity belong to
   */
  projectScope: Community;

  /**
   * A boolean representing if item is a version of original item
   */
  public canCreateItems$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Reference for configurationSearchPage
   */
  @ViewChildren('configurationSearchPage') configurationSearchPage: QueryList<any>;

  /**
   * Handles subscriptions inside this component
   *
   * @protected
   */
  protected subscription: Subscription = new Subscription();

  constructor(public cd: ChangeDetectorRef,
              protected route: ActivatedRoute,
              protected translateService: TranslateService,
              @Inject('boxProvider') public boxProvider: CrisLayoutBox,
              @Inject('itemProvider') public itemProvider: Item) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.subscription.add(
      this.getProjectScope$()
        .subscribe(communityScope => {
          this.projectScope = communityScope;
          this.initSearchFilter(this.item);
          this.initConfiguration(this.box);
        })
    );

    this.subscription.add(
      this.initCanCreateItems$()
        .subscribe((isVersionOfAnItem: boolean) => {
          this.canCreateItems$.next(isVersionOfAnItem);
        })
    );

  }

  /**
   * Activates / Deactivates the creation of an item {@link ItemCreateComponent}, depending
   * on the value emitted from this observable.
   * The Observable will emit:
   *   - `true` to enable the item creation
   *   - `false` to disable the item creation
   *
   * @protected
   */
  protected initCanCreateItems$(): Observable<boolean> {
    return this.route.data.pipe(
      map((data) => data.isVersionOfAnItem !== true),
      filter((isVersionOfAnItem) => hasValue(isVersionOfAnItem)),
      take(1)
    );
  }

  /**
   * Initializes the {@link CrisLayoutRelationBoxComponent#searchFilter} used to filter results in the search-page
   * @param item
   * @protected
   */
  protected initSearchFilter(item: Item) {
    this.searchFilter = `scope=${item.id}`;
  }

  /**
   * initialize the {@link CrisLayoutRelationBoxComponent#configuration}
   * @param box
   * @protected
   */
  protected initConfiguration(box: CrisLayoutBox) {
    this.configuration = (box.configuration as RelationBoxConfiguration)['discovery-configuration'];
  }

  /**
   *
   * Retrieves an Observable that encapsulates the scope of this page,
   * i.e. the Community of the Funding or of the Project.
   * The Observable emits only once, and then completes itself.
   *
   * @protected
   */
  protected getProjectScope$(): Observable<Community> {
    const projectComm$ = this.route.data.pipe(
      map((data) => data.project as RemoteData<Community>),
      map((communityRD) => communityRD?.payload),
      take(1)
    );
    const fundingComm$ = this.route.data.pipe(
      map((data) => data.funding as RemoteData<Community>),
      map((communityRD) => communityRD?.payload),
      take(1)
    );
    return forkJoin([fundingComm$, projectComm$])
      .pipe(
        map(([fundingComm, projectComm]) => fundingComm || projectComm)
      );
  }

  /**
   * Call the refresh functionality to the reference of the configuration search page
   */
  refresh() {
    this.configurationSearchPage.first.refresh();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.canCreateItems$.complete();
  }

  getTargetEntity() {
    return this.box.shortname;
  }
}
