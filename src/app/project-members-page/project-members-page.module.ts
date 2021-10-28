import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectMembersPageComponent } from './project-members-page.component';
import { ProjectMembersPageRoutingModule } from './project-members-page-routing.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectMembersComponent } from './project-members/project-members.component';
import { AccessControlModule } from '../access-control/access-control.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ProjectMembersPageComponent, ProjectMembersComponent],
  imports: [
    CommonModule,
    AccessControlModule,
    ProjectMembersPageRoutingModule,
    NgbNavModule,
    TranslateModule
  ]
})
export class ProjectMembersPageModule { }
