import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, combineLatest, of } from 'rxjs';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { Item } from '../../../core/shared/item.model';
import { getFirstSucceededRemoteListPayload } from '../../../core/shared/operators';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { Group } from '../../../core/eperson/models/group.model';
import { map } from 'rxjs/operators';
import { PROGRAMME_ENTITY } from '../../../core/project/project-data.service';

/**
 * This component renders a context menu option that provides to manage group of a Programme.
 */
@Component({
  selector: 'ds-context-manage-programme-group',
  templateUrl: './manage-programme-group-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
export class ManageProgrammeGroupMenuComponent extends ContextMenuEntryComponent implements OnInit {

  /**
   * Observable to check if we can show button
   */
  canShow$: Observable<boolean>;

  /**
   * Group id of the programme group
   */
  targetGroupId: string;

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {Router} router
   * @param {GroupDataService} groupDataService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: any,
    protected authorizationService: AuthorizationDataService,
    protected router: Router,
    protected groupDataService: GroupDataService,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.ManageProjectManagers);
  }


  ngOnInit() {
    this.canShow$ = this.canShow();
  }

  /**
   * Check if current Item is a Programme, if has isFunderOrganizationalManager authorization & has groups
   */
  canShow(): Observable<boolean> {
    const contextItem = (this.contextMenuObject as Item);
    return combineLatest([
      of(contextItem.entityType === PROGRAMME_ENTITY),
      this.authorizationService.isAuthorized(FeatureID.isFunderOrganizationalManager),
      this.groupDataService.searchGroups(this.groupDataService.getGroupName(contextItem, this.injectedContextMenuObject)).pipe(
        getFirstSucceededRemoteListPayload(),
        map((groups: Group[]) => {
          if (groups?.length > 0) {
            this.targetGroupId = groups[0].id;
          }
          return groups?.length > 0;
        })
      )
    ]).pipe(
      map((results) => {
        return results.find((res) => res === false) !== false;
      })
    );
  }

  /**
   * Navigate to manage members page
   */
  navigateToManage() {
    this.router.navigate([this.getGroupRegistryRouterLink(), this.targetGroupId, 'managemembers']);
  }

  public getGroupRegistryRouterLink(): string {
    return '/access-control/groups';
  }

}
