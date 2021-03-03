import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ImpactPathwayBoardModule } from '../impact-pathway-board/impact-pathway-board.module';
import { SubProjectPageRoutingModule } from './sub-project-page-routing.module';
import { SubProjectPageComponent } from './sub-project-page.component';
import { SubProjectPageHeaderComponent } from './header/sub-project-page-header.component';
import { SubProjectPageContentComponent } from './content/sub-project-page-content.component';
import { ContextMenuModule } from '../shared/context-menu/context-menu.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SubProjectPageRoutingModule,
    ImpactPathwayBoardModule,
    ContextMenuModule
  ],
  declarations: [
    SubProjectPageComponent,
    SubProjectPageContentComponent,
    SubProjectPageHeaderComponent
  ]
})
export class SubProjectPageModule {

}
