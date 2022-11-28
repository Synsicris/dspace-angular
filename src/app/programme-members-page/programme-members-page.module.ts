import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ProgrammeMembersPageComponent } from './programme-members-page.component';
import { ProgrammeMembersComponent } from './programme-members/programme-members.component';
import { SharedModule } from '../shared/shared.module';
import { AccessControlModule } from '../access-control/access-control.module';
import { ProgrammeMembersPageRoutingModule } from './programme-members-page-routing.module';

@NgModule({
  declarations: [
    ProgrammeMembersPageComponent,
    ProgrammeMembersComponent
  ],
  imports: [
    CommonModule,
    ProgrammeMembersPageRoutingModule,
    AccessControlModule,
    NgbNavModule,
    SharedModule,
    TranslateModule
  ]
})
export class ProgrammeMembersPageModule { }
