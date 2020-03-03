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
import { CollapsablePanelComponent } from './shared/collapsable-panel/collapsable-panel.component';
import { StepColorDirective } from './shared/impact-path-way/impact-path-way-step/step.directive';
import { ExploitationPlanDirective } from './shared/impact-path-way/impact-path-way-task/exploitation-plan.directive';
import { DragAndDropContainerComponent } from './shared/drag-and-drop-container.component';
import { ObjectivesBoardComponent } from './objectives-board.component';
import { WrapperObjectivesComponent } from './wrapper-objectives/wrapper-objectives.component';
import { ObjectiveContainerComponent } from './wrapper-objectives/objective/container/objective-container.component';
import { ObjectiveComponent } from './wrapper-objectives/objective/objective.component';
import { EditableTextareaComponent } from './shared/editable-textarea/editable-textarea.component';
import { NgxDomarrowModule } from 'ngx-domarrow';

const MODULES = [
  CommonModule,
  SharedModule,
  CoreModule.forRoot(),
  DragDropModule,
  NgxDomarrowModule
];

const COMPONENTS = [
  ImpactPathwayBoardComponent,
  DragAndDropContainerComponent,
  ImpactPathWayComponent,
  ImpactPathWayStepComponent,
  ImpactPathWayTaskComponent,
  WrapperImpactPathWayComponent,
  CollapsablePanelComponent,
  ObjectivesBoardComponent,
  WrapperObjectivesComponent,
  ObjectiveComponent,
  ObjectiveContainerComponent,
  EditableTextareaComponent
];

const DIRECTIVES = [
  ExploitationPlanDirective,
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
