import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectMembersPageComponent } from './project-members-page.component';
import { SubprojectItemI18nBreadcrumbResolver } from '../core/breadcrumbs/subproject-item-i18n-breadcrumb.resolver';
import { SubprojectItemI18nBreadcrumbsService } from '../core/breadcrumbs/subproject-item-i18n-breadcrumbs.service';
import { ProjectItemPageResolver } from '../core/project/project-item-page.resolver';
import { ProjectCommunityByProjectItemResolver } from '../core/project/project-community-by-project-item.resolver';
import { ProjectMembersPageGuard } from './project-members-page.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProjectMembersPageComponent,
        canActivate: [ProjectMembersPageGuard],
        data: {
          title: 'project.manage.page.title',
          breadcrumbKey: 'project.manage',
        },
        resolve: {
          projectItem: ProjectItemPageResolver,
          projectCommunity: ProjectCommunityByProjectItemResolver,
          breadcrumb: SubprojectItemI18nBreadcrumbResolver
        }
      }
    ])
  ],
  providers: [
    ProjectMembersPageGuard,
    ProjectItemPageResolver,
    ProjectCommunityByProjectItemResolver,
    SubprojectItemI18nBreadcrumbResolver,
    SubprojectItemI18nBreadcrumbsService
  ]
})
export class ProjectMembersPageRoutingModule { }
