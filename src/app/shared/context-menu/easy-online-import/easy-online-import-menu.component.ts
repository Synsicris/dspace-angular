import { Component, Inject, OnInit } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { Item } from '../../../core/shared/item.model';
import { EASY_ONLINE_PATH, getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { ContextMenuEntryType } from '../context-menu-entry-type';

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
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: any,
    protected authorizationService: AuthorizationDataService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.EasyOnlineImport);
  }

  ngOnInit(): void {
    this.authorizationService.isAuthorized(FeatureID.isMemberOfProject, this.contextMenuObject.self).pipe(
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
   * Get bulk import route
   */
  getImportPageRouterLink() {
    return getItemPageRoute(this.contextMenuObject as Item) + `/${EASY_ONLINE_PATH}`;
  }

}
