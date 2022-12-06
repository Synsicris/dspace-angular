import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { QueryConditionGroupComponent } from './query-condition-group/query-condition-group.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { SearchModule } from '../shared/search/search.module';
import { ControlTypeCheckerPipe } from './pipes/control-type-checker.pipe';
import { SelectedProjectListComponent } from './selected-project-list/selected-project-list.component';
import { SharedModule } from '../shared/shared.module';
import { ProjectsScopedSearchComponent } from './projects-scoped-search/projects-scoped-search.component';

const COMPONENTS = [
  QueryBuilderComponent,
  QueryConditionGroupComponent,
  ControlTypeCheckerPipe,
  SelectedProjectListComponent,
  ProjectsScopedSearchComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    SearchModule,
    SharedModule
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class QueryBuilderModule {}
