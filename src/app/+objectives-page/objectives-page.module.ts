import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ImpactPathwayBoardModule } from '../impact-pathway-board/impact-pathway-board.module';
import { ObjectivesPageRoutingModule } from './objectives-page-routing.module';
import { ObjectivesPageComponent } from './objectives-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ObjectivesPageRoutingModule,
    ImpactPathwayBoardModule
  ],
  declarations: [
    ObjectivesPageComponent
  ]
})
export class ObjectivesPageModule {

}
