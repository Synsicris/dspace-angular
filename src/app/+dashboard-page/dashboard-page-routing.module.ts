import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardPageComponent } from './dashboard-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: DashboardPageComponent, pathMatch: 'full', data: { title: 'home.title' } }
    ])
  ]
})
export class DashboardPageRoutingModule { }
