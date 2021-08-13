import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyDSpaceGuard } from './my-dspace.guard';
import { ThemedMyDSpacePageComponent } from './themed-my-dspace-page.component';
import { ProjectCommunityResolver } from '../core/project/project-community.resolver';
import { ProjectI18nBreadcrumbResolver } from '../core/breadcrumbs/project-i18n-breadcrumb.resolver';
import { ProjectI18nBreadcrumbsService } from '../core/breadcrumbs/project-i18n-breadcrumbs.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ThemedMyDSpacePageComponent,
        resolve: {
          project: ProjectCommunityResolver,
          breadcrumb: ProjectI18nBreadcrumbResolver
        },
        data: { title: 'mydspace.title', breadcrumbKey: 'mydspace' },
        canActivate: [
          MyDSpaceGuard
        ]
      }
    ])
  ],
  providers: [
    ProjectI18nBreadcrumbResolver,
    ProjectI18nBreadcrumbsService,
    ProjectCommunityResolver
  ]
})
/**
 * This module defines the default component to load when navigating to the mydspace page path.
 */
export class MyDspacePageRoutingModule {
}
