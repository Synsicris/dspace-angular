import { LayoutBox } from '../../../cris-layout/enums/layout-box.enum';
import { isEqual } from 'lodash';
import {
  SortDirection,
  SortOptions,
} from '../../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../search/models/paginated-search-options.model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BrowseMostElementsComponent } from '../../browse-most-elements/browse-most-elements.component';

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
   * The PaginatedSearchOptions
  */
 paginatedSearchOptions: PaginatedSearchOptions;

 /**
  * Reference for configurationSearchPage
 */
@ViewChild(BrowseMostElementsComponent) configurationSearchPage: BrowseMostElementsComponent;

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
      scope: this.itemUuid,
      sort: new SortOptions('synsicris.date.creation', SortDirection.DESC),
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
    setTimeout(() => {
      this.configurationSearchPage.refresh();
    });
  }
}
