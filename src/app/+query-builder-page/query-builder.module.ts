import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryBuilderRoutingModule } from './query-builder-routing.module';
import { QueryConditionGroupComponent } from './query-condition-group/query-condition-group.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { QueryResearchOutputComponent } from './query-research-output/query-research-output.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchModule } from '../shared/search/search.module';
import { ControlTypeCheckerPipe } from './pipes/control-type-checker.pipe';

@NgModule({
  declarations: [
    QueryBuilderComponent,
    QueryConditionGroupComponent,
    ControlTypeCheckerPipe,
    QueryResearchOutputComponent,
  ],
  imports: [
    CommonModule,
    QueryBuilderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    NgbModule,
    SearchModule
  ],
})
export class QueryBuilderModule {}
