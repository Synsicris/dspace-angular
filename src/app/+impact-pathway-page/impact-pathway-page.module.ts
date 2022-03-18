import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ImpactPathwayPageComponent } from './impact-pathway-page.component';
import { ImpactPathwayPageRoutingModule } from './impact-pathway-page-routing.module';
import { ImpactPathwayBoardModule } from '../impact-pathway-board/impact-pathway-board.module';
import { ImpactPathwayCoreModule } from '../impact-pathway-board/core/impact-pathway-core.module';
import { ObjectivesPageComponent } from './objectives-page/objectives-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule.withEntryComponents(),
    ImpactPathwayPageRoutingModule,
    ImpactPathwayBoardModule,
    ImpactPathwayCoreModule
  ],
  declarations: [
    ImpactPathwayPageComponent,
    ObjectivesPageComponent
  ]
})
export class ImpactPathwayPageModule {

}
