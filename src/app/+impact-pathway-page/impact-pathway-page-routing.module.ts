import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ImpactPathwayPageComponent } from './impact-pathway-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ProjectItemPageResolver } from '../core/project/project-item-page.resolver';
import { ProjectCommunityByItemResolver } from '../core/project/project-community-by-item.resolver';
import { ObjectivesPageComponent } from './objectives-page/objectives-page.component';
import { ProjectObjectivesItemResolver } from '../core/project/project-objectives-item.resolver';
import { ProjectItemBreadcrumbResolver } from '../core/breadcrumbs/project-item-breadcrumb.resolver';
import { ProjectItemBreadcrumbService } from '../core/breadcrumbs/project-item-breadcrumb.service';
import { ProjectItemByItemRelationResolver } from '../core/project/project-item-by-item-relation.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
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
              breadcrumb: ProjectItemBreadcrumbResolver
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
    ProjectItemByItemRelationResolver,
    ProjectItemPageResolver,
    ProjectItemBreadcrumbResolver,
    ProjectItemBreadcrumbService,
    ProjectCommunityByItemResolver,
    ProjectObjectivesItemResolver
  ]
})
export class ImpactPathwayPageRoutingModule {
}
