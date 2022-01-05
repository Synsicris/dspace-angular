import { Component, Inject, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { LayoutBox } from '../../../../enums/layout-box.enum';
import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';
import { CrisLayoutBox } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';

@Component({
  selector: 'ds-orcid-sync-settings.component',
  templateUrl: './help-box.component.html'
})
@RenderCrisLayoutBoxFor(LayoutBox.HELP, true)
export class CrisLayoutHelpBoxComponent extends CrisLayoutBoxModelComponent implements OnInit {

  /**
   * The i18n key prefix used for showing text within the box
   */
  helpTextI18nPrefix = 'layout.box.help-text.';

  /**
   * The i18n key used for showing text within the box
   */
  helpTextI18nKey = 'layout.box.help-text.';

  constructor(
    protected translateService: TranslateService,
    @Inject('boxProvider') public boxProvider: CrisLayoutBox,
    @Inject('itemProvider') public itemProvider: Item
  ) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit() {
    this.helpTextI18nKey = this.helpTextI18nPrefix + this.box.shortname;
    super.ngOnInit();
  }

  getHelpText(): string {
    return this.translateService.instant(this.helpTextI18nKey);
  }

}
