import { NgModule } from '@angular/core';
import { CdkTreeModule } from '@angular/cdk/tree';
import {
  MatButtonModule,
  MatButtonToggleModule, MatCardModule, MatCheckboxModule,
  MatDatepickerModule,
  MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule, MatSliderModule, MatToolbarModule,
  MatTreeModule
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

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
