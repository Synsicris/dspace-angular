import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { Item } from '../../../core/shared/item.model';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { PERSON_ENTITY } from '../../../core/project/project-data.service';

/**
 * This component renders a context menu option that provides to manage group of a Person.
 */
@Component({
  selector: 'ds-context-manage-project-funders-group',
  templateUrl: './manage-project-funders-group-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
export class ManageProjectFundersGroupMenuComponent extends ContextMenuEntryComponent {

  /**
   * A boolean representing if user is an organizational funder
   */
  protected isFunderOrganizationalManager$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  protected funderGroupId: string;

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {Router} router
   * @param {ConfigurationDataService} configurationDataService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: any,
    protected authorizationService: AuthorizationDataService,
    protected router: Router,
    protected configurationDataService: ConfigurationDataService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.ManageProjectManagers);
  }

  ngOnInit(): void {
    if (this.canShow()) {
      this.checkIsFunderOrganizationalManager().subscribe((isCoordinator: boolean) => {
        this.isFunderOrganizationalManager$.next(isCoordinator);
      });

      this.configurationDataService.findByPropertyName('funders-project-managers.group').pipe(
        getFirstSucceededRemoteDataPayload(),
        map((configProperty: ConfigurationProperty) => configProperty?.values?.length > 0 ? configProperty.values[0] : null)
      ).subscribe((groupId: string) => {
        this.funderGroupId = groupId;
      });
    }
  }

  /**
   * Check if current Item is a Person
   */
  canShow() {
    return (this.contextMenuObject as Item).entityType === PERSON_ENTITY;
  }

  /**
   * Check if user is Funder or Organizational Manager for this Person group
   */
  isFunderOrganizationalManager(): Observable<boolean> {
    return this.isFunderOrganizationalManager$.asObservable();
  }

  /**
   * Navigate to manage members page
   */
  navigateToManage() {
    if (this.funderGroupId) {
      this.router.navigate([this.getGroupRegistryRouterLink(), this.funderGroupId, 'managemembers']);
    }
  }

  /**
   * A boolean representing if user is isFunderOrganizationalManager for the current Person group
   */
  private checkIsFunderOrganizationalManager(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.isFunderOrganizationalManager);
  }

  private getGroupRegistryRouterLink(): string {
    return '/access-control/groups';
  }

}
