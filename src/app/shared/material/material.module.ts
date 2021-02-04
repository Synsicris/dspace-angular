import { NgModule } from '@angular/core';
import { CdkTreeModule } from '@angular/cdk/tree';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTreeModule } from '@angular/material/tree';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  exports: [
    CdkTreeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatToolbarModule,
    MatTreeModule,
    MatMomentDateModule,
    MatCardModule,
    MatProgressBarModule,
    MatCheckboxModule
  ]
})
export class MaterialModule {
}
