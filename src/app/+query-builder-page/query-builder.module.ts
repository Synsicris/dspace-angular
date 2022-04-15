import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryBuilderRoutingModule } from './query-builder-routing.module';
import { QueryBuilderComponent } from './query-builder.component';
import { QueryConditionGroupComponent } from './query-condition-group/query-condition-group.component';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ControlTypeCheckerPipe } from './control-type-checker.pipe';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [QueryBuilderComponent, QueryConditionGroupComponent, ControlTypeCheckerPipe],
  imports: [
    CommonModule,
    QueryBuilderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule
  ]
})
export class QueryBuilderModule { }
