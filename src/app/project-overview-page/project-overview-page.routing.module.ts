import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProjectOverviewPageComponent } from './project-overview-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ProjectEntityListComponent } from './project-entity-list/project-entity-list.component';
import { ProjectEntityListResolver } from './project-entity-list/project-entity-list.resolver';
import { ProjectI18nBreadcrumbsService } from '../core/breadcrumbs/project-i18n-breadcrumbs.service';
import { ProjectEntityListBreadcrumbResolver } from '../core/breadcrumbs/project-entity-list-breadcrumb.resolver';
import { CommunityBreadcrumbResolver } from '../core/breadcrumbs/community-breadcrumb.resolver';
import { CommunityPageResolver } from '../community-page/community-page.resolver';
import { ProjectCollectionBreadcrumbResolver } from '../core/breadcrumbs/project-collection-breadcrumb.resolver';
import { ProjectDsoBreadcrumbsService } from '../core/breadcrumbs/project-dso-breadcrumbs.service';
import { ProjectBreadcrumbResolver } from '../core/breadcrumbs/project-breadcrumb.resolver';
import { ProjectCommunityResolver } from '../core/project/project-community.resolver';
import { EndUserAgreementCurrentUserGuard } from '../core/end-user-agreement/end-user-agreement-current-user.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':projectId/impactpathway',
        loadChildren: () => import('../+impact-pathway-page/impact-pathway-page.module')
          .then((m) => m.ImpactPathwayPageModule),
        canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
      },
      {
        path: ':projectId/objectives',
        loadChildren: () => import('../+objectives-page/objectives-page.module')
          .then((m) => m.ObjectivesPageModule),
        canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
      },
      {
        path: ':projectId/workingplan',
        loadChildren: () => import('../+working-plan-page/working-plan-page.module')
          .then((m) => m.WorkingPlanPageModule),
        canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
      },
      {
        path: ':projectId/allitems',
        loadChildren: () => import('../my-dspace-page/my-dspace-page.module')
          .then((m) => m.MyDSpacePageModule),
        canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
      },
      {
        path: ':projectId/subproject',
        loadChildren: () => import('../sub-project-page/sub-project-page.module')
          .then((m) => m.SubProjectPageModule),
        canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
      },
      {
        path: ':projectId',
        canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard],
        resolve: {
          breadcrumb: ProjectBreadcrumbResolver,
          project: ProjectCommunityResolver
        },
        data: { title: 'project-overview.page.title', breadcrumbKey: 'project-overview' },
        component: ProjectOverviewPageComponent
      },
      {
        canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard],
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
    ProjectCommunityResolver
  ]
})
export class ProjectOverviewPageRoutingModule {
}
