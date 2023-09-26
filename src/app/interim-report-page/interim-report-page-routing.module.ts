import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { EndUserAgreementCurrentUserGuard } from '../core/end-user-agreement/end-user-agreement-current-user.guard';
import { QuestionsBoardGuard } from '../questions-board/core/questions-board-guard.service';
import { QuestionsBoardItemResolver } from '../questions-board/core/questions-board-item-resolver.service';
import { ProjectCommunityByItemResolver } from '../core/project/resolvers/project-community-by-item.resolver';
import {
  ProjectCommunityByProjectItemResolver
} from '../core/project/resolvers/project-community-by-project-item.resolver';
import { VersionOfAnItemResolver } from '../core/project/resolvers/version-of-an-item.resolver';
import { SubprojectItemI18nBreadcrumbResolver } from '../core/breadcrumbs/subproject-item-i18n-breadcrumb.resolver';
import { HasPolicyEditGrantsGuard } from '../core/project/authorization-guards/has-policy-edit-grants.guard';
import { SubprojectItemI18nBreadcrumbsService } from '../core/breadcrumbs/subproject-item-i18n-breadcrumbs.service';
import { InterimReportPageComponent } from './interim-report-page.component';
import {
  FunderOrganizationalManagerByProjectResolver
} from '../core/project/resolvers/funder-organizational-manager-by-project.resolver';
import {
  FunderProjectManagerByProjectResolver
} from '../core/project/resolvers/funder-project-manager-by-project.resolver';
import { FunderReaderByProjectResolver } from '../core/project/resolvers/funder-reader-by-project.resolver';
import { ProjectDataService } from '../core/project/project-data.service';
import { PrintStyleApplier } from '../core/shared/print-style-applier';
import { ProjectReaderResolver } from '../core/project/resolvers/project-reader.resolver';
import { ProjectExternalReaderResolver } from '../core/project/resolvers/project-externalreader.resolver';
import { IsAdministratorResolver } from '../core/project/resolvers/is-administrator.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard, QuestionsBoardGuard, PrintStyleApplier],
        path: '',
        component: InterimReportPageComponent,
        pathMatch: 'full',
        data: {
          title: 'interim-report.page.title',
          breadcrumbKey: 'interim-report',
          showBreadcrumbsFluid: true
        },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        resolve: {
          questionsBoard: QuestionsBoardItemResolver,
          projectCommunity: ProjectCommunityByItemResolver,
          fundingCommunity: ProjectCommunityByProjectItemResolver,
          isAdmin: IsAdministratorResolver,
          isProjectReader: ProjectReaderResolver,
          isProjectExternalReader: ProjectExternalReaderResolver,
          isFunderOrganizationalManger: FunderOrganizationalManagerByProjectResolver,
          isFunderProject: FunderProjectManagerByProjectResolver,
          isFunderReader: FunderReaderByProjectResolver,
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
    ProjectExternalReaderResolver,
    ProjectReaderResolver,
    FunderOrganizationalManagerByProjectResolver,
    FunderProjectManagerByProjectResolver,
    FunderReaderByProjectResolver,
    ProjectDataService,
    ProjectCommunityByItemResolver,
    ProjectCommunityByProjectItemResolver,
    SubprojectItemI18nBreadcrumbResolver,
    SubprojectItemI18nBreadcrumbsService,
    VersionOfAnItemResolver,
    PrintStyleApplier,
    IsAdministratorResolver
  ]
})
export class InterimReportPageRoutingModule { }
