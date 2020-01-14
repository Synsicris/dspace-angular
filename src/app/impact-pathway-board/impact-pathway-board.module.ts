import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { CoreModule } from '../core/core.module';
import { ImpactPathwayBoardComponent } from './impact-pathway-board.component';
import { ImpactPathWayComponent } from './wrapper-impact-path-way/impact-path-way/impact-path-way.component';
import { WrapperImpactPathWayComponent } from './wrapper-impact-path-way/wrapper-impact-path-way.component';
import { ImpactPathWayStepComponent } from './wrapper-impact-path-way/impact-path-way/impact-path-way-step/impact-path-way-step.component';
import { ImpactPathWayTaskComponent } from './wrapper-impact-path-way/impact-path-way/impact-path-way-task/impact-path-way-task.component';
import { TaskColorDirective } from './wrapper-impact-path-way/impact-path-way/impact-path-way-task/task.directive';
import { ImpactPathwayService } from '../core/impact-pathway/impact-pathway.service';
import { SidebarImpactPathWayComponent } from './sidebar-impact-path-way/sidebar-impact-path-way.component';
import { SidebarPanelComponent } from './sidebar-impact-path-way/sidebar-panel/sidebar-panel.component';
import { SidebarPanelListComponent } from './sidebar-impact-path-way/sidebar-panel/sidebar-panel-list/sidebar-panel-list.component';
import { SidebarPanelViewComponent } from './sidebar-impact-path-way/sidebar-panel/sidebar-panel-view/sidebar-panel-view.component';
import { StepColorDirective } from './wrapper-impact-path-way/impact-path-way/impact-path-way-step/step.directive';
import { ExploitationPlanDirective } from './wrapper-impact-path-way/impact-path-way/impact-path-way-task/exploitation-plan.directive';
import { ImpactPathWayTaskModalComponent } from './wrapper-impact-path-way/impact-path-way/impact-path-way-task/impact-path-way-task-modal/impact-path-way-task-modal.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { SearchTaskComponent } from './search-task/search-task.component';
import { FilterBoxComponent } from './search-task/filter-box/filter-box.component';
import { SearchTaskService } from './search-task/search-task.service';
import { SearchBoxComponent } from './search-task/search-box/search-box.component';
import { SearchLabelsComponent } from './search-task/search-labels/search-labels.component';
import { DragAndDropContainerComponent } from './shared/drag-and-drop-container.component';

const MODULES = [
  CommonModule,
  SharedModule,
  CoreModule.forRoot(),
  DragDropModule
];

const COMPONENTS = [
  CreateTaskComponent,
  ImpactPathwayBoardComponent,
  DragAndDropContainerComponent,
  FilterBoxComponent,
  ImpactPathWayComponent,
  ImpactPathWayStepComponent,
  ImpactPathWayTaskComponent,
  WrapperImpactPathWayComponent,
  SearchBoxComponent,
  SearchLabelsComponent,
  SearchTaskComponent,
  SidebarImpactPathWayComponent,
  SidebarPanelComponent,
  SidebarPanelListComponent,
  SidebarPanelViewComponent
];

const DIRECTIVES = [
  ExploitationPlanDirective,
  StepColorDirective,
  TaskColorDirective
];

const ENTRY_COMPONENTS = [
  ImpactPathWayTaskModalComponent
];

const PROVIDERS = [
  ImpactPathwayService,
  SearchTaskService
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
