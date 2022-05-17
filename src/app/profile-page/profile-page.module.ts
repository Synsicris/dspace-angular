import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ProfilePageRoutingModule } from './profile-page-routing.module';
import { ProfilePageComponent } from './profile-page.component';
import { ProfilePageMetadataFormComponent } from './profile-page-metadata-form/profile-page-metadata-form.component';
import { ProfilePageSecurityFormComponent } from './profile-page-security-form/profile-page-security-form.component';
import { ProfilePageResearcherFormComponent } from './profile-page-researcher-form/profile-page-researcher-form.component';
import { ThemedProfilePageComponent } from './themed-profile-page.component';
import { FormModule } from '../shared/form/form.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { OpenaireModule } from '../openaire/openaire.module';
import { ProfilePageResearcherFormSwitchComponent } from './profile-page-researcher-form/profile-page-researcher-form-switch/profile-page-researcher-form-switch.component';

@NgModule({
  imports: [
    ProfilePageRoutingModule,
    CommonModule,
    SharedModule,
    FormModule,
    UiSwitchModule,
    OpenaireModule
  ],
  exports: [
    ProfilePageComponent,
    ThemedProfilePageComponent,
    ProfilePageMetadataFormComponent,
    ProfilePageSecurityFormComponent,
    ProfilePageResearcherFormComponent
  ],
  declarations: [
    ProfilePageComponent,
    ThemedProfilePageComponent,
    ProfilePageMetadataFormComponent,
    ProfilePageSecurityFormComponent,
    ProfilePageResearcherFormComponent,
    ProfilePageResearcherFormSwitchComponent
  ]
})
export class ProfilePageModule {

}
