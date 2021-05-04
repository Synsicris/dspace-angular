import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ObjectivesPageComponent } from './objectives-page.component';
import { ProjectCommunityResolver } from '../core/project/project-community.resolver';
import { ProjectItemPageResolver } from '../core/project/project-item-page.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      {
        canActivate: [AuthenticatedGuard],
        path: ':id/edit',
        component: ObjectivesPageComponent,
        data: {
          title: 'impact-pathway.objectives.edit.page.title'
        },
        resolve: {
          item: ProjectItemPageResolver,
          project: ProjectCommunityResolver,
        }
      }
    ])
  ],
  providers: [
    ProjectItemPageResolver,
    ProjectCommunityResolver
  ]
})
export class ObjectivesPageRoutingModule { }
