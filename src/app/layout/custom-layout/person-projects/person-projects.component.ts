import { Component, ElementRef, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { CrisLayoutBox } from '../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../enums/layout-box.enum';
import { LayoutPage } from '../../enums/layout-page.enum';
import { LayoutTab } from '../../enums/layout-tab.enum';
import { CrisLayoutBoxModelComponent as CrisLayoutBoxObj } from '../../models/cris-layout-box.model';
import { Metadata } from '../../../core/shared/metadata.utils';
import { isNotEmpty } from '../../../shared/empty.util';
import { EPersonDataService } from '../../../core/eperson/eperson-data.service';
import { TopSection } from '../../../core/layout/models/section.model';
import { SortDirection } from '../../../core/cache/models/sort-options.model';

@Component({
  selector: 'ds-orcid-sync-settings.component',
  templateUrl: './person-projects.component.html'
})
@CrisLayoutBox(LayoutPage.DEFAULT, LayoutTab.DEFAULT, LayoutBox.BROWSE)
export class CrisLayoutPersonProjectsBoxComponent extends CrisLayoutBoxObj implements OnInit {

  canDisplay: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  config: TopSection;

  constructor(
    protected epersonService: EPersonDataService,
    protected translateService: TranslateService,
    protected viewRef: ElementRef
  ) {
    super(translateService, viewRef);
  }

  ngOnInit() {
    super.ngOnInit();
    console.log(`BROWSE.${this.item.entityType}.${this.box.shortname}`);
    this.config = {
      discoveryConfigurationName: `BROWSE.${this.item.entityType}.${this.box.shortname}`,
      sortField: 'lastModified',
      order: SortDirection.DESC,
      titleKey: this.getBoxHeader(),
      componentType: 'top',
      pageSize: 5
    };
    const crisId = Metadata.firstValue(this.item.metadata, 'cris.sourceId');
    if (this.item.entityType === 'Person' || isNotEmpty(crisId)) {
      this.canDisplay.next(true);
    }
  }
}
