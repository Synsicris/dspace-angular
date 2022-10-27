import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectManageVersionComponent } from './project-manage-version.component';
import { ItemResolver } from '../item-page/item.resolver';
import { ProjectVersionAdministratorGuard } from '../core/data/feature-authorization/feature-authorization-guard/project-version-administrator.guard';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: ProjectManageVersionComponent,
        resolve: {
          item: ItemResolver
        },
        // canActivate: [ProjectVersionAdministratorGuard]
      }
    ])
  ],
  exports: [RouterModule],
  providers: [ItemResolver, ProjectVersionAdministratorGuard]
})
export class ProjectManageVersionRoutingModule { }
