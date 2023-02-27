import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QUESTIONS_BOARD_CONFIG } from '../questions-board/core/questions-board.service';
import { SectionsService } from '../submission/sections/sections.service';
import { SharedModule } from '../shared/shared.module';
import { QuestionsBoardModule } from '../questions-board/questions-board.module';
import { InterimReportPageRoutingModule } from './interim-report-page-routing.module';
import { InterimReportPageComponent } from './interim-report-page.component';

@NgModule({
  declarations: [
    InterimReportPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule.withEntryComponents(),
    InterimReportPageRoutingModule,
    QuestionsBoardModule
  ],
  providers: [
    {
      provide: QUESTIONS_BOARD_CONFIG,
      useValue: 'interimReport'
    },
    SectionsService
  ]
})
export class InterimReportPageModule { }
