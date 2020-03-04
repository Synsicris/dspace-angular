import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { WorkingPlanPageRoutingModule } from './working-plan-page-routing.module';
import { WorkingPlanModule } from '../working-plan/working-plan.module';
import { WorkingPlanPageComponent } from './working-plan-page.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule.forRoot(),
    WorkingPlanPageRoutingModule,
    WorkingPlanModule
  ],
  declarations: [
    WorkingPlanPageComponent
  ]
})
export class WorkingPlanPageModule {

}
