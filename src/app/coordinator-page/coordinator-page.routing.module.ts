import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoordinatorPageComponent } from './coordinator-page.component';

/**
 * RouterModule to help navigate to the page with the community list tree
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CoordinatorPageComponent,
        pathMatch: 'full',
        data: { title: 'coordinator.page.title' }
      }
    ]),
  ]
})
export class CoordinatorPageRoutingModule {
}
