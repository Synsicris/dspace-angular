import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { Item } from '../../../core/shared/item.model';
import { FUNDING_ENTITY, PROJECT_ENTITY } from '../../../core/project/project-data.service';
import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';

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
   * Representing if the invitation is related to a funding
   */
  isFunding;

  /**
   * A boolean representing if user is coordinator for the current project/funding
   */
  protected isCoordinator$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * A boolean representing if item is a version of original item
   */
  private isVersionOfAnItem$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {NgbModal} modalService
   * @param {Router} router
   * @param {ActivatedRoute} aroute
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: any,
    protected authorizationService: AuthorizationDataService,
    protected modalService: NgbModal,
    protected router: Router,
    protected aroute: ActivatedRoute,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.ManageProjectMembers);
  }

  ngOnInit(): void {
    this.aroute.data.pipe(
      map((data) => data.isVersionOfAnItem),
      filter((isVersionOfAnItem) => isVersionOfAnItem === true),
      take(1)
    ).subscribe((isVersionOfAnItem: boolean) => {
      this.isVersionOfAnItem$.next(isVersionOfAnItem);
    });

    this.isFunding = (this.contextMenuObject as Item).entityType === FUNDING_ENTITY;
    if (this.canShow()) {
      this.checkIsCoordinator().subscribe((isCoordinator: boolean) => {
        this.isCoordinator$.next(isCoordinator);
      });
    }
  }

  /**
   * Check if current Item is a Project or a Funding
   */
  canShow() {
    return (this.contextMenuObject as Item).entityType === FUNDING_ENTITY || (this.contextMenuObject as Item).entityType === PROJECT_ENTITY;
  }

  /**
   * Return if user is coordinator for this project/funding
   */
  isCoordinator(): Observable<boolean> {
    return this.isCoordinator$.asObservable();
  }

  /**
   * Check if current item is version of an item
   */
  isVersionOfAnItem(): Observable<boolean> {
    return this.isVersionOfAnItem$.asObservable();
  }

  /**
   * Navigate to manage members page
   */
  navigateToManage() {
    this.router.navigate([getItemPageRoute((this.contextMenuObject as Item)), 'managemembers']);
  }

  /**
   * Check if user is coordinator for this project/funding
   */
  private checkIsCoordinator(): Observable<boolean> {
    if (this.isFunding) {
      return combineLatest([
        this.authorizationService.isAuthorized(FeatureID.isCoordinatorOfFunding, this.contextMenuObject.self, undefined),
        this.authorizationService.isAuthorized(FeatureID.AdministratorOf)]
      ).pipe(
        map(([
          isCoordinatorOfFunding,
          isAdminstrator]) => isCoordinatorOfFunding || isAdminstrator),
      );
    } else {
      return combineLatest([
        this.authorizationService.isAuthorized(FeatureID.isFunderOrganizationalManagerOfAnyProject),
        this.authorizationService.isAuthorized(FeatureID.isFunderOfProject, this.contextMenuObject.self, undefined),
        this.authorizationService.isAuthorized(FeatureID.isCoordinatorOfProject, this.contextMenuObject.self, undefined),
        this.authorizationService.isAuthorized(FeatureID.AdministratorOf)]
      ).pipe(
        map(([
          isFunderOrganizational,
          isFunderProject,
          isCoordinatorOfProject,
          isAdminstrator
        ]) => isFunderOrganizational || isFunderProject || isCoordinatorOfProject || isAdminstrator),
      );
    }
  }


}
