import { Component, ElementRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { CrisLayoutBox } from '../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../enums/layout-box.enum';
import { LayoutPage } from '../../enums/layout-page.enum';
import { LayoutTab } from '../../enums/layout-tab.enum';
import { CrisLayoutBoxModelComponent as CrisLayoutBoxObj } from '../../models/cris-layout-box.model';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../shared/search/paginated-search-options.model';

@Component({
  selector: 'ds-orcid-sync-settings.component',
  styleUrls: ['./browse-box.component.scss'],
  templateUrl: './browse-box.component.html'
})
@CrisLayoutBox(LayoutPage.DEFAULT, LayoutTab.DEFAULT, LayoutBox.BROWSE)
export class CrisLayoutPersonProjectsBoxComponent extends CrisLayoutBoxObj implements OnInit {

  /**
   * The i18n key used for box's header
   */
  boxHeaderI18nKey = '';

  /**
   * The PaginatedSearchOptions
   */
  paginatedSearchOptions: PaginatedSearchOptions;

  constructor(
    protected translateService: TranslateService,
    protected viewRef: ElementRef
  ) {
    super(translateService, viewRef);
  }

  ngOnInit() {
    super.ngOnInit();
    this.boxHeaderI18nKey = `BROWSE.${this.item.entityType}.${this.box.shortname}`;

    const discoveryConfigurationName = `BROWSE.${this.item.entityType}.${this.box.shortname}`;

    const pagination: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
      id: 'search-object-pagination',
      pageSize: 5,
      currentPage: 1
    });

    this.paginatedSearchOptions = new PaginatedSearchOptions({
      configuration: discoveryConfigurationName,
      pagination: pagination,
      sort: new SortOptions('lastModified', SortDirection.DESC)
    });
  }
}
