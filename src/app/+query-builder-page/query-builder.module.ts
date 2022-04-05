import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryBuilderRoutingModule } from './query-builder-routing.module';
import { QueryBuilderComponent } from './query-builder.component';
import { QueryConditionGroupComponent } from './query-condition-group/query-condition-group.component';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [QueryBuilderComponent, QueryConditionGroupComponent],
  imports: [
    CommonModule,
    QueryBuilderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class QueryBuilderModule { }
