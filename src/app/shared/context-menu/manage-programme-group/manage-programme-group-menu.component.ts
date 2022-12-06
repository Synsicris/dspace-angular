import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { Item } from '../../../core/shared/item.model';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { PROGRAMME_ENTITY } from '../../../core/project/project-data.service';
import { ProjectGroupService } from '../../../core/project/project-group.service';
import { MANAGEMEMBERS } from '../../../app-routing-paths';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';

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
   * @param {ActivatedRoute} route
   * @param {Router} router
   * @param {GroupDataService} groupDataService
   * @param {ProjectGroupService} projectGroupService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: any,
    protected authorizationService: AuthorizationDataService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected groupDataService: GroupDataService,
    protected projectGroupService: ProjectGroupService,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.ManageProgrammeManagers);
  }

  ngOnInit() {
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
    return this.authorizationService.isAuthorized(FeatureID.CanManageProgrammeMembers, contextItem.self);
  }

  /**
   * Navigate to manage members page
   */
  navigateToManage() {
    this.router.navigate(['../',MANAGEMEMBERS], { relativeTo: this.route });
  }

}
