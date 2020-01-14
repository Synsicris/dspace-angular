import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ImpactPathwayPageComponent } from './impact-pathway-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: ImpactPathwayPageComponent, pathMatch: 'full', data: { title: 'home.title' } }
    ])
  ]
})
export class ImpactPathwayPageRoutingModule { }
