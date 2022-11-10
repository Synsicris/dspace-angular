import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { Item } from '../../../core/shared/item.model';
import { PROJECT_ENTITY, ProjectDataService } from '../../../core/project/project-data.service';
import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ProjectVersionService } from '../../../core/project/project-version.service';
import { map, tap } from 'rxjs/operators';

/**
 * This component renders a context menu option that provides to send invitation to a project.
 */
@Component({
  selector: 'ds-context-menu-project-invitation',
  templateUrl: './manage-project-versions-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
export class ManageProjectVersionsMenuComponent extends ContextMenuEntryComponent implements OnInit {

  /**
   * A boolean representing if user is coordinator or founder for the current project
   */
  public isCoordinatorOfProject$: Observable<boolean>;
  /**
   * A boolean representing if user is coordinator or founder for the current project
   */
  public isFounderOfProject$: Observable<boolean>;
  /**
   * A boolean representing if user is coordinator or founder for the current project
   */
  public mainVersion: Item;
  /**
   * A boolean representing if user is coordinator or founder for the current project
   */
  public hasVersions$: Observable<boolean>;

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {Router} router
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: any,
    protected authorizationService: AuthorizationDataService,
    protected router: Router,
    protected projectVersionService: ProjectVersionService,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.ManageProjectVersions);
  }

  ngOnInit() {
    this.mainVersion = this.contextMenuObject as Item;

    this.projectVersionService.getParentRelationVersionsByItemId(this.contextMenuObject.id).subscribe((items: Item[]) => {
      this.mainVersion = items[0];
    });

    this.hasVersions$ = this.projectVersionService.getRelationVersionsByItemId(this.contextMenuObject.id).pipe(
      tap((items) => console.log(items)),
      map((items: Item[]) => items.length > 0));


    this.isCoordinatorOfProject$ = this.authorizationService.isAuthorized(FeatureID.isCoordinatorOfProject, this.contextMenuObject.self);
    this.isFounderOfProject$ = this.authorizationService.isAuthorized(FeatureID.isFunderOfProject, this.contextMenuObject.self);
  }

  /**
   * Check if current Item is a Project or a Funding
   */
  canShow() {
    return (this.mainVersion as Item).entityType === PROJECT_ENTITY;
  }

  /**
   * Navigate to manage versions page
   */
  navigateToManage() {
    this.router.navigate([getItemPageRoute((this.mainVersion as Item)), 'manageversions']);
  }

}
