import { CreateItemSubmissionModalModule } from './../shared/create-item-submission-modal/create-item-submission-modal.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { NgxDomarrowModule } from 'ngx-domarrow';

import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { ImpactPathwayBoardComponent } from './impact-pathway-board.component';
import { ImpactPathWayComponent } from './shared/impact-path-way/impact-path-way.component';
import { WrapperImpactPathWayComponent } from './wrapper-impact-path-way/wrapper-impact-path-way.component';
import { ImpactPathWayStepComponent } from './shared/impact-path-way/impact-path-way-step/impact-path-way-step.component';
import { ImpactPathWayTaskComponent } from './shared/impact-path-way/impact-path-way-task/impact-path-way-task.component';
import { ObjectivesBoardComponent } from './objectives-board.component';
import { WrapperObjectivesComponent } from './wrapper-objectives/wrapper-objectives.component';
import { ObjectiveContainerComponent } from './wrapper-objectives/objective/container/objective-container.component';
import { ObjectiveComponent } from './wrapper-objectives/objective/objective.component';
import { ImpactPathwaySharedModule } from './shared/impact-pathway-shared.module';
import { ImpactPathwayCoreModule } from './core/impact-pathway-core.module';
import { CreateSimpleItemModule } from '../shared/create-simple-item-modal/create-simple-item.module';
import { ComcolModule } from '../shared/comcol/comcol.module';
import { EditSimpleItemModalModule } from '../shared/edit-simple-item-modal/edit-simple-item-modal.module';
import { ItemDetailPageModalModule } from '../item-detail-page-modal/item-detail-page-modal.module';

const MODULES = [
  CommonModule,
  SharedModule,
  CoreModule.forRoot(),
  DragDropModule,
  NgxDomarrowModule,
  ImpactPathwaySharedModule,
  ImpactPathwayCoreModule,
  CreateSimpleItemModule,
  EditSimpleItemModalModule,
  ComcolModule,
  ItemDetailPageModalModule,
  CreateItemSubmissionModalModule
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

const DIRECTIVES = [];

const ENTRY_COMPONENTS = [];

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
export class ImpactPathwayBoardModule {
}
