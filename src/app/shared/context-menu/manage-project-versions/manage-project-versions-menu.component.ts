import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { forkJoin, Observable, of } from 'rxjs';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { Item } from '../../../core/shared/item.model';
import { PROJECT_ENTITY } from '../../../core/project/project-data.service';
import { getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ProjectVersionService } from '../../../core/project/project-version.service';
import { map, take } from 'rxjs/operators';

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
   * A boolean representing if user is reader of the current project
   */
  public isReaderOfProject$: Observable<boolean>;
  /**
   * A boolean representing if user is coordinator or founder for the current project
   */
  public mainVersion: Item;
  /**
   * A boolean representing if user is coordinator or founder for the current project
   */
  public hasVersions$: Observable<boolean> = of(false);
  /**
   * A boolean representing if the context object is a version
   */
  public isVersionOf: boolean = false;

  public isAuthorized$: Observable<boolean>;

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {Router} router
   * @param {ProjectVersionService} projectVersionService
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

    if (this.projectVersionService.isVersionOfAnItem(this.contextMenuObject as Item)) {
      this.isVersionOf = true;
    } else {
      this.hasVersions$ = this.projectVersionService.getRelationVersionsByItemId(this.contextMenuObject.id).pipe(
        map((items: Item[]) => items.length > 0));
    }


    this.isCoordinatorOfProject$ = this.authorizationService.isAuthorized(FeatureID.isCoordinatorOfProject, this.contextMenuObject.self);
    this.isFounderOfProject$ = this.authorizationService.isAuthorized(FeatureID.isFunderOfProject, this.contextMenuObject.self);
    this.isReaderOfProject$ = this.authorizationService.isAuthorized(FeatureID.isReaderOfProject, this.contextMenuObject.self);
    this.isAuthorized$ =
      forkJoin([
        this.isCoordinatorOfProject$.pipe(take(1)),
        this.isFounderOfProject$.pipe(take(1)),
        this.isReaderOfProject$.pipe(take(1))
      ])
        .pipe(
          map(([coordinator, funder, reader]) => coordinator || funder || reader)
        );
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
