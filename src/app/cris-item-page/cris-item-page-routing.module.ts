import { CrisItemPageTabResolver } from '../item-page/cris-item-page-tab.resolver';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrisItemPageResolver } from './cris-item-page.resolver';
import { CrisItemPageComponent } from './cris-item-page.component';
import { ItemBreadcrumbResolver } from '../core/breadcrumbs/item-breadcrumb.resolver';
import { MenuItemType } from '../shared/menu/initial-menus-state';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { ProjectItemBreadcrumbResolver } from '../core/breadcrumbs/project-item-breadcrumb.resolver';
import { ProjectItemBreadcrumbService } from '../core/breadcrumbs/project-item-breadcrumb.service';
import { ProjectCommunityByItemResolver } from '../core/project/project-community-by-item.resolver';
import { VersionOfAnItemResolver } from '../core/project/version-of-an-item.resolver';
import { FundingCommunityByItemResolver } from '../core/project/funding-community-by-item.resolver';

const routes: Routes = [
  {
    path: ':id',
    component: CrisItemPageComponent,
    resolve: {
      dso: CrisItemPageResolver,
      breadcrumb: ProjectItemBreadcrumbResolver,
      tabs: CrisItemPageTabResolver,
      project: ProjectCommunityByItemResolver,
      isVersionOfAnItem: VersionOfAnItemResolver,
      funding: FundingCommunityByItemResolver
    },
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
      }
      , showSocialButtons: true
    }
  },
  { // used for activate specific tab
    path: ':id/:tab',
    component: CrisItemPageComponent,
    resolve: {
      dso: CrisItemPageResolver,
      breadcrumb: ProjectItemBreadcrumbResolver,
      tabs: CrisItemPageTabResolver,
      project: ProjectCommunityByItemResolver,
      isVersionOfAnItem: VersionOfAnItemResolver,
      funding: FundingCommunityByItemResolver
    },
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
      }, showSocialButtons: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    CrisItemPageResolver,
    ItemBreadcrumbResolver,
    ProjectCommunityByItemResolver,
    ProjectItemBreadcrumbResolver,
    ProjectItemBreadcrumbService,
    VersionOfAnItemResolver,
    FundingCommunityByItemResolver
  ]
})
export class CrisItemPageRoutingModule { }
