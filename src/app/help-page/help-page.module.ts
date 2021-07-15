import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpPageComponent } from './help-page.component';
import { HelpPageRoutingModule } from './help-page-routing.module';
import { RouterModule } from '@angular/router';
import { HelpPageContentComponent } from './content/help-page-content.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    HelpPageComponent,
    HelpPageContentComponent
  ],
  imports: [
    CommonModule,
    HelpPageRoutingModule,
    RouterModule,
    TranslateModule,
    SharedModule
  ]
})
export class HelpPageModule { }
