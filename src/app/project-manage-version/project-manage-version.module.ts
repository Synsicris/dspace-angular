import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectManageVersionRoutingModule } from './project-manage-version-routing.module';
import { ProjectManageVersionComponent } from './project-manage-version.component';
import { ItemVersionsModule } from '../item-page/versions/item-versions.module';



@NgModule({
  declarations: [ProjectManageVersionComponent],
    imports: [
        CommonModule,
        ProjectManageVersionRoutingModule,
        ItemVersionsModule
    ]
})
export class ProjectManageVersionModule { }
