import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ImpactPathwayPageComponent } from './impact-pathway-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ProjectItemPageResolver } from '../core/project/resolvers/project-item-page.resolver';
import { ProjectCommunityByItemResolver } from '../core/project/resolvers/project-community-by-item.resolver';
import { ObjectivesPageComponent } from './objectives-page/objectives-page.component';
import { ProjectObjectivesItemResolver } from '../core/project/resolvers/project-objectives-item.resolver';
import { ProjectItemBreadcrumbResolver } from '../core/breadcrumbs/project-item-breadcrumb.resolver';
import { ProjectItemBreadcrumbService } from '../core/breadcrumbs/project-item-breadcrumb.service';
import { ProjectItemByItemRelationResolver } from '../core/project/resolvers/project-item-by-item-relation.resolver';
import { VersionOfAnItemResolver } from '../core/project/resolvers/version-of-an-item.resolver';
import {
  FunderProjectManagerByProjectResolver
} from '../core/project/resolvers/funder-project-manager-by-project.resolver';
import {
  FunderOrganizationalManagerByProjectResolver
} from '../core/project/resolvers/funder-organizational-manager-by-project.resolver';
import { FunderReaderByProjectResolver } from '../core/project/resolvers/funder-reader-by-project.resolver';
import { ProjectDataService } from '../core/project/project-data.service';

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
              isFunderOrganizationalManger: FunderOrganizationalManagerByProjectResolver,
              isFunderProject: FunderProjectManagerByProjectResolver,
              isFunderReader: FunderReaderByProjectResolver,
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
              isFunderOrganizationalManger: FunderOrganizationalManagerByProjectResolver,
              isFunderProject: FunderProjectManagerByProjectResolver,
              isFunderReader: FunderReaderByProjectResolver,
              objectivesItem: ProjectObjectivesItemResolver,
              projectCommunity: ProjectCommunityByItemResolver,
              breadcrumb: ProjectItemBreadcrumbResolver
            },
          },
        ]
      }
    ])
  ],
  providers: [
    FunderOrganizationalManagerByProjectResolver,
    FunderProjectManagerByProjectResolver,
    FunderReaderByProjectResolver,
    ProjectDataService,
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
