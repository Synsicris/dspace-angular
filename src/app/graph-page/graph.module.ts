import { NgModule } from '@angular/core';

import { GraphRoutingModule } from './graph-routing.module';
import { GraphPageComponent } from './graph-page.component';
import { GraphComponent } from './graph/graph.component';
import { ChartsModule } from '../charts/charts.module';
import { SharedModule } from '../shared/shared.module';

const COMPONENTS = [
  GraphPageComponent,
  GraphComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    GraphRoutingModule,
    ChartsModule.withEntryComponents(),
    SharedModule
  ]
})
export class GraphModule { }
