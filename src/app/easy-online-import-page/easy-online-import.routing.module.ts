import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EasyOnlineImportPageComponent } from './easy-online-import-page.component';
import { ItemPageResolver } from '../item-page/item-page.resolver';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { EasyOnlineImportGuard } from '../core/easy-online-import/easy-online-import.guard';
import { SubprojectItemI18nBreadcrumbResolver } from '../core/breadcrumbs/subproject-item-i18n-breadcrumb.resolver';
import { SubprojectItemI18nBreadcrumbsService } from '../core/breadcrumbs/subproject-item-i18n-breadcrumbs.service';

/**
 * Routing module that handles the routing for the Edit Item page administrator functionality
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        resolve: {
          dso: ItemPageResolver,
          breadcrumb: SubprojectItemI18nBreadcrumbResolver
        },
        data: { breadcrumbKey: 'easy-online-import.title', title: 'easy-online-import.title' },
        component: EasyOnlineImportPageComponent,
        canActivate: [
          AuthenticatedGuard, EasyOnlineImportGuard
        ]
      }
    ])
  ],
  providers: [
    EasyOnlineImportGuard,
    ItemPageResolver,
    SubprojectItemI18nBreadcrumbResolver,
    SubprojectItemI18nBreadcrumbsService
  ]
})
export class EasyOnlineImportRoutingModule {

}
