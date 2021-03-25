import { Component, Inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { InvitationModalComponent } from '../../invitation-modal/invitation-modal.component';
import { ProjectGroupService } from '../../../core/project/project-group.service';
import { Community } from '../../../core/shared/community.model';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';

/**
 * This component renders a context menu option that provides to send invitation to a project.
 */
@Component({
  selector: 'ds-context-menu-project-invitation',
  templateUrl: './project-members-invitation-menu.component.html'
})
@rendersContextMenuEntriesForType('PROJECT')
@rendersContextMenuEntriesForType('SUBPROJECT')
export class ProjectMembersInvitationMenuComponent extends ContextMenuEntryComponent implements OnInit {

  isSubproject;

  /**
   * Modal reference
   */
  private modalRef: NgbModalRef;

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {NgbModal} modalService
   * @param {ProjectGroupService} projectGroupService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: any,
    protected authorizationService: AuthorizationDataService,
    protected modalService: NgbModal,
    protected projectGroupService: ProjectGroupService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType);
  }


  ngOnInit(): void {
    this.isSubproject = ((this.contextMenuObjectType as any) === 'SUBPROJECT');
  }

  /**
   * Check if user is administrator for this project
   */
  isProjectAdmin(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf, this.contextMenuObject.self, undefined);
  }

  public openInvitationModal() {
    let groups$: Observable<string[]>;
    if (this.isSubproject) {
      groups$ = this.projectGroupService.getInvitationSubprojectMembersGroupsByCommunity(this.contextMenuObject as Community);
    } else {
      groups$ = this.projectGroupService.getProjectMembersGroupNameByCommunity(this.contextMenuObject as Community);
    }

    groups$.pipe(take(1))
      .subscribe((groups: string[]) => {
        console.log('members', groups);
        this.modalRef = this.modalService.open(InvitationModalComponent);
        this.modalRef.componentInstance.groupList = groups;
      });
  }

}
