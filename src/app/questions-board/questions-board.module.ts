import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectsModule } from '@ngrx/effects';
import { StoreConfig, StoreModule } from '@ngrx/store';

import { QuestionsBoardComponent } from './questions-board.component';
import { QuestionsBoardService } from './core/questions-board.service';
import { QuestionsBoardStateService } from './core/questions-board-state.service';
import { QuestionsBoardEffects } from './core/questions-board-effects.service';
import { storeModuleConfig } from '../app.reducer';
import { questionsBoardReducer, QuestionsBoardState } from './core/questions-board.reducer';
import { QuestionsBoardActions } from './core/questions-board.actions';
import { SharedModule } from '../shared/shared.module';
import { QuestionsBoardStepComponent } from './steps/questions-board-step.component';
import { ImpactPathwaySharedModule } from '../impact-pathway-board/shared/impact-pathway-shared.module';
import { QuestionsBoardDirective } from './core/questions-board.directive';
import { QuestionsBoardStepContainerComponent } from './steps/container/questions-board-step-container.component';
import { QuestionsBoardTaskComponent } from './steps/tasks/questions-board-task.component';
import { ProjectItemService } from '../core/project/project-item.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CreateSimpleItemModule } from '../shared/create-simple-item-modal/create-simple-item.module';
import { ComcolModule } from '../shared/comcol/comcol.module';
import { ViewSimpleItemFormModule } from '../shared/view-simple-item-form/view-simple-item-form.module';
import { EditSimpleItemModalModule } from '../shared/edit-simple-item-modal/edit-simple-item-modal.module';
import { CommentsModule } from '../shared/comments/comments.module';

const MODULES = [
  CommonModule,
  StoreModule.forFeature('exploitationPlan', questionsBoardReducer, storeModuleConfig as StoreConfig<QuestionsBoardState, QuestionsBoardActions>),
  EffectsModule.forFeature([QuestionsBoardEffects]),
  SharedModule,
  ImpactPathwaySharedModule,
  DragDropModule,
  CreateSimpleItemModule,
  ComcolModule,
  EditSimpleItemModalModule,
  ViewSimpleItemFormModule,
  CommentsModule
];

const COMPONENTS = [
  QuestionsBoardComponent,
  QuestionsBoardStepComponent,
  QuestionsBoardStepContainerComponent,
  QuestionsBoardTaskComponent
];
const PROVIDERS = [
  QuestionsBoardService,
  QuestionsBoardStateService,
  ProjectItemService
];

const ENTRY_COMPONENTS = [];

const DIRECTIVES = [
  QuestionsBoardDirective
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
  exports: [
    ...COMPONENTS,
    ...DIRECTIVES
  ]
})
export class QuestionsBoardModule { }
