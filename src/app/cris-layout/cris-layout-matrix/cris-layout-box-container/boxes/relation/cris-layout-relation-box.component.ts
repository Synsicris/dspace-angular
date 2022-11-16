import { ChangeDetectorRef, Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { TranslateService } from '@ngx-translate/core';
import { CrisLayoutBox, RelationBoxConfiguration } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Community } from '../../../../../core/shared/community.model';
import { ActivatedRoute } from '@angular/router';
import { RemoteData } from '../../../../../core/data/remote-data';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'ds-cris-layout-search-box',
  templateUrl: './cris-layout-relation-box.component.html',
  styleUrls: ['./cris-layout-relation-box.component.scss']
})
@RenderCrisLayoutBoxFor(LayoutBox.RELATION)
export class CrisLayoutRelationBoxComponent extends CrisLayoutBoxModelComponent implements OnInit {

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
  public isVersionOfAnItem$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Reference for configurationSearchPage
   */
  @ViewChildren('configurationSearchPage') configurationSearchPage: QueryList<any>;

  constructor(public cd: ChangeDetectorRef,
    protected route: ActivatedRoute,
    protected translateService: TranslateService,
    @Inject('boxProvider') public boxProvider: CrisLayoutBox,
    @Inject('itemProvider') public itemProvider: Item) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.route.data.pipe(
      map((data) => data.project as RemoteData<Community>),
      map((communityRD) => communityRD.payload),
      take(1)
    ).subscribe((community) => {
      this.projectScope = community;
      this.searchFilter = `scope=${this.item.id}`;
      this.configuration = (this.box.configuration as RelationBoxConfiguration)['discovery-configuration'];
    });


    this.route.data.pipe(take(1)).subscribe((data) => {
      if (data.isVersionOfAnItem !== undefined) {
        this.isVersionOfAnItem$.next(data.isVersionOfAnItem);
      }
    });

  }

  /**
   * Call the refresh functionality to the reference of the configuration search page
   */
  refresh() {
    this.configurationSearchPage.first.refresh();
  }

}
