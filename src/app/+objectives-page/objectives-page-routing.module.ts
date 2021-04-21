import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ObjectivesPageComponent } from './objectives-page.component';
import { ProjectPageResolver } from '../projects/project-page.resolver';
import { ProjectItemPageResolver } from '../projects/project-item-page.resolver';

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
          project: ProjectPageResolver,
        }
      }
    ])
  ],
  providers: [
    ProjectItemPageResolver,
    ProjectPageResolver
  ]
})
export class ObjectivesPageRoutingModule { }
