import { PROGRAMME_ENTITY } from '../../../core/project/project-data.service';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

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

/**
 * This component renders a context menu option that provides to manage group of a Programme.
 */
@Component({
  selector: 'ds-context-manage-programme-group',
  templateUrl: './manage-programme-group-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
export class ManageProgrammeGroupMenuComponent extends ContextMenuEntryComponent {

  /**
   * A boolean representing if user is isFunderOrganizationalManager for the current Programme
   */
  protected isCoordinator$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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


  /**
   * Check if current Item is a Programme
   */
  canShow() {
    return (this.contextMenuObject as Item).entityType === PROGRAMME_ENTITY;
  }

  /**
   * Navigate to manage members page
   */
  navigateToManage() {
    this.groupDataService.searchGroups(`programme_${this.injectedContextMenuObject.id}_group`).pipe(
      getFirstSucceededRemoteListPayload(),
    ).subscribe((groups: Group[]) => {
      if (groups?.length > 0) {
        this.router.navigate([this.getGroupRegistryRouterLink(), groups[0].id, 'managemembers']);
      }
    });
  }

  /**
   * Check if user is coordinator for this project/funding
   */
  isFunderOrganizationalManager(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.isFunderOrganizationalManager);
  }

  public getGroupRegistryRouterLink(): string {
    return '/access-control/groups';
  }

}
