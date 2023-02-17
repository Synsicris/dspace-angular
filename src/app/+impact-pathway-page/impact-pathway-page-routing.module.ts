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
import { VersionOfAnItemResolver } from '../core/project/version-of-an-item.resolver';
import { IsFunderResolver } from '../core/project/is-funder.resolver';

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
              isFunder: IsFunderResolver,
              projectCommunity: ProjectCommunityByItemResolver,
              isVersionOfAnItem: VersionOfAnItemResolver,
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
              isVersionOfAnItem: VersionOfAnItemResolver,
              isFunder: IsFunderResolver,
              objectivesItem: ProjectObjectivesItemResolver,
              projectCommunity: ProjectCommunityByItemResolver,
            },
          },
        ]
      }
    ])
  ],
  providers: [
    IsFunderResolver,
    ProjectItemByItemRelationResolver,
    ProjectItemPageResolver,
    ProjectItemBreadcrumbResolver,
    ProjectItemBreadcrumbService,
    ProjectCommunityByItemResolver,
    ProjectObjectivesItemResolver,
    VersionOfAnItemResolver
  ]
})
export class ImpactPathwayPageRoutingModule {
}
