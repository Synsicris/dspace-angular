import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ImpactPathwayPageComponent } from './impact-pathway-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ProjectCommunityResolver } from '../core/project/project-community.resolver';
import { ProjectI18nBreadcrumbResolver } from '../core/breadcrumbs/project-i18n-breadcrumb.resolver';
import { ProjectI18nBreadcrumbsService } from '../core/breadcrumbs/project-i18n-breadcrumbs.service';
import { ProjectItemPageResolver } from '../core/project/project-item-page.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [AuthenticatedGuard],
        path: ':id/edit',
        component: ImpactPathwayPageComponent,
        data: {
          title: 'impact-pathway.edit.page.title',
          breadcrumbKey: 'impact-pathway',
          showBreadcrumbsFluid: true
        },
        resolve: {
          item: ProjectItemPageResolver,
          project: ProjectCommunityResolver,
          breadcrumb: ProjectI18nBreadcrumbResolver
        }
      }
    ])
  ],
  providers: [
    ProjectItemPageResolver,
    ProjectI18nBreadcrumbResolver,
    ProjectI18nBreadcrumbsService,
    ProjectCommunityResolver
  ]
})
export class ImpactPathwayPageRoutingModule {
}
