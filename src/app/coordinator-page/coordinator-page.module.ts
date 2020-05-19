import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoordinatorPageComponent } from './coordinator-page.component';
import { CoordinatorPageRoutingModule } from './coordinator-page.routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CoordinatorPageRoutingModule
  ],
  declarations: [
    CoordinatorPageComponent
  ]
})
export class CoordinatorPageModule {
}
