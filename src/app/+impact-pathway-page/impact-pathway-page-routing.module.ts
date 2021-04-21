import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ImpactPathwayPageComponent } from './impact-pathway-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ProjectPageResolver } from '../projects/project-page.resolver';
import { ProjectI18nBreadcrumbResolver } from '../core/breadcrumbs/project-i18n-breadcrumb.resolver';
import { ProjectI18nBreadcrumbsService } from '../core/breadcrumbs/project-i18n-breadcrumbs.service';
import { ProjectItemPageResolver } from '../projects/project-item-page.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
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
          project: ProjectPageResolver,
          breadcrumb: ProjectI18nBreadcrumbResolver
        }
      }
    ])
  ],
  providers: [
    ProjectItemPageResolver,
    ProjectI18nBreadcrumbResolver,
    ProjectI18nBreadcrumbsService,
    ProjectPageResolver
  ]
})
export class ImpactPathwayPageRoutingModule {
}
