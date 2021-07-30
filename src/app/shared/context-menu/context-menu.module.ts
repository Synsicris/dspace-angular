import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ContextMenuComponent } from './context-menu.component';
import { RequestCorrectionMenuComponent } from './request-correction/request-correction-menu.component';
import { EditItemMenuComponent } from './edit-item/edit-item-menu.component';
import { ExportItemMenuComponent } from './export-item/export-item-menu.component';
import { AuditItemMenuComponent } from './audit-item/audit-item-menu.component';
import { DsoPageEditMenuComponent } from './dso-page-edit/dso-page-edit-menu.component';
import { ExportCollectionMenuComponent } from './export-collection/export-collection-menu.component';
import { BulkImportMenuComponent } from './bulk-import/bulk-import-menu.component';
import { EditItemRelationshipsMenuComponent } from './edit-item-relationships/edit-item-relationships-menu.component';
import { ClaimItemMenuComponent } from './claim-item/claim-item-menu.component';
import { DeleteProjectMenuComponent } from './delete-project/delete-project-menu.component';
import { ProjectAdminInvitationMenuComponent } from './project-invitation/project-admin-invitation-menu.component';
import { ProjectMembersInvitationMenuComponent } from './project-members-invitation/project-members-invitation-menu.component';
import { GenerateReportMenuComponent } from './generate-report/generate-report-menu.component';
import { EasyOnlineImportMenuComponent } from './easy-online-import/easy-online-import-menu.component';

const COMPONENTS = [
  BulkImportMenuComponent,
  DsoPageEditMenuComponent,
  AuditItemMenuComponent,
  ContextMenuComponent,
  EditItemMenuComponent,
  ExportItemMenuComponent,
  ExportCollectionMenuComponent,
  EditItemRelationshipsMenuComponent,
  RequestCorrectionMenuComponent,
  ClaimItemMenuComponent,
  DeleteProjectMenuComponent,
  GenerateReportMenuComponent,
  ProjectAdminInvitationMenuComponent,
  ProjectMembersInvitationMenuComponent,
  EasyOnlineImportMenuComponent
];

const ENTRY_COMPONENTS = [
  BulkImportMenuComponent,
  DsoPageEditMenuComponent,
  AuditItemMenuComponent,
  EditItemMenuComponent,
  ExportItemMenuComponent,
  ExportCollectionMenuComponent,
  EditItemRelationshipsMenuComponent,
  ClaimItemMenuComponent,
  DeleteProjectMenuComponent,
  GenerateReportMenuComponent,
  ProjectAdminInvitationMenuComponent,
  ProjectMembersInvitationMenuComponent,
  EasyOnlineImportMenuComponent
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
