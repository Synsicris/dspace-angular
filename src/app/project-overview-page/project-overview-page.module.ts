import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProjectOverviewPageComponent } from './project-overview-page.component';
import { ProjectOverviewPageRoutingModule } from './project-overview-page.routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProjectEntityListComponent } from './project-entity-list/project-entity-list.component';
import { LookupIdModule } from '../+lookup-by-id/lookup-by-id.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ProjectOverviewPageRoutingModule,
    SharedModule,
    LookupIdModule
  ],
  declarations: [
    ProjectOverviewPageComponent,
    ProjectEntityListComponent
  ]
})
export class ProjectOverviewPageModule { }
