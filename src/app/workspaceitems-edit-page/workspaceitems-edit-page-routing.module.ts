import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ThemedSubmissionEditComponent } from '../submission/edit/themed-submission-edit.component';
import { PendingChangesGuard } from '../submission/edit/pending-changes/pending-changes.guard';
import { WorkspaceItemsEditPageBreadrumbResolver } from './workspace-items-edit-page-breadrumb-resolver.service';
import { WorkspaceItemsEditPageBreadcumbService } from './workspace-items-edit-page-breadcumb.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      {
        canActivate: [AuthenticatedGuard],
        canDeactivate: [PendingChangesGuard],
        path: ':id/edit',
        component: ThemedSubmissionEditComponent,
        resolve: {
         breadcrumb: WorkspaceItemsEditPageBreadrumbResolver
        },
        data: { title: 'submission.edit.title', breadcrumbKey: 'submission.edit' }
      }
    ])
  ],
  providers: [
    WorkspaceItemsEditPageBreadrumbResolver,
    WorkspaceItemsEditPageBreadcumbService
  ]
})
/**
 * This module defines the default component to load when navigating to the workspaceitems edit page path
 */
export class WorkspaceitemsEditPageRoutingModule { }
