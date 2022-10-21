import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { Item } from '../../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { Group } from '../../../core/eperson/models/group.model';
import { PROGRAMME_ENTITY } from '../../../core/project/project-data.service';
import { ProjectGroupService } from '../../../core/project/project-group.service';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';

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
  canShow$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
   * @param {ProjectGroupService} projectGroupService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: any,
    protected authorizationService: AuthorizationDataService,
    protected router: Router,
    protected groupDataService: GroupDataService,
    protected projectGroupService: ProjectGroupService,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.ManageProjectManagers);
  }

  ngOnInit() {
    console.log('ManageProgrammeGroupMenuComponent');
    if ((this.contextMenuObject as Item).entityType === PROGRAMME_ENTITY) {
      this.canShow().subscribe((canShow) => {
        this.canShow$.next(canShow);
      });
    }

  }

  /**
   * Check if current Item is a Programme, if has isFunderOrganizationalManager authorization & has groups
   */
  canShow(): Observable<boolean> {
    const contextItem = (this.contextMenuObject as Item);
    const groupName = this.projectGroupService.getProgrammeGroupNameByItem(contextItem);
    return combineLatest([
      this.authorizationService.isAuthorized(FeatureID.isFunderOrganizationalManager),
      this.groupDataService.searchGroups(groupName).pipe(
        getFirstCompletedRemoteData(),
        map((groupRD: RemoteData<PaginatedList<Group>>) => {
          console.log(groupRD);
          if (groupRD.hasSucceeded && groupRD.payload?.page?.length > 0) {
            this.targetGroupId = groupRD.payload?.page[0].uuid;
            return true;
          } else {
            return false;
          }
        })
      )
    ]).pipe(
      tap(console.log),
      map(([isFunderOrganizationalManager, groupExists]) => {
        return isFunderOrganizationalManager && groupExists;
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
