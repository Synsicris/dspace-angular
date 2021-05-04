import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { WorkingPlanPageComponent } from './working-plan-page.component';
import { ProjectI18nBreadcrumbsService } from '../core/breadcrumbs/project-i18n-breadcrumbs.service';
import { ProjectI18nBreadcrumbResolver } from '../core/breadcrumbs/project-i18n-breadcrumb.resolver';
import { ProjectCommunityResolver } from '../core/project/project-community.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [AuthenticatedGuard],
        path: '',
        component: WorkingPlanPageComponent,
        pathMatch: 'full',
        resolve: {
          project: ProjectCommunityResolver,
          breadcrumb: ProjectI18nBreadcrumbResolver
        },
        data: { title: 'working-plan.page.title', breadcrumbKey: 'working-plan', showBreadcrumbsFluid: true }
      },
    ])
  ],
  providers: [
    ProjectI18nBreadcrumbResolver,
    ProjectI18nBreadcrumbsService,
    ProjectCommunityResolver
  ]
})
export class WorkingPlanPageRoutingModule {
}
