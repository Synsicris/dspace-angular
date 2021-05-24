import { NgModule } from '@angular/core';

import { StoreConfig, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ObjectiveService } from './objective.service';
import { ImpactPathwayService } from './impact-pathway.service';
import { impactPathwayReducer, ImpactPathwayState } from './impact-pathway.reducer';
import { ImpactPathwayActions } from './impact-pathway.actions';
import { ImpactPathwayEffects } from './impact-pathway.effects';
import { StepColorDirective } from '../shared/impact-path-way/impact-path-way-step/step.directive';
import { storeModuleConfig } from '../../app.reducer';
import { ImpactPathwayLinksService } from './impact-pathway-links.service';

const MODULES = [
  StoreModule.forFeature('impactPathway', impactPathwayReducer, storeModuleConfig as StoreConfig<ImpactPathwayState, ImpactPathwayActions>),
  EffectsModule.forFeature([ImpactPathwayEffects]),
];

const COMPONENTS = [];

const DIRECTIVES = [
  StepColorDirective
];

const ENTRY_COMPONENTS = [];

const PROVIDERS = [
  ImpactPathwayService,
  ImpactPathwayLinksService,
  ObjectiveService
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
export class ImpactPathwayCoreModule {
}
