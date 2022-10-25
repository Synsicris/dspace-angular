import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateItemSubmissionModalComponent } from './create-item-submission-modal.component';
import { FormModule } from '../form/form.module';
import { SharedModule } from '../shared.module';
import { SectionsService } from '../../submission/sections/sections.service';


@NgModule({
  declarations: [CreateItemSubmissionModalComponent],
  imports: [
    CommonModule,
    FormModule,
    SharedModule
  ],
  exports: [CreateItemSubmissionModalComponent],
  providers: [SectionsService]
})
export class CreateItemSubmissionModalModule { }
