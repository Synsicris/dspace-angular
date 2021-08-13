import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EasyOnlineImportComponent } from './easy-online-import/easy-online-import.component';
import { SharedModule } from '../shared/shared.module';
import { EasyOnlineImportPageComponent } from './easy-online-import-page.component';
import { EasyOnlineImportService } from '../core/easy-online-import/easy-online-import.service';
import { EasyOnlineImportRoutingModule } from './easy-online-import.routing.module';
import { EasyOnlineImportResultComponent } from './easy-online-import-result/easy-online-import-result.component';

@NgModule({
  declarations: [
    EasyOnlineImportComponent,
    EasyOnlineImportPageComponent,
    EasyOnlineImportResultComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EasyOnlineImportRoutingModule
  ],
  providers: [
    EasyOnlineImportService
  ]
})
export class EasyOnlineImportPageModule { }
