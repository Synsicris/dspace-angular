import { Component, Inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { ProjectGroupService } from '../../../core/project/project-group.service';
import { Community } from '../../../core/shared/community.model';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { Item } from '../../../core/shared/item.model';
import { PARENT_PROJECT_ENTITY, PROJECT_ENTITY, ProjectDataService } from '../../../core/project/project-data.service';
import { getRemoteDataPayload } from '../../../core/shared/operators';

/**
 * This component renders a context menu option that provides to send invitation to a project.
 */
@Component({
  selector: 'ds-context-menu-project-invitation',
  templateUrl: './manage-project-members-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
export class ManageProjectMembersMenuComponent extends ContextMenuEntryComponent implements OnInit {

  /**
   * Representing if the invitation is related to a subproject
   */
  isSubproject;

  /**
   * The parentproject/project community
   */
  projectCommunity: Community;

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {NgbModal} modalService
   * @param {ProjectGroupService} projectGroupService
   * @param {ProjectDataService} projectService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: any,
    protected authorizationService: AuthorizationDataService,
    protected modalService: NgbModal,
    protected projectGroupService: ProjectGroupService,
    protected projectService: ProjectDataService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.ManageProjectMembers);
  }

  ngOnInit(): void {
    this.isSubproject = (this.contextMenuObject as Item).entityType === PROJECT_ENTITY;
    if (this.canShow()) {
      this.projectService.getProjectCommunityByItemId((this.contextMenuObject as Item).uuid).pipe(
        take(1),
        getRemoteDataPayload()
      ).subscribe((projectCommunity: Community) => {
        this.projectCommunity = projectCommunity;
      });
    }
  }

  /**
   * Check if current Item is a Project or a parentproject
   */
  canShow() {
    return (this.contextMenuObject as Item).entityType === PROJECT_ENTITY || (this.contextMenuObject as Item).entityType === PARENT_PROJECT_ENTITY;
  }

  /**
   * Check if user is administrator for this project
   */
  isProjectAdmin(): Observable<boolean> {
    // return this.authorizationService.isAuthorized(FeatureID.AdministratorOf, this.contextMenuObject.self, undefined);
    // temporary show menu only for administrator
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf);
  }

}
