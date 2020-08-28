import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ItemPageResolver } from '../+item-page/item-page.resolver';
import { ObjectivesPageComponent } from './objectives-page.component';
import { ProjectPageResolver } from '../projects/project-page.resolver';

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
          item: ItemPageResolver,
          project: ProjectPageResolver,
        }
      }
    ])
  ],
  providers: [
    ProjectPageResolver
  ]
})
export class ObjectivesPageRoutingModule { }
