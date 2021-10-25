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
import { StatisticsMenuComponent } from './statistics/statistics-menu.component';
import { SubscriptionMenuComponent } from './subscription/subscription-menu.component';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { DeleteProjectMenuComponent } from './delete-project/delete-project-menu.component';
import { ProjectAdminInvitationMenuComponent } from './project-invitation/project-admin-invitation-menu.component';
import { ProjectMembersInvitationMenuComponent } from './project-members-invitation/project-members-invitation-menu.component';
import { GenerateReportMenuComponent } from './generate-report/generate-report-menu.component';
import { EasyOnlineImportMenuComponent } from './easy-online-import/easy-online-import-menu.component';
import { CreateProjectMenuComponent } from './create-project/create-project-menu.component';
import { ViewProjectItemsMenuComponent } from './view-project-items/view-project-items-menu.component';

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
  StatisticsMenuComponent,
  SubscriptionMenuComponent,
  DeleteProjectMenuComponent,
  GenerateReportMenuComponent,
  ProjectAdminInvitationMenuComponent,
  ProjectMembersInvitationMenuComponent,
  EasyOnlineImportMenuComponent,
  CreateProjectMenuComponent,
  ViewProjectItemsMenuComponent
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
  StatisticsMenuComponent,
  SubscriptionMenuComponent,
  DeleteProjectMenuComponent,
  GenerateReportMenuComponent,
  ProjectAdminInvitationMenuComponent,
  ProjectMembersInvitationMenuComponent,
  EasyOnlineImportMenuComponent,
  CreateProjectMenuComponent,
  ViewProjectItemsMenuComponent
];

const MODULE = [
  CommonModule,
  NgbDropdownModule,
  RouterModule,
  TranslateModule,
  SubscriptionsModule
];
@NgModule({
  imports: [
    MODULE,
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
