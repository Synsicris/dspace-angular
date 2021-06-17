import { Component, HostBinding, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { CrisLayoutBox } from '../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../enums/layout-box.enum';
import { LayoutPage } from '../../enums/layout-page.enum';
import { LayoutTab } from '../../enums/layout-tab.enum';
import { CrisLayoutBoxModelComponent as CrisLayoutBoxObj } from '../../models/cris-layout-box.model';

@Component({
  selector: 'ds-orcid-sync-settings.component',
  templateUrl: './help-box.component.html'
})
@CrisLayoutBox(LayoutPage.DEFAULT, LayoutTab.DEFAULT, LayoutBox.HELP)
export class CrisLayoutHelpBoxComponent extends CrisLayoutBoxObj implements OnInit {

  /**
   * The i18n key prefix used for showing text within the box
   */
  helpTextI18nPrefix = 'layout.box.help-text.';

  /**
   * The i18n key used for showing text within the box
   */
  helpTextI18nKey = 'layout.box.help-text.';

  /**
   * Dynamic styling of the component host selector
   */
  @HostBinding('style.flex') flex = '0 0 100%';

  /**
   * Dynamic styling of the component host selector
   */
  @HostBinding('style.marginRight') margin = '0px';


  constructor(protected translateService: TranslateService) {
    super(translateService);
  }

  ngOnInit() {
    this.helpTextI18nKey = this.helpTextI18nPrefix + this.box.shortname;
    super.ngOnInit();
  }

  getHelpText(): string {
    return this.translateService.instant(this.helpTextI18nKey);
  }

}
