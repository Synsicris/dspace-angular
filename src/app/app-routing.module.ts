import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthBlockingGuard } from './core/auth/auth-blocking.guard';

import { AuthenticatedGuard } from './core/auth/authenticated.guard';
import { SiteAdministratorGuard } from './core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import {
  ACCESS_CONTROL_MODULE_PATH,
  ADMIN_MODULE_PATH,
  BITSTREAM_MODULE_PATH,
  BULK_IMPORT_PATH,
  EDIT_ITEM_PATH,
  FORBIDDEN_PATH,
  FORGOT_PASSWORD_PATH,
  INFO_MODULE_PATH,
  INTERNAL_SERVER_ERROR,
  LEGACY_BITSTREAM_MODULE_PATH,
  PROFILE_MODULE_PATH,
  REGISTER_PATH,
  REQUEST_COPY_MODULE_PATH,
  WORKFLOW_ITEM_MODULE_PATH,
} from './app-routing-paths';
import { COLLECTION_MODULE_PATH } from './collection-page/collection-page-routing-paths';
import { COMMUNITY_MODULE_PATH } from './community-page/community-page-routing-paths';
import { ITEM_MODULE_PATH } from './item-page/item-page-routing-paths';
import { PROCESS_MODULE_PATH } from './process-page/process-page-routing.paths';
import { ReloadGuard } from './core/reload/reload.guard';
import { EndUserAgreementCurrentUserGuard } from './core/end-user-agreement/end-user-agreement-current-user.guard';
import { SiteRegisterGuard } from './core/data/feature-authorization/feature-authorization-guard/site-register.guard';
import { ThemedPageNotFoundComponent } from './pagenotfound/themed-pagenotfound.component';
import { ThemedForbiddenComponent } from './forbidden/themed-forbidden.component';
import { GroupAdministratorGuard } from './core/data/feature-authorization/feature-authorization-guard/group-administrator.guard';
import { ThemedPageInternalServerErrorComponent } from './page-internal-server-error/themed-page-internal-server-error.component';
import { ServerCheckGuard } from './core/server-check/server-check.guard';
import { SUGGESTION_MODULE_PATH } from './suggestions-page/suggestions-page-routing-paths';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: INTERNAL_SERVER_ERROR, component: ThemedPageInternalServerErrorComponent },
      {
        path: '',
        canActivate: [AuthBlockingGuard],
        canActivateChild: [ServerCheckGuard],
        children: [
          { path: '', redirectTo: '/coordinator-overview', pathMatch: 'full' },
          {
            path: 'reload/:rnd',
            component: ThemedPageNotFoundComponent,
            pathMatch: 'full',
            canActivate: [ReloadGuard]
          },
          { path: 'home', redirectTo: '/coordinator-overview', pathMatch: 'full' },
          {
            path: 'community-list',
            loadChildren: () => import('./community-list-page/community-list-page.module')
              .then((m) => m.CommunityListPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'id',
            loadChildren: () => import('./lookup-by-id/lookup-by-id.module')
              .then((m) => m.LookupIdModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'handle',
            loadChildren: () => import('./lookup-by-id/lookup-by-id.module')
              .then((m) => m.LookupIdModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: REGISTER_PATH,
            loadChildren: () => import('./register-page/register-page.module')
              .then((m) => m.RegisterPageModule),
            canActivate: [SiteRegisterGuard]
          },
          {
            path: FORGOT_PASSWORD_PATH,
            loadChildren: () => import('./forgot-password/forgot-password.module')
              .then((m) => m.ForgotPasswordModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: COMMUNITY_MODULE_PATH,
            loadChildren: () => import('./community-page/community-page.module')
              .then((m) => m.CommunityPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: COLLECTION_MODULE_PATH,
            loadChildren: () => import('./collection-page/collection-page.module')
              .then((m) => m.CollectionPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'entities/parentproject/:id/workingplan',
            loadChildren: () => import('./+working-plan-page/working-plan-page.module')
              .then((m) => m.WorkingPlanPageModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: ITEM_MODULE_PATH,
            loadChildren: () => import('./item-page/item-page.module')
              .then((m) => m.ItemPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'entities/:entity-type',
            loadChildren: () => import('./item-page/item-page.module')
              .then((m) => m.ItemPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: LEGACY_BITSTREAM_MODULE_PATH,
            loadChildren: () => import('./bitstream-page/bitstream-page.module')
              .then((m) => m.BitstreamPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: BITSTREAM_MODULE_PATH,
            loadChildren: () => import('./bitstream-page/bitstream-page.module')
              .then((m) => m.BitstreamPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'mydspace',
            loadChildren: () => import('./my-dspace-page/my-dspace-page.module')
              .then((m) => m.MyDSpacePageModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'search',
            loadChildren: () => import('./search-page/search-page-routing.module')
              .then((m) => m.SearchPageRoutingModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'browse',
            loadChildren: () => import('./browse-by/browse-by-page.module')
              .then((m) => m.BrowseByPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'explore',
            loadChildren: () => import('./+explore/explore.module')
              .then((m) => m.ExploreModule),
          },
          {
            path: ADMIN_MODULE_PATH,
            loadChildren: () => import('./admin/admin.module')
              .then((m) => m.AdminModule),
            canActivate: [SiteAdministratorGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'login',
            loadChildren: () => import('./login-page/login-page.module')
              .then((m) => m.LoginPageModule)
          },
          {
            path: 'logout',
            loadChildren: () => import('./logout-page/logout-page.module')
              .then((m) => m.LogoutPageModule)
          },
          {
            path: 'submit',
            loadChildren: () => import('./submit-page/submit-page.module')
              .then((m) => m.SubmitPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'import-external',
            loadChildren: () => import('./import-external-page/import-external-page.module')
              .then((m) => m.ImportExternalPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: 'workspaceitems',
            loadChildren: () => import('./workspaceitems-edit-page/workspaceitems-edit-page.module')
              .then((m) => m.WorkspaceitemsEditPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: WORKFLOW_ITEM_MODULE_PATH,
            loadChildren: () => import('./workflowitems-edit-page/workflowitems-edit-page.module')
              .then((m) => m.WorkflowItemsEditPageModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: EDIT_ITEM_PATH,
            loadChildren: () => import('./edit-item/edit-item.module')
              .then((m) => m.EditItemModule),
            canActivate: [EndUserAgreementCurrentUserGuard]
          },
          {
            path: PROFILE_MODULE_PATH,
            loadChildren: () => import('./profile-page/profile-page.module')
              .then((m) => m.ProfilePageModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: PROCESS_MODULE_PATH,
            loadChildren: () => import('./process-page/process-page.module')
              .then((m) => m.ProcessPageModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          { path: SUGGESTION_MODULE_PATH,
            loadChildren: () => import('./suggestions-page/suggestions-page.module')
              .then((m) => m.SuggestionsPageModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          { path: 'auditlogs',
            loadChildren: () => import('./audit-page/audit-page.module')
              .then((m) => m.AuditPageModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: BULK_IMPORT_PATH,
            loadChildren: () => import('./bulk-import/bulk-import-page.module')
              .then((m) => m.BulkImportPageModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: INFO_MODULE_PATH,
            loadChildren: () => import('./info/info.module').then((m) => m.InfoModule)
          },
          {
            path: REQUEST_COPY_MODULE_PATH,
            loadChildren: () => import('./request-copy/request-copy.module').then((m) => m.RequestCopyModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: FORBIDDEN_PATH,
            component: ThemedForbiddenComponent
          },
          { path: 'coordinator-overview',
            loadChildren: () => import('./coordinator-page/coordinator-page.module')
              .then((m) => m.CoordinatorPageModule)
          },
          {
            path: 'project-overview',
            loadChildren: () => import('./project-overview-page/project-overview-page.module')
              .then((m) => m.ProjectOverviewPageModule)
          },
          {
            path: 'statistics',
            loadChildren: () => import('./statistics-page/statistics-page-routing.module')
              .then((m) => m.StatisticsPageRoutingModule),
            canActivate: [SiteAdministratorGuard]
          },
          {
            path: ACCESS_CONTROL_MODULE_PATH,
            loadChildren: () => import('./access-control/access-control.module').then((m) => m.AccessControlModule),
            canActivate: [GroupAdministratorGuard],
          },
          {
            path: 'edit-item-relationships',
            loadChildren: () => import('./edit-item-relationships/edit-item-relationships.module')
              .then((m) => m.EditItemRelationshipsModule),
          },
          {
            path: 'subscriptions',
            loadChildren: () => import('./subscriptions-page/subscriptions-page-routing.module')
              .then((m) => m.SubscriptionsPageRoutingModule),
            canActivate: [AuthenticatedGuard]
          },
          {
            path: 'lucky-search',
            loadChildren: () => import('./lucky-search/lucky-search.module')
              .then((m) => m.LuckySearchModule)
          },
          {
            path: 'invitation',
            loadChildren: () => import('./invitation/invitation.module')
              .then((m) => m.InvitationModule)
          },
          { path: '**', pathMatch: 'full', component: ThemedPageNotFoundComponent },
        ]
      }
    ], {
      onSameUrlNavigation: 'reload',
})
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
