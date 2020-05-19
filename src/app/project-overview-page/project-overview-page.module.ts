import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProjectOverviewPageComponent } from './project-overview-page.component';
import { ProjectOverviewPageRoutingModule } from './project-overview-page.routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ProjectOverviewPageRoutingModule,
    SharedModule
  ],
  declarations: [
    ProjectOverviewPageComponent
  ]
})
export class ProjectOverviewPageModule { }
