import { Component, Inject, OnInit } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { Item } from '../../../core/shared/item.model';
import { EASY_ONLINE_PATH, getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { FUNDING_ENTITY } from '../../../core/project/project-data.service';
import { ActivatedRoute } from '@angular/router';

/**
 * This component renders a context menu option that provides to send invitation to a project.
 */
@Component({
  selector: 'ds-context-menu-project-invitation',
  templateUrl: './easy-online-import-menu.component.html'
})
@rendersContextMenuEntriesForType('ITEM')
@rendersContextMenuEntriesForType('SUBPROJECT')
export class EasyOnlineImportMenuComponent extends ContextMenuEntryComponent implements OnInit {

  isSubproject;

  /**
   * Modal reference
   */
  private canMakeImport$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * A boolean representing if item is a version of original item
   */
  private isVersionOfAnItem$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {ActivatedRoute} aroute
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: any,
    protected aroute: ActivatedRoute,
    protected authorizationService: AuthorizationDataService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.EasyOnlineImport);
  }

  ngOnInit(): void {

    this.aroute.data.pipe(
      map((data) => data.isVersionOfAnItem),
      filter((isVersionOfAnItem) => isVersionOfAnItem === true),
      take(1)
    ).subscribe((isVersionOfAnItem: boolean) => {
      this.isVersionOfAnItem$.next(isVersionOfAnItem);
    });

    this.authorizationService.isAuthorized(FeatureID.isMemberOfFunding, this.contextMenuObject.self).pipe(
      take(1)
    ).subscribe((canMakeImport) => this.canMakeImport$.next(canMakeImport));
  }

  /**
   * Check if user can make import for this project
   */
  canMakeImport(): Observable<boolean> {
    return this.canMakeImport$.asObservable();
  }

  /**
   * Check if current item is version of an item
   */
  isVersionOfAnItem(): Observable<boolean> {
    return this.isVersionOfAnItem$.asObservable();
  }

  /**
   * Get bulk import route
   */
  getImportPageRouterLink() {
    return getItemPageRoute(this.contextMenuObject as Item) + `/${EASY_ONLINE_PATH}`;
  }

  /**
   * Check if current Item is a Project
   */
  canShow() {
    return (this.contextMenuObject as Item).entityType === FUNDING_ENTITY;
  }
}
