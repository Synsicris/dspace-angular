import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EasyOnlineImportPageComponent } from './easy-online-import-page.component';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ItemPageResolver } from '../item-page/item-page.resolver';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { EasyOnlineImportGuard } from '../core/easy-online-import/easy-online-import.guard';

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
          breadcrumb: I18nBreadcrumbResolver
        },
        data: { breadcrumbKey: 'item.edit', title: 'easy-online-import.title' },
        component: EasyOnlineImportPageComponent,
        canActivate: [
          AuthenticatedGuard, EasyOnlineImportGuard
        ]
      }
    ])
  ],
  providers: [
    EasyOnlineImportGuard,
    I18nBreadcrumbResolver,
    ItemPageResolver
  ]
})
export class EasyOnlineImportRoutingModule {

}
