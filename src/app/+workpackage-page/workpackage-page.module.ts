import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { WorkpackagePageRoutingModule } from './workpackage-page-routing.module';
import { WorkpackageModule } from '../workpackage/workpackage.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WorkpackagePageRoutingModule,
    WorkpackageModule
  ]
})
export class WorkpackagePageModule {

}
