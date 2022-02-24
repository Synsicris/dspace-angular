import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { WorkingPlanPageComponent } from './working-plan-page.component';
import { WorkingPlanItemResolver } from '../working-plan/core/working-plan-item.resolver';
import { ProjectItemPageResolver } from '../core/project/project-item-page.resolver';
import { ProjectCommunityByProjectItemResolver } from '../core/project/project-community-by-project-item.resolver';
import { ProjectItemI18nBreadcrumbResolver } from '../core/breadcrumbs/project-item-i18n-breadcrumb.resolver';
import { ProjectItemI18nBreadcrumbsService } from '../core/breadcrumbs/project-item-i18n-breadcrumbs.service';

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
          breadcrumb: ProjectItemI18nBreadcrumbResolver
        },
        data: { title: 'working-plan.page.title', breadcrumbKey: 'working-plan', showBreadcrumbsFluid: true }
      },
    ])
  ],
  providers: [
    ProjectItemI18nBreadcrumbResolver,
    ProjectItemI18nBreadcrumbsService,
    ProjectCommunityByProjectItemResolver,
    ProjectItemPageResolver,
    WorkingPlanItemResolver
  ]
})
export class WorkingPlanPageRoutingModule {
}
