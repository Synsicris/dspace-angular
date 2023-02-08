import { Component, Inject, Input } from '@angular/core';
import {
  listableObjectComponent
} from '../../../../../object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../../core/shared/view-mode.model';
import { ItemSearchResult } from '../../../../../object-collection/shared/item-search-result.model';
import { SearchResultListElementComponent } from '../../../search-result-list-element.component';
import { Item } from '../../../../../../core/shared/item.model';
import { getItemPageRoute } from '../../../../../../item-page/item-page-routing-paths';
import { Context } from '../../../../../../core/shared/context.model';
import { TruncatableService } from '../../../../../truncatable/truncatable.service';
import { DSONameService } from '../../../../../../core/breadcrumbs/dso-name.service';
import {
  DisplayItemMetadataType,
  ResultViewConfig
} from '../../../../../../../config/display-search-result-config.interface';
import { FUNDING_ENTITY, PROJECT_ENTITY } from '../../../../../../core/project/project-data.service';
import { APP_CONFIG, AppConfig } from '../../../../../../../config/app-config.interface';

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement)
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement)
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement, Context.BrowseMostElements)
@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['./item-search-result-list-element.component.scss'],
  templateUrl: './item-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Publication
 */
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {

  /**
   * Whether to show the metrics badges
   */
  @Input() showMetrics = true;

  /**
   * Display configurations for the item search result
   */
  displayConfigurations: ResultViewConfig[];

  DisplayItemMetadataType = DisplayItemMetadataType;

  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  /**
   * A boolean representing if to show item actions
   */
  showItemActions: boolean;

  public constructor(protected truncatableService: TruncatableService, protected dsoNameService: DSONameService, @Inject(APP_CONFIG) protected appConfig: AppConfig) {
    super(truncatableService, dsoNameService, appConfig);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.showThumbnails = this.showThumbnails ?? this.appConfig.browseBy.showThumbnails;
    this.itemPageRoute = getItemPageRoute(this.dso);
    this.showItemActions = this.dso.entityType !== PROJECT_ENTITY && this.dso.entityType !== FUNDING_ENTITY;

    const itemType = this.firstMetadataValue('dspace.entity.type');
    if ( !!this.appConfig.displayItemSearchResult && !!this.appConfig.displayItemSearchResult[itemType] ) {
      this.displayConfigurations = this.appConfig.displayItemSearchResult[itemType];
    } else if ( !!this.appConfig.displayItemSearchResult['default'] ) {
      this.displayConfigurations = this.appConfig.displayItemSearchResult['default'];
    } else {
      this.displayConfigurations = null;
    }
  }
}
