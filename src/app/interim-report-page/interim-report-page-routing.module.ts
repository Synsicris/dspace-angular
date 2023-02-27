import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { EndUserAgreementCurrentUserGuard } from '../core/end-user-agreement/end-user-agreement-current-user.guard';
import { QuestionsBoardGuard } from '../questions-board/core/questions-board-guard.service';
import { QuestionsBoardItemResolver } from '../questions-board/core/questions-board-item-resolver.service';
import { ProjectCommunityByItemResolver } from '../core/project/project-community-by-item.resolver';
import { ProjectCommunityByProjectItemResolver } from '../core/project/project-community-by-project-item.resolver';
import { IsFunderResolver } from '../core/project/is-funder.resolver';
import { VersionOfAnItemResolver } from '../core/project/version-of-an-item.resolver';
import { SubprojectItemI18nBreadcrumbResolver } from '../core/breadcrumbs/subproject-item-i18n-breadcrumb.resolver';
import { HasPolicyEditGrantsGuard } from '../core/project/authorization-guards/has-policy-edit-grants.guard';
import { SubprojectItemI18nBreadcrumbsService } from '../core/breadcrumbs/subproject-item-i18n-breadcrumbs.service';
import { InterimReportPageComponent } from './interim-report-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard, QuestionsBoardGuard],
        path: '',
        component: InterimReportPageComponent,
        pathMatch: 'full',
        data: {
          title: 'interim-report.page.title',
          breadcrumbKey: 'interim-report',
          showBreadcrumbsFluid: true
        },
        resolve: {
          questionsBoard: QuestionsBoardItemResolver,
          projectCommunity: ProjectCommunityByItemResolver,
          fundingCommunity: ProjectCommunityByProjectItemResolver,
          isFunder: IsFunderResolver,
          isVersionOfAnItem: VersionOfAnItemResolver,
          breadcrumb: SubprojectItemI18nBreadcrumbResolver
        }
      }
    ])
  ],
  providers: [
    QuestionsBoardGuard,
    HasPolicyEditGrantsGuard,
    QuestionsBoardItemResolver,
    IsFunderResolver,
    ProjectCommunityByItemResolver,
    ProjectCommunityByProjectItemResolver,
    SubprojectItemI18nBreadcrumbResolver,
    SubprojectItemI18nBreadcrumbsService,
    VersionOfAnItemResolver
  ]
})
export class InterimReportPageRoutingModule { }
