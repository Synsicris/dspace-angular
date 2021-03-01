import { Component, Inject } from '@angular/core';

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
import { Observable } from 'rxjs/internal/Observable';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';

/**
 * This component renders a context menu option that provides to send invitation to a project.
 */
@Component({
  selector: 'ds-context-menu-project-invitation',
  templateUrl: './project-invitation-menu.component.html'
})
@rendersContextMenuEntriesForType('PROJECT')
export class ProjectInvitationMenuComponent extends ContextMenuEntryComponent {

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
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected authorizationService: AuthorizationDataService,
    protected modalService: NgbModal,
    protected projectGroupService: ProjectGroupService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType);
  }

  /**
   * Check if user is administrator for this project
   */
  isProjectAdmin(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf, this.contextMenuObject.self, undefined);
  }

  public openInvitationModal() {
    this.projectGroupService.getAllProjectGroupsByCommunity(this.contextMenuObject as Community).pipe(take(1))
      .subscribe((groups: string[]) => {
        this.modalRef = this.modalService.open(InvitationModalComponent);
        this.modalRef.componentInstance.groupList = groups;
      });
  }
}
