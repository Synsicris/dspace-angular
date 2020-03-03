import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { ResizableModule } from 'angular-resizable-element';

import { CoreModule } from '../core/core.module';
import { WorkpackageComponent } from './workpackage.component';

const MODULES = [
  CommonModule,
  SharedModule,
  CoreModule.forRoot(),
  DragDropModule,
  ResizableModule,
];

const COMPONENTS = [
  WorkpackageComponent
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
export class WorkpackageModule {
}
