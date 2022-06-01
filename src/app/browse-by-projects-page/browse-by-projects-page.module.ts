import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { BrowseByProjectsPageComponent } from './browse-by-projects-page.component';
import { NgbAccordionModule, NgbButtonsModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchModule } from '../shared/search/search.module';
import { SharedModule } from '../shared/shared.module';
import { BrowseByProjectsPageRoutingModule } from './browse-by-projects-page-routing.module';
import { QueryBuilderModule } from '../query-builder/query-builder.module';


@NgModule({
  declarations: [
    BrowseByProjectsPageComponent,
  ],
  imports: [
    BrowseByProjectsPageRoutingModule,
    CommonModule,
    TranslateModule,
    NgbAccordionModule,
    NgbButtonsModule,
    ReactiveFormsModule,
    NgbModule,
    QueryBuilderModule,
    SearchModule,
    SharedModule,
  ],
})
export class BrowseByProjectsPageModule {
}
