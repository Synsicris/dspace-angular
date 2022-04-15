import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewSimpleItemFormComponent } from './view-simple-item-form.component';
import { FormModule } from '../form/form.module';


@NgModule({
  declarations: [ViewSimpleItemFormComponent],
  imports: [
    CommonModule,
    FormModule
  ],
  exports: [ViewSimpleItemFormComponent]
})
export class ViewSimpleItemFormModule { }
