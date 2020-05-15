import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ImpactPathwayPageComponent } from './impact-pathway-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ItemPageResolver } from '../+item-page/item-page.resolver';
import { ProjectItemBreadcrumbResolver } from '../core/breadcrumbs/project-item-breadcrumb.resolver';
import { ProjectDsoBreadcrumbsService } from '../core/breadcrumbs/project-dso-breadcrumbs.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      {
        canActivate: [AuthenticatedGuard],
        path: ':id/edit',
        component: ImpactPathwayPageComponent,
        data: {
          title: 'impact-pathway.edit.page.title',
          breadcrumbKey: 'impact-pathway'
        },
        resolve: {
          item: ItemPageResolver,
          breadcrumb: ProjectItemBreadcrumbResolver
        }
      }
    ])
  ],
  providers: [
    ProjectItemBreadcrumbResolver,
    ProjectDsoBreadcrumbsService
  ]
})
export class ImpactPathwayPageRoutingModule {
}
