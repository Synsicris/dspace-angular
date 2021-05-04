import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { ImpactPathwayBoardComponent } from './impact-pathway-board.component';
import { ImpactPathWayComponent } from './shared/impact-path-way/impact-path-way.component';
import { WrapperImpactPathWayComponent } from './wrapper-impact-path-way/wrapper-impact-path-way.component';
import { ImpactPathWayStepComponent } from './shared/impact-path-way/impact-path-way-step/impact-path-way-step.component';
import { ImpactPathWayTaskComponent } from './shared/impact-path-way/impact-path-way-task/impact-path-way-task.component';
import { StepColorDirective } from './shared/impact-path-way/impact-path-way-step/step.directive';
import { ObjectivesBoardComponent } from './objectives-board.component';
import { WrapperObjectivesComponent } from './wrapper-objectives/wrapper-objectives.component';
import { ObjectiveContainerComponent } from './wrapper-objectives/objective/container/objective-container.component';
import { ObjectiveComponent } from './wrapper-objectives/objective/objective.component';
import { NgxDomarrowModule } from 'ngx-domarrow';
import { ImpactPathwaySharedModule } from './shared/impact-pathway-shared.module';

const MODULES = [
  CommonModule,
  SharedModule,
  CoreModule.forRoot(),
  DragDropModule,
  NgxDomarrowModule,
  ImpactPathwaySharedModule
];

const COMPONENTS = [
  ImpactPathwayBoardComponent,
  ImpactPathWayComponent,
  ImpactPathWayStepComponent,
  ImpactPathWayTaskComponent,
  WrapperImpactPathWayComponent,
  ObjectivesBoardComponent,
  WrapperObjectivesComponent,
  ObjectiveComponent,
  ObjectiveContainerComponent,
];

const DIRECTIVES = [
  StepColorDirective
];

const ENTRY_COMPONENTS = [
];

const PROVIDERS = [
];

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
export class ImpactPathwayBoardModule {
}
