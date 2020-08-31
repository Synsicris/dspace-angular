import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoordinatorPageComponent } from './coordinator-page.component';
import { CoordinatorPageRoutingModule } from './coordinator-page.routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CoordinatorPageRoutingModule,
        TranslateModule
    ],
  declarations: [
    CoordinatorPageComponent
  ]
})
export class CoordinatorPageModule {
}
