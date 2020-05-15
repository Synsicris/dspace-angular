import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { AuthenticatedGuard } from './core/auth/authenticated.guard';
import { DSpaceObject } from './core/shared/dspace-object.model';
import { Community } from './core/shared/community.model';
import { getCommunityPageRoute } from './+community-page/community-page-routing.module';
import { Collection } from './core/shared/collection.model';
import { Item } from './core/shared/item.model';
import { getItemPageRoute } from './+item-page/item-page-routing.module';
import { getCollectionPageRoute } from './+collection-page/collection-page-routing.module';

const ITEM_MODULE_PATH = 'items';

export function getItemModulePath() {
  return `/${ITEM_MODULE_PATH}`;
}

const COLLECTION_MODULE_PATH = 'collections';

export function getCollectionModulePath() {
  return `/${COLLECTION_MODULE_PATH}`;
}

const COMMUNITY_MODULE_PATH = 'communities';

export function getCommunityModulePath() {
  return `/${COMMUNITY_MODULE_PATH}`;
}
const BITSTREAM_MODULE_PATH = 'bitstreams';
export function getBitstreamModulePath() {
  return `/${BITSTREAM_MODULE_PATH}`;
}

const ADMIN_MODULE_PATH = 'admin';

export function getAdminModulePath() {
  return `/${ADMIN_MODULE_PATH}`;
}

const PROFILE_MODULE_PATH = 'profile';

export function getProfileModulePath() {
  return `/${PROFILE_MODULE_PATH}`;
}

export function getDSOPath(dso: DSpaceObject): string {
  switch ((dso as any).type) {
    case Community.type.value:
      return getCommunityPageRoute(dso.uuid);
    case Collection.type.value:
      return getCollectionPageRoute(dso.uuid);
    case Item.type.value:
      return getItemPageRoute(dso.uuid);
  }
}

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: '/coordinator-overview', pathMatch: 'full' },
      // { path: 'home', loadChildren: './+home-page/home-page.module#HomePageModule', data: { showBreadcrumbs: false } },
      { path: 'home', redirectTo: '/coordinator-overview', pathMatch: 'full' },
      { path: 'community-list', loadChildren: './community-list-page/community-list-page.module#CommunityListPageModule' },
      { path: 'id', loadChildren: './+lookup-by-id/lookup-by-id.module#LookupIdModule' },
      { path: 'handle', loadChildren: './+lookup-by-id/lookup-by-id.module#LookupIdModule' },
      { path: COMMUNITY_MODULE_PATH, loadChildren: './+community-page/community-page.module#CommunityPageModule' },
      { path: COLLECTION_MODULE_PATH, loadChildren: './+collection-page/collection-page.module#CollectionPageModule' },
      { path: ITEM_MODULE_PATH, loadChildren: './+item-page/item-page.module#ItemPageModule' },
      { path: BITSTREAM_MODULE_PATH, loadChildren: './+bitstream-page/bitstream-page.module#BitstreamPageModule' },
      {
        path: 'mydspace',
        loadChildren: './+my-dspace-page/my-dspace-page.module#MyDSpacePageModule',
        canActivate: [AuthenticatedGuard]
      },
      { path: 'search', loadChildren: './+search-page/search-page.module#SearchPageModule' },
      { path: 'browse', loadChildren: './+browse-by/browse-by.module#BrowseByModule'},
      { path: ADMIN_MODULE_PATH, loadChildren: './+admin/admin.module#AdminModule', canActivate: [AuthenticatedGuard] },
      { path: 'login', loadChildren: './+login-page/login-page.module#LoginPageModule' },
      { path: 'logout', loadChildren: './+logout-page/logout-page.module#LogoutPageModule' },
      { path: 'submit', loadChildren: './+submit-page/submit-page.module#SubmitPageModule' },
      {
        path: 'workspaceitems',
        loadChildren: './+workspaceitems-edit-page/workspaceitems-edit-page.module#WorkspaceitemsEditPageModule'
      },
      {
        path: 'workflowitems',
        loadChildren: './+workflowitems-edit-page/workflowitems-edit-page.module#WorkflowItemsEditPageModule'
      },
      { path: 'impactpathway', loadChildren: './+impact-pathway-page/impact-pathway-page.module#ImpactPathwayPageModule' },
      { path: 'objectives', loadChildren: './+objectives-page/objectives-page.module#ObjectivesPageModule' },
      { path: 'workingplan', loadChildren: './+working-plan-page/working-plan-page.module#WorkingPlanPageModule' },
      {
        path: PROFILE_MODULE_PATH,
        loadChildren: './profile-page/profile-page.module#ProfilePageModule', canActivate: [AuthenticatedGuard]
      },
      { path: 'coordinator-overview', loadChildren: './coordinator-page/coordinator-page.module#CoordinatorPageModule' },
      {
        path: 'project-overview',
        loadChildren: './project-overview-page/project-overview-page.module#ProjectOverviewPageModule'
      },
      { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
    ],
    {
      onSameUrlNavigation: 'reload',
    })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
