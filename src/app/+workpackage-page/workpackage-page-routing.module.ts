import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WorkpackageComponent } from '../workpackage/workpackage.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: WorkpackageComponent, pathMatch: 'full', data: { title: 'chart.title' } },
    ])
  ]
})
export class WorkpackagePageRoutingModule { }
