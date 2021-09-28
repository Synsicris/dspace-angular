import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CrisLayoutBox } from '../../../decorators/cris-layout-box.decorator';
import { LayoutPage } from '../../../enums/layout-page.enum';
import { LayoutTab } from '../../../enums/layout-tab.enum';
import { LayoutBox } from '../../../enums/layout-box.enum';
import { CrisLayoutBoxModelComponent as CrisLayoutBoxObj } from '../../../models/cris-layout-box.model';
import { Observable, Subscription } from 'rxjs';
import { hasValue } from '../../../../shared/empty.util';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { map, take, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { RemoteData } from '../../../../core/data/remote-data';
import { Community } from '../../../../core/shared/community.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ds-cris-layout-search-box',
  templateUrl: './cris-layout-search-box.component.html',
  styleUrls: ['./cris-layout-search-box.component.scss']
})
@CrisLayoutBox(LayoutPage.DEFAULT, LayoutTab.DEFAULT, LayoutBox.RELATION)
export class CrisLayoutSearchBoxComponent extends CrisLayoutBoxObj implements OnInit, OnDestroy {

  /**
   * Filter used for set scope in discovery invocation
   */
  searchFilter: string;
  /**
   * Name of configuration for this box
   */
  configuration: string;
  configuration$: Observable<string>;
  /**
   * flag for enable/disable search bar
   */
  searchEnabled = false;
  sideBarWidth = 1;
  configReady = false;

  /**
   * The project community which the entity belong to
   */
  projectScope$: Observable<Community>;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  constructor(public cd: ChangeDetectorRef, protected route: ActivatedRoute, protected translateService: TranslateService, protected viewRef: ElementRef) {
    super(translateService, viewRef);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.projectScope$ = this.route.data.pipe(
      map((data) => data.project as RemoteData<Community>),
      map((communityRD) => communityRD.payload),
      take(1),
      tap((p) => console.log(p))
    );

    this.searchFilter = `scope=${this.item.id}`;
    this.configuration$ = this.box.configuration.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((config) => config.configuration)
    );
    this.subs.push(this.configuration$.subscribe((next) => {
      this.configuration = next;
      this.configReady = true;
      this.cd.markForCheck();
    }));
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
