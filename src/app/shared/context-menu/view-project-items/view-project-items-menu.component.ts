import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { FUNDING_ENTITY, PROJECT_ENTITY, ProjectDataService } from '../../../core/project/project-data.service';
import { Community } from '../../../core/shared/community.model';
import { getRemoteDataPayload } from '../../../core/shared/operators';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { Item } from '../../../core/shared/item.model';
import { MYDSPACE_PAGE } from '../../../my-dspace-page/my-dspace-page.component';
import { PROJECT_ROUTE } from '../../../project-overview-page/project-overview-page.component';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { ProjectVersionService } from '../../../core/project/project-version.service';

/**
 * This component renders a context menu option that provides to export an item.
 */
@Component({
  selector: 'ds-context-menu-audit-item',
  templateUrl: './view-project-items-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
export class ViewProjectItemsMenuComponent extends ContextMenuEntryComponent {

  /**
   * A boolean representing if item is a version of original item
   */
  private isVersionOfAnItem$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The project community
   */
  public projectCommunity$: Observable<Community>;

  /**
   * The mydspace page name.
   * @type {string}
   */
  mydspacePage = MYDSPACE_PAGE;

  /**
   * The mydspace page name.
   * @type {string}
   */
  projectRoute = PROJECT_ROUTE;

  /**
   * Modal reference
   */
  private canSeeItems$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {ProjectDataService} projectService
   * @param {ProjectVersionService} projectVersionService
   * @param {Router} router
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected authorizationService: AuthorizationDataService,
    protected projectService: ProjectDataService,
    protected projectVersionService: ProjectVersionService,
    protected router: Router
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.ViewProjectItems);
  }

  ngOnInit(): void {
    const isAdmin$ = this.authorizationService.isAuthorized(FeatureID.AdministratorOf);
    const isMember$ = this.authorizationService.isAuthorized(FeatureID.isMemberOfProject, this.contextMenuObject.self);
    combineLatest([isMember$, isAdmin$]).pipe(
      take(1)
    ).subscribe(([isMemberOfProject, isAdmin]) => {
      const isVersionOfAnItem = this.projectVersionService.isVersionOfAnItem((this.contextMenuObject as Item));
      this.canSeeItems$.next(!isVersionOfAnItem && (isMemberOfProject || isAdmin));
    });

    this.projectCommunity$ = this.projectService.getProjectCommunityByItemId((this.contextMenuObject as Item).uuid).pipe(
      take(1),
      getRemoteDataPayload()
    );
  }

  /**
   * Check if current Item is a Project or a Funding
   */
  canShow() {
    return (this.contextMenuObject as Item).entityType === FUNDING_ENTITY || (this.contextMenuObject as Item).entityType === PROJECT_ENTITY;
  }

  /**
   * Check if user can make import for this project
   */
  canSeeItems(): Observable<boolean> {
    return this.canSeeItems$.asObservable();
  }

  /**
   * Navigate to mydspace page
   */
  navigateToMyDSpace() {
    /**
     * [routerLink]="[projectRoute, projectUUID, mydspacePage]"
     * [queryParams]="{configuration: 'workspace', scope: projectUUID}"
     */
    this.projectCommunity$.subscribe((projectCommunity: Community) => {
      this.router.navigate([this.projectRoute, projectCommunity.uuid, this.mydspacePage],
        { queryParams: { configuration: 'workspace', scope: projectCommunity.uuid } });
    });
  }
}
