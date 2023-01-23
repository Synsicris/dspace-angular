import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StoreConfig, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ResizableModule } from 'angular-resizable-element';

import { CoreModule } from '../core/core.module';
import { WorkingPlanComponent } from './working-plan.component';
import { WorkingPlanChartComponent } from './working-plan-chart/working-plan-chart.component';
import { WorkingPlanChartToolbarComponent } from './working-plan-chart/toolbar/working-plan-chart-toolbar.component';
import { WorkingPlanChartContainerComponent } from './working-plan-chart/container/working-plan-chart-container.component';
import { MyDSpacePageModule } from '../my-dspace-page/my-dspace-page.module';
import { WorkpackageStatusDirective } from './working-plan-chart/container/workpackage-status.directive';
import { storeModuleConfig } from '../app.reducer';
import { WorkingPlanEffects } from './core/working-plan.effects';
import { workingPlanReducer, WorkingPlanState } from './core/working-plan.reducer';
import { WorkingPlanActions } from './core/working-plan.actions';
import { WorkingPlanService } from './core/working-plan.service';
import { WorkingPlanStateService } from './core/working-plan-state.service';
import { ProjectItemService } from '../core/project/project-item.service';
import { CreateSimpleItemModule } from '../shared/create-simple-item-modal/create-simple-item.module';
import { ComcolModule } from '../shared/comcol/comcol.module';
import { EditSimpleItemModalModule } from '../shared/edit-simple-item-modal/edit-simple-item-modal.module';
import { WorkingPlanChartDatesComponent } from './working-plan-chart/container/working-plan-chart-dates/working-plan-chart-dates.component';
import { WorkingPlanChartItemEditButtonComponent } from './working-plan-chart/container/working-plan-chart-item-edit-button/working-plan-chart-item-edit-button.component';
import { WorkingPlanChartItemDeleteButtonComponent } from './working-plan-chart/container/working-plan-chart-item-delete-button/working-plan-chart-item-delete-button.component';

const MODULES = [
  CommonModule,
  SharedModule,
  CoreModule.forRoot(),
  MyDSpacePageModule,
  ResizableModule,
  StoreModule.forFeature('workingplan', workingPlanReducer, storeModuleConfig as StoreConfig<WorkingPlanState, WorkingPlanActions>),
  EffectsModule.forFeature([WorkingPlanEffects]),
  CreateSimpleItemModule,
  EditSimpleItemModalModule,
  ComcolModule
];

const COMPONENTS = [
  WorkingPlanComponent,
  WorkingPlanChartComponent,
  WorkingPlanChartContainerComponent,
  WorkingPlanChartDatesComponent,
  WorkingPlanChartToolbarComponent,
  WorkingPlanChartItemEditButtonComponent,
  WorkingPlanChartItemDeleteButtonComponent
];

const DIRECTIVES = [
  WorkpackageStatusDirective
];

const ENTRY_COMPONENTS = [
];

const PROVIDERS = [
  WorkingPlanService,
  WorkingPlanStateService,
  ProjectItemService
];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...ENTRY_COMPONENTS,
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
