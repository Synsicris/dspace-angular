import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProjectOverviewPageComponent } from './project-overview-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProjectOverviewPageComponent,
        pathMatch: 'full',
        data: { title: 'project-overview.page.title' }
      }
    ]),
  ],
  declarations: []
})
export class ProjectOverviewPageRoutingModule {
}
