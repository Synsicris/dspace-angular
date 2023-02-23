import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QUESTIONS_BOARD_SERVICE } from '../questions-board/core/questions-board.service';
import { SectionsService } from '../submission/sections/sections.service';
import { SharedModule } from '../shared/shared.module';
import { QuestionsBoardModule } from '../questions-board/questions-board.module';
import { InterimReportPageRoutingModule } from './interim-report-page-routing.module';
import { InterimReportPageComponent } from './interim-report-page.component';
import { InterimReportService } from './interim-report.service';

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
      provide: QUESTIONS_BOARD_SERVICE,
      useClass: InterimReportService
    },
    SectionsService
  ]
})
export class InterimReportPageModule { }
