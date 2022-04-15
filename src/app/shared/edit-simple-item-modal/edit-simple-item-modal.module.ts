import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditSimpleItemModalComponent } from './edit-simple-item-modal.component';
import { FormModule } from '../form/form.module';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [EditSimpleItemModalComponent],
  imports: [
    CommonModule,
    FormModule,
    SharedModule
  ],
  exports: [EditSimpleItemModalComponent]
})
export class EditSimpleItemModalModule { }
