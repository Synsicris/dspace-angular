import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProjectOverviewPageComponent } from './project-overview-page.component';
import { ProjectOverviewPageRoutingModule } from './project-overview-page.routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProjectEntityListComponent } from './project-entity-list/project-entity-list.component';
import { LookupIdModule } from '../+lookup-by-id/lookup-by-id.module';
import { ProjectOverviewPageHeaderComponent } from './header/project-overview-page-header.component';
import { ProjectOverviewPageContentComponent } from './content/project-overview-page-content.component';
import { ContextMenuModule } from '../shared/context-menu/context-menu.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ProjectOverviewPageRoutingModule,
    SharedModule,
    LookupIdModule,
    ContextMenuModule
  ],
  declarations: [
    ProjectOverviewPageComponent,
    ProjectEntityListComponent,
    ProjectOverviewPageHeaderComponent,
    ProjectOverviewPageContentComponent
  ]
})
export class ProjectOverviewPageModule { }
