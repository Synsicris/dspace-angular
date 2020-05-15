import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProjectOverviewPageComponent } from './project-overview-page.component';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../core/breadcrumbs/i18n-breadcrumbs.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        resolve: { breadcrumb: I18nBreadcrumbResolver },
        data: { title: 'project-overview.page.title', breadcrumbKey: 'project-overview' },
        component: ProjectOverviewPageComponent,
        pathMatch: 'full',
      }
    ]),
  ],
  providers: [
    I18nBreadcrumbResolver,
    I18nBreadcrumbsService
  ]
})
export class ProjectOverviewPageRoutingModule {
}
