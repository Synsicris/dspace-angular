import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { SortDirection, SortOptions } from '../../../../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../../../../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../../../shared/search/models/paginated-search-options.model';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';
import { CrisLayoutBox } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';


@Component({
  selector: 'ds-orcid-sync-settings.component',
  styleUrls: ['./browse-box.component.scss'],
  templateUrl: './browse-box.component.html'
})
@RenderCrisLayoutBoxFor(LayoutBox.BROWSE)
export class CrisLayoutPersonProjectsBoxComponent extends CrisLayoutBoxModelComponent implements OnInit {

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
    @Inject('boxProvider') public boxProvider: CrisLayoutBox,
    @Inject('itemProvider') public itemProvider: Item
  ) {
    super(translateService, boxProvider, itemProvider);
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
