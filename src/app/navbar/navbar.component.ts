import { Component, Injector } from '@angular/core';

import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import { slideMobileNav } from '../shared/animations/slide';
import { MenuComponent } from '../shared/menu/menu.component';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID, MenuItemType } from '../shared/menu/initial-menus-state';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { HostWindowService } from '../shared/host-window.service';
import { SectionDataService } from '../core/layout/section-data.service';
import { getFirstSucceededRemoteListPayload } from '../core/shared/operators';
import { Section } from '../core/layout/models/section.model';
import { environment } from '../../environments/environment';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';

/**
 * Component representing the public navbar
 */
@Component({
  selector: 'ds-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
  animations: [slideMobileNav]
})
export class NavbarComponent extends MenuComponent {
  /**
   * The menu ID of the Navbar is PUBLIC
   * @type {MenuID.PUBLIC}
   */
  menuID = MenuID.PUBLIC;

  constructor(protected menuService: MenuService,
              protected injector: Injector,
              public windowService: HostWindowService,
              protected sectionDataService: SectionDataService,
              protected authorizationService: AuthorizationDataService
  ) {
    super(menuService, injector);
  }

  ngOnInit(): void {
    this.createMenu();
    super.ngOnInit();
  }

  /**
   * Initialize all menu sections and items for this menu
   */
  createMenu() {
    const isAdmin$ = this.authorizationService.isAuthorized(FeatureID.AdministratorOf).pipe(take(1));
    const menuList: any[] = [];

    /* Communities & Collections tree */
    const CommunityCollectionMenuItem = {
      id: `browse_global_communities_and_collections`,
      active: false,
      visible: environment.layout.navbar.showCommunityCollection,
      index: 0,
      model: {
        type: MenuItemType.LINK,
        text: `menu.section.communities_and_collections`,
        link: `/community-list`
      } as LinkMenuItemModel
    };

    if (environment.layout.navbar.showCommunityCollection) {
      menuList.push(CommunityCollectionMenuItem);
    }

    const findAllVisible$ = this.sectionDataService.findVisibleSections().pipe( getFirstSucceededRemoteListPayload());
    combineLatest([isAdmin$, findAllVisible$]).subscribe( ([isAdmin, sections]: [boolean, Section[]]) => {
      if (isAdmin) {
        menuList.forEach((menuSection) => this.menuService.addSection(this.menuID, Object.assign(menuSection, {
          shouldPersistOnRouteChange: true
        })));

        sections.filter((section) => section.id !== 'site')
                .forEach( (section) => {
          const menuSection = {
            id: `explore_${section.id}`,
            active: false,
            visible: true,
            model: {
              type: MenuItemType.LINK,
              text: `menu.section.explore_${section.id}`,
              link: `/explore/${section.id}`
            } as LinkMenuItemModel
          };
          this.menuService.addSection(this.menuID, Object.assign(menuSection, {
            shouldPersistOnRouteChange: true
          }));
        });
      }
    });
  }
}
