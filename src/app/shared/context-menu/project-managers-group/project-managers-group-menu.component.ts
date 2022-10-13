import { PERSON_ENTITY } from './../../../core/project/project-data.service';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { ProjectGroupService } from '../../../core/project/project-group.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { Item } from '../../../core/shared/item.model';
import { ProjectDataService } from '../../../core/project/project-data.service';
import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';

/**
 * This component renders a context menu option that provides to send invitation to a project.
 */
@Component({
  selector: 'ds-context-project-managers-group',
  templateUrl: './project-managers-group-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
export class ProjectManagersGroupMenuComponent extends ContextMenuEntryComponent {

  /**
   * Representing if the invitation is related to a funding
   */
  isFunding;

  /**
   * A boolean representing if user is coordinator for the current project/funding
   */
  protected isCoordinator$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {NgbModal} modalService
   * @param {ProjectGroupService} projectGroupService
   * @param {ProjectDataService} projectService
   * @param {Router} router
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: any,
    protected authorizationService: AuthorizationDataService,
    protected modalService: NgbModal,
    protected projectGroupService: ProjectGroupService,
    protected projectService: ProjectDataService,
    protected router: Router,
    protected configurationDataService: ConfigurationDataService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.ManageProjectManagers);
  }


  /**
   * Check if current Item is a Project or a Funding
   */
  canShow() {
    return (this.contextMenuObject as Item).entityType === PERSON_ENTITY;
  }

  /**
   * Navigate to manage members page
   */
  navigateToManage() {
    this.configurationDataService.findByPropertyName('funder-organisational-managers.group').pipe(
      getFirstSucceededRemoteDataPayload(),
    ).subscribe((configProperty: ConfigurationProperty) => {
      if (configProperty.values?.length > 0) {
        this.router.navigate([this.getGroupRegistryRouterLink(), configProperty.values[0], 'managemembers']);
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
