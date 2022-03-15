import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ImpactPathwayPageComponent } from './impact-pathway-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ProjectItemPageResolver } from '../core/project/project-item-page.resolver';
import { ProjectCommunityByItemResolver } from '../core/project/project-community-by-item.resolver';
import { ObjectivesPageComponent } from './objectives-page/objectives-page.component';
import { ProjectObjectivesItemResolver } from '../core/project/project-objectives-item.resolver';
import { ProjectItemI18nBreadcrumbResolver } from '../core/breadcrumbs/project-item-i18n-breadcrumb.resolver';
import { ProjectItemI18nBreadcrumbsService } from '../core/breadcrumbs/project-item-i18n-breadcrumbs.service';

@NgModule({
  imports: [
    RouterModule.forChild([
/*      {
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
          projectCommunity: ProjectCommunityByItemResolver,
          breadcrumb: ProjectI18nBreadcrumbResolver
        }
      }*/
      {
        path: ':id',
        canActivate: [AuthenticatedGuard],
        children: [
          {
            path: '',
            component: ImpactPathwayPageComponent,
            data: {
              title: 'impact-pathway.edit.page.title',
              breadcrumbKey: 'impact-pathway',
              showBreadcrumbsFluid: true
            },
            resolve: {
              impactPathwayItem: ProjectItemPageResolver,
              projectCommunity: ProjectCommunityByItemResolver,
              breadcrumb: ProjectItemI18nBreadcrumbResolver
            },
          },
          {
            path: 'objectives/:objId',
            component: ObjectivesPageComponent,
            data: {
              title: 'impact-pathway.objectives.edit.page.title',
              breadcrumbKey: 'impact-pathway',
              showBreadcrumbsFluid: true
            },
            resolve: {
              impactPathwayItem: ProjectItemPageResolver,
              projectCommunity: ProjectCommunityByItemResolver,
              objectivesItem: ProjectObjectivesItemResolver
            },
          },
        ]
      }
    ])
  ],
  providers: [
    ProjectItemPageResolver,
    ProjectItemI18nBreadcrumbResolver,
    ProjectItemI18nBreadcrumbsService,
    ProjectCommunityByItemResolver,
    ProjectObjectivesItemResolver
  ]
})
export class ImpactPathwayPageRoutingModule {
}
