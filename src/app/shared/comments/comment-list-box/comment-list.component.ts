import { LayoutBox } from '../../../cris-layout/enums/layout-box.enum';
import { isEqual } from 'lodash';
import { SortDirection, SortOptions, } from '../../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../search/models/paginated-search-options.model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BrowseMostElementsComponent } from '../../browse-most-elements/browse-most-elements.component';
import { Item } from '../../../core/shared/item.model';
import { VERSION_UNIQUE_ID } from '../../../core/project/project-data.service';
import { hasValue } from '../../empty.util';
import { ItemDataService } from '../../../core/data/item-data.service';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';

@Component({
  selector: 'ds-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  /**
   * The project community's id
   */
  @Input() projectCommunityId: string;

  /**
   * The related entity type
   */
  @Input() relatedEntityType: string;

  /**
   * Item's identifier
   */
  @Input() itemUuid: string;

  /**
   * Type of plan
   */
  @Input() type: string;

  /**
   * Flag to define if the card header should be displayd or not
   */
  @Input() showCardHeader = true;

  /**
   * Title of card header
   */
  @Input() title?: string;

  /**
   * the item for which to list comments
   */
  item: Item;

  /**
   * The PaginatedSearchOptions
   */
  paginatedSearchOptions: PaginatedSearchOptions;

  /**
   * Reference for configurationSearchPage
   */
  @ViewChild(BrowseMostElementsComponent) configurationSearchPage: BrowseMostElementsComponent;

  constructor(
    protected itemService: ItemDataService,
    protected route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {

    this.itemService.findById(this.itemUuid).pipe(
      getFirstCompletedRemoteData()
    ).subscribe((itemRD: RemoteData<Item>) => {
      if (itemRD.hasSucceeded && !itemRD.hasNoContent) {
        this.item = itemRD.payload;
        this.initPaginationOptions(this.item);
      }
    });

  }

  /**
   * Get configuration name based on plan type
   * @readonly
   */
  get getConfiguration() {
    let configName = `${LayoutBox.COMMENT}.`;
    if (isEqual(this.type, 'impact_pathway_form')) {
      configName = configName.concat('impactpathwaystep.comment');
    } else if (this.type.includes('exploitation_plan_step')) {
      configName = configName.concat('exploitationplanstep.comment');
    } else if (isEqual(this.type, 'workingplan')) {
      configName = configName.concat('workingplan.comment');
    } else if (isEqual(
      this.type,
      'impact_pathway_step_type_2_task_objective_edit_form'
    )) {
      configName = configName.concat('proj_objective.proj_objective_comment');
    } else if (
      isEqual(
        this.type,
        'impact_pathway_step_type_3_task_objective_edit_form'
      )
    ) {
      configName = configName.concat('ia_objective.ia_objective_comment');
    }

    return configName;
  }

  /**
   * Call the refresh functionality to the reference of the configuration search page
   */
  refresh() {
    this.configurationSearchPage.refresh();
  }

  private initPaginationOptions(item: Item) {
    const pagination: PaginationComponentOptions = Object.assign(
      new PaginationComponentOptions(),
      {
        id: 'cl',
        pageSize: 5,
        currentPage: 1,
      }
    );

    this.paginatedSearchOptions = new PaginatedSearchOptions({
      configuration: this.getConfiguration,
      pagination: pagination,
      scope: this.getScopeItemId(item),
      sort: new SortOptions('synsicris.date.creation', SortDirection.DESC),
    });
  }

  private getScopeItemId(item: Item): string {
    const uniqueId = item.firstMetadataValue(VERSION_UNIQUE_ID);
    let scopeId = null;
    if (!hasValue(uniqueId) || !hasValue(scopeId = uniqueId.split('_')[0])) {
      return item.id;
    }
    return scopeId;
  }
}
