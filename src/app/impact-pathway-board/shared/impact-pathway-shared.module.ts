import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { DragAndDropContainerComponent } from './drag-and-drop-container.component';
import { EditableTextareaComponent } from './editable-textarea/editable-textarea.component';
import { CollapsablePanelComponent } from './collapsable-panel/collapsable-panel.component';

const MODULES = [
  CommonModule,
  SharedModule,
  CoreModule.forRoot(),
  DragDropModule
];

const COMPONENTS = [
  CollapsablePanelComponent,
  DragAndDropContainerComponent,
  EditableTextareaComponent
];

const DIRECTIVES = [
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
export class ImpactPathwaySharedModule {
}
