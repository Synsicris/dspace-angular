import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProjectOverviewPageComponent } from './project-overview-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ProjectEntityListComponent } from './project-entity-list/project-entity-list.component';
import { ProjectEntityListResolver } from './project-entity-list/project-entity-list.resolver';
import { ProjectI18nBreadcrumbsService } from '../core/breadcrumbs/project-i18n-breadcrumbs.service';
import { ProjectEntityListBreadcrumbResolver } from '../core/breadcrumbs/project-entity-list-breadcrumb.resolver';
import { CommunityBreadcrumbResolver } from '../core/breadcrumbs/community-breadcrumb.resolver';
import { CommunityPageResolver } from '../+community-page/community-page.resolver';
import { ProjectCollectionBreadcrumbResolver } from '../core/breadcrumbs/project-collection-breadcrumb.resolver';
import { ProjectDsoBreadcrumbsService } from '../core/breadcrumbs/project-dso-breadcrumbs.service';
import { ProjectBreadcrumbResolver } from '../core/breadcrumbs/project-breadcrumb.resolver';
import { ProjectPageResolver } from '../projects/project-page.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: ':projectId/impactpathway', loadChildren: '../+impact-pathway-page/impact-pathway-page.module#ImpactPathwayPageModule' },
      { path: ':projectId/objectives', loadChildren: '../+objectives-page/objectives-page.module#ObjectivesPageModule' },
      { path: ':projectId/workingplan', loadChildren: '../+working-plan-page/working-plan-page.module#WorkingPlanPageModule' },
      {
        canActivate: [AuthenticatedGuard],
        path: ':projectId',
        resolve: {
          breadcrumb: ProjectBreadcrumbResolver,
          project: ProjectPageResolver
        },
        data: { title: 'project-overview.page.title', breadcrumbKey: 'project-overview' },
        component: ProjectOverviewPageComponent
      },
      {
        canActivate: [AuthenticatedGuard],
        path: ':name/:type/list',
        resolve: {
          breadcrumb: ProjectEntityListBreadcrumbResolver,
          entityList: ProjectEntityListResolver
        },
        data: { title: 'project-overview.page.title', breadcrumbKey: 'project-overview' },
        component: ProjectEntityListComponent
      },
    ]),
  ],
  providers: [
    CommunityPageResolver,
    CommunityBreadcrumbResolver,
    ProjectEntityListResolver,
    ProjectEntityListBreadcrumbResolver,
    ProjectCollectionBreadcrumbResolver,
    ProjectI18nBreadcrumbsService,
    ProjectDsoBreadcrumbsService,
    ProjectBreadcrumbResolver,
    ProjectPageResolver
  ]
})
export class ProjectOverviewPageRoutingModule {
}
