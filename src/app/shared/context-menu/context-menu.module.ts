import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ContextMenuComponent } from './context-menu.component';
import { EditItemMenuComponent } from './edit-item/edit-item-menu.component';
import { ExportItemMenuComponent } from './export-item/export-item-menu.component';
import { AuditItemMenuComponent } from './audit-item/audit-item-menu.component';
import { DsoPageEditMenuComponent } from './dso-page-edit/dso-page-edit-menu.component';
import { ExportCollectionMenuComponent } from './export-collection/export-collection-menu.component';
import { BulkImportMenuComponent } from './bulk-import/bulk-import-menu.component';
import { DeleteProjectMenuComponent } from './delete-project/delete-project-menu.component';
import { ProjectAdminInvitationMenuComponent } from './project-invitation/project-admin-invitation-menu.component';
import { ProjectMembersInvitationMenuComponent } from './project-members-invitation/project-members-invitation-menu.component';
import { GenerateReportMenuComponent } from './generate-report/generate-report-menu.component';

const COMPONENTS = [
  BulkImportMenuComponent,
  DsoPageEditMenuComponent,
  AuditItemMenuComponent,
  ContextMenuComponent,
  EditItemMenuComponent,
  ExportItemMenuComponent,
  ExportCollectionMenuComponent,
  DeleteProjectMenuComponent,
  GenerateReportMenuComponent,
  ProjectAdminInvitationMenuComponent,
  ProjectMembersInvitationMenuComponent
];

const ENTRY_COMPONENTS = [
  BulkImportMenuComponent,
  DsoPageEditMenuComponent,
  AuditItemMenuComponent,
  EditItemMenuComponent,
  ExportItemMenuComponent,
  ExportCollectionMenuComponent,
  DeleteProjectMenuComponent,
  GenerateReportMenuComponent,
  ProjectAdminInvitationMenuComponent,
  ProjectMembersInvitationMenuComponent
];

const MODULE = [
  CommonModule,
  NgbDropdownModule,
  RouterModule,
  TranslateModule
];
@NgModule({
  imports: [
    MODULE
  ],
  declarations: [
    COMPONENTS
  ],
  exports: [
    COMPONENTS
  ],
  entryComponents: [
    ENTRY_COMPONENTS
  ]
})
export class ContextMenuModule {

}
