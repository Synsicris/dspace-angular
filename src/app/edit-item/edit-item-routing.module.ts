import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { PendingChangesGuard } from '../submission/edit/pending-changes/pending-changes.guard';
import { ThemedSubmissionEditComponent } from '../submission/edit/themed-submission-edit.component';
import { EditItemPageBreadcrumbResolver } from './edit-item-page-breadcrumb.resolver';
import { ItemDataService } from '../core/data/item-data.service';
import { EditItemPageBreadcrumbService } from './edit-item-page-breadcrumb.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: '',
            canActivate: [AuthenticatedGuard],
            canDeactivate: [PendingChangesGuard],
            component: ThemedSubmissionEditComponent,
            resolve: {
              breadcrumb: EditItemPageBreadcrumbResolver,
            },
            data: { breadcrumbKey: 'submission.edit.title',  title: 'submission.edit.title' }
          }
        ],
      }
    ])
  ],
  providers: [
    EditItemPageBreadcrumbResolver,
    EditItemPageBreadcrumbService,
    ItemDataService
  ]
})
export class EditItemRoutingModule {

}
