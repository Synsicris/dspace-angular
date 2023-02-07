import { Item } from 'src/app/core/shared/item.model';
import { LayoutBox } from './../../../../enums/layout-box.enum';
import { isEqual } from 'lodash';
import {
  SortDirection,
  SortOptions,
} from './../../../../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from './../../../../../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from './../../../../../shared/search/models/paginated-search-options.model';
import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  @Input() item: Item;

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
   * The PaginatedSearchOptions
   */
  paginatedSearchOptions: PaginatedSearchOptions;

  /**
   * Reference for configurationSearchPage
   */
  @ViewChildren('configurationSearchPage')  configurationSearchPage: QueryList<any>;

  constructor(
    protected route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
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
      scope: this.item?.uuid,
      sort: new SortOptions('lastModified', SortDirection.DESC),
    });
  }

  /**
   * Get configuratio name based on plan type
   * @readonly
   */
  get getConfiguration() {
    let configName = `${LayoutBox.RELATION}.`;
    if (isEqual(this.type, 'impact_pathway_form')) {
      configName = configName.concat('impactpathwaystep');
    } else if (this.type.includes('exploitation_plan_step')) {
      configName = configName.concat('exploitationplanstep');
    } else if (isEqual(this.type, 'workingplan')) {
      configName = configName.concat('workingplan');
    } else if (isEqual(
        this.type,
        'impact_pathway_step_type_2_task_objective_edit_form'
      )) {
      configName = configName.concat('proj_objective');
    } else if (
      isEqual(
        this.type,
        'impact_pathway_step_type_3_task_objective_edit_form'
      )
    ) {
      configName = configName.concat('RELATION.ia_objective');
    }

    configName = configName.concat('.comment');
    return configName;
  }

  /**
   * Call the refresh functionality to the reference of the configuration search page
   */
  refresh() {
    setTimeout(() => {
      this.configurationSearchPage.first.retrieveResultList(0);
    });
  }
}
