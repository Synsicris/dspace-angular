import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { WorkingPlanPageComponent } from './working-plan-page.component';
import { WorkingPlanItemResolver } from '../working-plan/core/working-plan-item.resolver';
import { ProjectItemPageResolver } from '../core/project/resolvers/project-item-page.resolver';
import {
  ProjectCommunityByProjectItemResolver
} from '../core/project/resolvers/project-community-by-project-item.resolver';
import { ProjectItemI18nBreadcrumbResolver } from '../core/breadcrumbs/project-item-i18n-breadcrumb.resolver';
import { ProjectItemI18nBreadcrumbsService } from '../core/breadcrumbs/project-item-i18n-breadcrumbs.service';
import { VersionOfAnItemResolver } from '../core/project/resolvers/version-of-an-item.resolver';
import {
  FunderOrganizationalManagerByProjectResolver
} from '../core/project/resolvers/funder-organizational-manager-by-project.resolver';
import {
  FunderProjectManagerByProjectResolver
} from '../core/project/resolvers/funder-project-manager-by-project.resolver';
import { FunderReaderByProjectResolver } from '../core/project/resolvers/funder-reader-by-project.resolver';
import { ProjectDataService } from '../core/project/project-data.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [AuthenticatedGuard],
        path: '',
        component: WorkingPlanPageComponent,
        pathMatch: 'full',
        resolve: {
          workingPlan: WorkingPlanItemResolver,
          projectItem: ProjectItemPageResolver,
          projectCommunity: ProjectCommunityByProjectItemResolver,
          isVersionOfAnItem: VersionOfAnItemResolver,
          isFunderOrganizationalManger: FunderOrganizationalManagerByProjectResolver,
          isFunderProject: FunderProjectManagerByProjectResolver,
          isFunderReader: FunderReaderByProjectResolver,
          breadcrumb: ProjectItemI18nBreadcrumbResolver
        },
        data: { title: 'working-plan.page.title', breadcrumbKey: 'working-plan', showBreadcrumbsFluid: true }
      },
    ])
  ],
  providers: [
    FunderOrganizationalManagerByProjectResolver,
    FunderProjectManagerByProjectResolver,
    FunderReaderByProjectResolver,
    ProjectDataService,
    ProjectItemI18nBreadcrumbResolver,
    ProjectItemI18nBreadcrumbsService,
    ProjectCommunityByProjectItemResolver,
    ProjectItemPageResolver,
    WorkingPlanItemResolver,
    VersionOfAnItemResolver
  ]
})
export class WorkingPlanPageRoutingModule {
}
