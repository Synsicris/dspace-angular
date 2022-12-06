import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectManageVersionComponent } from './project-manage-version.component';
import { ItemResolver } from '../item-page/item.resolver';
import {
  ProjectVersionAdministratorGuard
} from '../core/data/feature-authorization/feature-authorization-guard/project-version-administrator.guard';
import { ProjectItemI18nBreadcrumbResolver } from '../core/breadcrumbs/project-item-i18n-breadcrumb.resolver';
import { ProjectItemI18nBreadcrumbsService } from '../core/breadcrumbs/project-item-i18n-breadcrumbs.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: ProjectManageVersionComponent,
        resolve: {
          item: ItemResolver,
          breadcrumb: ProjectItemI18nBreadcrumbResolver
        },
        canActivate: [ProjectVersionAdministratorGuard],
        data: { title: 'item.version.history.title', breadcrumbKey: 'version-history', showBreadcrumbsFluid: true }
      }
    ])
  ],
  exports: [RouterModule],
  providers: [
    ItemResolver,
    ProjectVersionAdministratorGuard,
    ProjectItemI18nBreadcrumbResolver,
    ProjectItemI18nBreadcrumbsService
  ]
})
export class ProjectManageVersionRoutingModule {
}
