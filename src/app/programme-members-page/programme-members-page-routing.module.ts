import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubprojectItemI18nBreadcrumbResolver } from '../core/breadcrumbs/subproject-item-i18n-breadcrumb.resolver';
import { SubprojectItemI18nBreadcrumbsService } from '../core/breadcrumbs/subproject-item-i18n-breadcrumbs.service';
import { ProjectItemPageResolver } from '../core/project/resolvers/project-item-page.resolver';
import {
  ProjectCommunityByProjectItemResolver
} from '../core/project/resolvers/project-community-by-project-item.resolver';
import { ProgrammeMembersPageGuard } from './programme-members-page.guard';
import { ProgrammeMembersPageComponent } from './programme-members-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProgrammeMembersPageComponent,
        canActivate: [ProgrammeMembersPageGuard],
        data: {
          title: 'programme.manage.page.title',
          breadcrumbKey: 'programme.manage',
        },
        resolve: {
          programmeItem: ProjectItemPageResolver,
          breadcrumb: SubprojectItemI18nBreadcrumbResolver
        }
      }
    ])
  ],
  providers: [
    ProgrammeMembersPageGuard,
    ProjectItemPageResolver,
    ProjectCommunityByProjectItemResolver,
    SubprojectItemI18nBreadcrumbResolver,
    SubprojectItemI18nBreadcrumbsService
  ]
})
export class ProgrammeMembersPageRoutingModule { }
