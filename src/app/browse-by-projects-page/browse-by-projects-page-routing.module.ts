import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrowseByProjectsPageComponent } from './browse-by-projects-page.component';

const routes: Routes = [
  {
    path: '',
    component: BrowseByProjectsPageComponent,
    data: {
      title: 'Reserch Outputs',
      breadcrumbKey: 'query-builder',
      showBreadcrumbsFluid: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrowseByProjectsPageRoutingModule { }
