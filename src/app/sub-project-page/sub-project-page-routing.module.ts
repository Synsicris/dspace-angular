import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ItemPageResolver } from '../+item-page/item-page.resolver';
import { ProjectPageResolver } from '../projects/project-page.resolver';
import { CommunityPageResolver } from '../+community-page/community-page.resolver';
import { SubProjectPageComponent } from './sub-project-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      {
        canActivate: [AuthenticatedGuard],
        path: ':id',
        component: SubProjectPageComponent,
        data: {
          title: 'impact-pathway.objectives.edit.page.title'
        },
        resolve: {
          subproject: CommunityPageResolver,
          project: ProjectPageResolver,
        }
      }
    ])
  ],
  providers: [
    ItemPageResolver,
    ProjectPageResolver
  ]
})
export class SubProjectPageRoutingModule { }
