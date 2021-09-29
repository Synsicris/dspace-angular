import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrisItemPageResolver } from './cris-item-page.resolver';
import { CrisItemPageComponent } from './cris-item-page.component';
import { ItemBreadcrumbResolver } from '../core/breadcrumbs/item-breadcrumb.resolver';
import { MenuItemType } from '../shared/menu/initial-menus-state';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { ProjectCommunityResolver } from '../core/project/project-community.resolver';
import { ProjectItemBreadcrumbResolver } from '../core/breadcrumbs/project-item-breadcrumb.resolver';
import { ProjectItemBreadcrumbService } from '../core/breadcrumbs/project-item-breadcrumb.service';

const routes: Routes = [
  {
    path: ':id',
    component: CrisItemPageComponent,
    resolve: {
      dso: CrisItemPageResolver,
      project: ProjectCommunityResolver,
      breadcrumb: ProjectItemBreadcrumbResolver
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
      },
    }
  },
  { // used for activate specific tab
    path: ':id/:tab',
    component: CrisItemPageComponent,
    resolve: {
      dso: CrisItemPageResolver,
      project: ProjectCommunityResolver,
      breadcrumb: ProjectItemBreadcrumbResolver
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
      },
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    CrisItemPageResolver,
    ItemBreadcrumbResolver,
    ProjectCommunityResolver,
    ProjectItemBreadcrumbResolver,
    ProjectItemBreadcrumbService
  ]
})
export class CrisItemPageRoutingModule { }
