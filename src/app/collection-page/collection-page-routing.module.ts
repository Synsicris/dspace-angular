import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CollectionPageResolver } from './collection-page.resolver';
import { CreateCollectionPageComponent } from './create-collection-page/create-collection-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { CreateCollectionPageGuard } from './create-collection-page/create-collection-page.guard';
import { DeleteCollectionPageComponent } from './delete-collection-page/delete-collection-page.component';
import { EditItemTemplatePageComponent } from './edit-item-template-page/edit-item-template-page.component';
import { ItemTemplatePageResolver } from './edit-item-template-page/item-template-page.resolver';
import { ProjectCollectionBreadcrumbResolver } from '../core/breadcrumbs/project-collection-breadcrumb.resolver';
import { DSOBreadcrumbsService } from '../core/breadcrumbs/dso-breadcrumbs.service';
import { LinkService } from '../core/cache/builders/link.service';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { COLLECTION_CREATE_PATH, COLLECTION_EDIT_PATH, ITEMTEMPLATE_PATH } from './collection-page-routing-paths';
import { CollectionPageAdministratorGuard } from './collection-page-administrator.guard';
import { MenuItemType } from '../shared/menu/initial-menus-state';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { ThemedCollectionPageComponent } from './themed-collection-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: COLLECTION_CREATE_PATH,
        component: CreateCollectionPageComponent,
        canActivate: [AuthenticatedGuard, CreateCollectionPageGuard]
      },
      {
        path: ':id',
        resolve: {
          dso: CollectionPageResolver,
          breadcrumb: ProjectCollectionBreadcrumbResolver
        },
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: COLLECTION_EDIT_PATH,
            loadChildren: () => import('./edit-collection-page/edit-collection-page.module')
              .then((m) => m.EditCollectionPageModule),
            canActivate: [CollectionPageAdministratorGuard]
          },
          {
            path: 'delete',
            pathMatch: 'full',
            component: DeleteCollectionPageComponent,
            canActivate: [AuthenticatedGuard],
          },
          {
            path: ITEMTEMPLATE_PATH,
            component: EditItemTemplatePageComponent,
            canActivate: [AuthenticatedGuard],
            resolve: {
              item: ItemTemplatePageResolver,
              breadcrumb: I18nBreadcrumbResolver
            },
            data: { title: 'collection.edit.template.title', breadcrumbKey: 'collection.edit.template' }
          },
          {
            path: '',
            component: ThemedCollectionPageComponent,
            pathMatch: 'full',
          }
        ],
        data: {
          menu: {
            public: [{
              id: 'statistics_collection_:id',
              active: true,
              visible: true,
              model: {
                type: MenuItemType.LINK,
                text: 'menu.section.statistics',
                link: 'statistics/collections/:id/',
              } as LinkMenuItemModel,
            }],
          },
        },
      },
    ])
  ],
  providers: [
    CollectionPageResolver,
    ItemTemplatePageResolver,
    ProjectCollectionBreadcrumbResolver,
    DSOBreadcrumbsService,
    LinkService,
    CreateCollectionPageGuard,
    CollectionPageAdministratorGuard
  ]
})
export class CollectionPageRoutingModule {

}
