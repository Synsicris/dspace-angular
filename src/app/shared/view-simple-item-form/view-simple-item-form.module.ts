import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MissingTranslationHandler, TranslateModule } from '@ngx-translate/core';

import { MissingTranslationHelper } from '../translate/missing-translation.helper';
import { ViewSimpleItemFormComponent } from './view-simple-item-form.component';
import { FormModule } from '../form/form.module';

@NgModule({
  declarations: [ViewSimpleItemFormComponent],
  imports: [
    CommonModule,
    FormModule,
    TranslateModule.forChild({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingTranslationHelper,
      },
      useDefaultLang: true,
    }),
  ],
  exports: [ViewSimpleItemFormComponent]
})
export class ViewSimpleItemFormModule { }
