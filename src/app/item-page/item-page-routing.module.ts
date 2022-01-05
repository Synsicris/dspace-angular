import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemPageResolver } from './item-page.resolver';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { ItemBreadcrumbResolver } from '../core/breadcrumbs/item-breadcrumb.resolver';
import { VersionResolver } from './version-page/version.resolver';
import { DSOBreadcrumbsService } from '../core/breadcrumbs/dso-breadcrumbs.service';
import { LinkService } from '../core/cache/builders/link.service';
import { UploadBitstreamComponent } from './bitstreams/upload/upload-bitstream.component';
import { EASY_ONLINE_PATH, ITEM_EDIT_PATH, UPLOAD_BITSTREAM_PATH } from './item-page-routing-paths';
import { ItemPageAdministratorGuard } from './item-page-administrator.guard';
import { MenuItemType } from '../shared/menu/initial-menus-state';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { ThemedItemPageComponent } from './simple/themed-item-page.component';
import { ThemedFullItemPageComponent } from './full/themed-full-item-page.component';
import { VersionPageComponent } from './version-page/version-page/version-page.component';
import { BitstreamRequestACopyPageComponent } from '../shared/bitstream-request-a-copy-page/bitstream-request-a-copy-page.component';
import { CrisItemPageTabResolver } from '../cris-item-page/cris-item-page-tab.resolver';
import { REQUEST_COPY_MODULE_PATH } from '../app-routing-paths';
import { EndUserAgreementCurrentUserGuard } from '../core/end-user-agreement/end-user-agreement-current-user.guard';
import { ProjectCommunityByItemResolver } from '../core/project/project-community-by-item.resolver';
import { ProjectItemBreadcrumbResolver } from '../core/breadcrumbs/project-item-breadcrumb.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: 'managemembers',
            loadChildren: () => import('../project-members-page/project-members-page.module')
              .then((m) => m.ProjectMembersPageModule),
            canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard]
          },
          {
            path: '',
            resolve: {
              dso: ItemPageResolver,
              project: ProjectCommunityByItemResolver,
              breadcrumb: ProjectItemBreadcrumbResolver,
              tabs: CrisItemPageTabResolver
            },
            component: ThemedItemPageComponent,
            pathMatch: 'full',
          },
          {
            path: 'full',
            resolve: {
              dso: ItemPageResolver,
              project: ProjectCommunityByItemResolver,
              breadcrumb: ProjectItemBreadcrumbResolver,
              tabs: CrisItemPageTabResolver
            },
            component: ThemedFullItemPageComponent,
          },
          {
            path: ITEM_EDIT_PATH,
            loadChildren: () => import('./edit-item-page/edit-item-page.module')
              .then((m) => m.EditItemPageModule),
            resolve: {
              dso: ItemPageResolver,
              breadcrumb: ItemBreadcrumbResolver,
              tabs: CrisItemPageTabResolver
            },
            canActivate: [ItemPageAdministratorGuard],
            data: { title: 'submission.edit.title' }
          },
          {
            path: UPLOAD_BITSTREAM_PATH,
            resolve: {
              dso: ItemPageResolver,
              breadcrumb: ItemBreadcrumbResolver,
              tabs: CrisItemPageTabResolver
            },
            component: UploadBitstreamComponent,
            canActivate: [AuthenticatedGuard]
          },
          {
            path: REQUEST_COPY_MODULE_PATH,
            component: BitstreamRequestACopyPageComponent,
          },
          {
            path: EASY_ONLINE_PATH,
            loadChildren: () => import('../easy-online-import-page/easy-online-import-page.module')
              .then((m) => m.EasyOnlineImportPageModule)
          }
        ],
        data: {
          menu: {
            public: [{
              id: 'statistics_item_:id',
              active: true,
              visible: true,
              model: {
                type: MenuItemType.LINK,
                text: 'menu.section.statistics',
                link: 'statistics/items/:id/',
              } as LinkMenuItemModel,
            }],
          },
          showSocialButtons: true
        },
      },
      {
        path: 'version',
        children: [
          {
            path: ':id',
            component: VersionPageComponent,
            resolve: {
              dso: VersionResolver,
            },
          }
        ],
      }
    ])
  ],
  providers: [
    ItemPageResolver,
    ItemBreadcrumbResolver,
    DSOBreadcrumbsService,
    LinkService,
    ItemPageAdministratorGuard,
    VersionResolver,
  ]

})
export class ItemPageRoutingModule {

}
