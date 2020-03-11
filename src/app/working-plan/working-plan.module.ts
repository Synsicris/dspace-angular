import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ResizableModule } from 'angular-resizable-element';

import { CoreModule } from '../core/core.module';
import { WorkingPlanComponent } from './working-plan.component';
import { WorkingPlanChartComponent } from './working-plan-chart/working-plan-chart.component';
import { WorkingPlanChartToolbarComponent } from './working-plan-chart/toolbar/working-plan-chart-toolbar.component';
import { WorkingPlanChartContainerComponent } from './working-plan-chart/container/working-plan-chart-container.component';
import { MyDSpacePageModule } from '../+my-dspace-page/my-dspace-page.module';
import { WorkpackageStatusDirective } from './working-plan-chart/container/workpackage-status.directive';

const MODULES = [
  CommonModule,
  SharedModule,
  CoreModule.forRoot(),
  MyDSpacePageModule,
  ResizableModule
];

const COMPONENTS = [
  WorkingPlanComponent,
  WorkingPlanChartComponent,
  WorkingPlanChartContainerComponent,
  WorkingPlanChartToolbarComponent
];

const DIRECTIVES = [
  WorkpackageStatusDirective
];

const ENTRY_COMPONENTS = [
];

const PROVIDERS = [];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...ENTRY_COMPONENTS
  ],
  providers: [
    ...PROVIDERS
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ],
  exports: [
    ...COMPONENTS,
    ...DIRECTIVES
  ]
})

/**
 * This module handles all components and pipes that are necessary for the horizontal navigation bar
 */
export class WorkingPlanModule {
}
