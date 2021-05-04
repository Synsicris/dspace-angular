import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ProjectCommunityResolver } from '../core/project/project-community.resolver';
import { SubProjectPageComponent } from './sub-project-page.component';
import { SubProjectBreadcrumbResolver } from '../core/breadcrumbs/subproject-breadcrumb.resolver';
import { SubprojectBreadcrumbsService } from '../core/breadcrumbs/subproject-breadcrumbs.service';
import { EndUserAgreementCurrentUserGuard } from '../core/end-user-agreement/end-user-agreement-current-user.guard';
import { SubprojectCommunityResolver } from '../core/project/subproject-community.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id/exploitationplan',
        loadChildren: () => import('../+exploitation-plan-page/exploitation-plan-page.module')
          .then((m) => m.ExploitationPlanPageModule),
        canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
      },
      {
        canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard],
        path: ':id',
        component: SubProjectPageComponent,
        data: {
          title: 'impact-pathway.objectives.edit.page.title'
        },
        resolve: {
          subproject: SubprojectCommunityResolver,
          project: ProjectCommunityResolver,
          breadcrumb: SubProjectBreadcrumbResolver
        }
      }
    ])
  ],
  providers: [
    SubProjectBreadcrumbResolver,
    SubprojectBreadcrumbsService,
    SubprojectCommunityResolver
  ]
})
export class SubProjectPageRoutingModule { }
