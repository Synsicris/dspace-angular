import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ImpactPathwayPageComponent } from './impact-pathway-page.component';
import { ImpactPathwayPageRoutingModule } from './impact-pathway-page-routing.module';
import { ImpactPathwayBoardModule } from '../impact-pathway-board/impact-pathway-board.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ImpactPathwayPageRoutingModule,
    ImpactPathwayBoardModule
  ],
  declarations: [
    ImpactPathwayPageComponent
  ]
})
export class ImpactPathwayPageModule {

}
