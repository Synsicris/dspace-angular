import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectManageVersionRoutingModule } from './project-manage-version-routing.module';
import { ProjectManageVersionComponent } from './project-manage-version.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [ProjectManageVersionComponent],
  imports: [
    CommonModule,
    ProjectManageVersionRoutingModule,
    SharedModule
  ]
})
export class ProjectManageVersionModule { }
