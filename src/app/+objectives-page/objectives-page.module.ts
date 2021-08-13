import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ImpactPathwayBoardModule } from '../impact-pathway-board/impact-pathway-board.module';
import { ObjectivesPageRoutingModule } from './objectives-page-routing.module';
import { ObjectivesPageComponent } from './objectives-page.component';
import { ImpactPathwayCoreModule } from '../impact-pathway-board/core/impact-pathway-core.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ObjectivesPageRoutingModule,
    ImpactPathwayBoardModule,
    ImpactPathwayCoreModule
  ],
  declarations: [
    ObjectivesPageComponent
  ]
})
export class ObjectivesPageModule {

}
