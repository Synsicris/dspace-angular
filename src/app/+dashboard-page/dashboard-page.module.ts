import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DashboardPageComponent } from './dashboard-page.component';
import { DashboardPageRoutingModule } from './dashboard-page-routing.module';
import { DashboardModule } from '../dashboard/dashboard.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DashboardPageRoutingModule,
    DashboardModule
  ],
  declarations: [
    DashboardPageComponent
  ]
})
export class DashboardPageModule {

}
