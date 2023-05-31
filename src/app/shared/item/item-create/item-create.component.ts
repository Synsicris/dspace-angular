import { Item } from '../../../core/shared/item.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../../core/auth/auth.service';
import {
  SubmissionImportExternalCollectionComponent
} from '../../../submission/import-external/import-external-collection/submission-import-external-collection.component';
import { CollectionListEntry } from '../../collection-dropdown/collection-dropdown.component';
import { EntityTypeDataService } from '../../../core/data/entity-type-data.service';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { isNotEmpty } from '../../empty.util';
import { CreateProjectComponent } from '../../../projects/create-project/create-project.component';
import {
  FUNDING_ENTITY,
  FUNDING_OBJECTIVE_ENTITY,
  PERSON_ENTITY,
  PROJECT_ENTITY,
  PROJECTPATNER_ENTITY_METADATA
} from '../../../core/project/project-data.service';
import { environment } from '../../../../environments/environment';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';
import { ProjectAuthorizationService } from '../../../core/project/project-authorization.service';

@Component({
  selector: 'ds-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.scss']
})
export class ItemCreateComponent implements OnInit {

  /**
   * The entity type which the target entity type is related
   */
  @Input() item: Item;

  /**
   * The entity type which the target entity type is related to
   */
  @Input() relatedEntityType: string;
  /**
   * The entity type for which create an item
   */
  @Input() targetEntityType: string;

  /**
   * The current relevant scope
   */
  @Input() scope: string;

  /**
   * The condition to show or hide the button
   */
  canShow$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The event emitter to be emitted when we want to refresh the page upon creation
   */
  @Output() refresh = new EventEmitter();

  constructor(
    private authService: AuthService,
    private authorizationService: AuthorizationDataService,
    private entityTypeService: EntityTypeDataService,
    private modalService: NgbModal,
    private projectAuthorizationService: ProjectAuthorizationService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    let hasAtLeastOneCollection$ = this.projectAuthorizationService.hasAtLeastOneCollection(this.scope, this.targetEntityType);

    combineLatest([
      this.authService.isAuthenticated(),
      this.entityTypeService.getEntityTypeByLabel(this.targetEntityType).pipe(
        getFirstSucceededRemoteDataPayload()
      ),
      hasAtLeastOneCollection$,
      this.checkIsCoordinator(),
      this.isAdministrator(),
      this.isFunderOrganizationalManager()
    ]).pipe(
      map(([isAuthenticated, entityType, hasAtLeastOneCollection, isCoordinator, isAdministrator, isFunderOrganizationalManager]) =>
        isAuthenticated &&
        isNotEmpty(entityType) &&
        hasAtLeastOneCollection &&
        (this.canCreateProjectPartner(entityType) ||
          this.canCreateAnyProjectEntity(entityType) ||
          this.canCreateFunding(entityType, isCoordinator)  ||
          this.canCreateFundingObjectives(entityType, isFunderOrganizationalManager)
        )
      ),
      take(1)
    ).subscribe((canShow) => this.canShow$.next(canShow));
  }

  protected canCreateProjectPartner(entityType) {
    return this.relatedEntityType === FUNDING_ENTITY && entityType.label === PROJECTPATNER_ENTITY_METADATA;
  }

  protected canCreateFunding(entityType: ItemType, isCoordinator: boolean) {
    return this.relatedEntityType === PROJECT_ENTITY && entityType.label === FUNDING_ENTITY && isCoordinator;
  }

  protected canCreateFundingObjectives(entityType: ItemType, isFunderOrganizationalManager: boolean) {
    return isFunderOrganizationalManager &&
           this.relatedEntityType === PERSON_ENTITY &&
           entityType.label === FUNDING_OBJECTIVE_ENTITY;
  }

  protected adminCanCreate(isAdministrator: boolean) {
    return  isAdministrator;
  }

  protected canCreateAnyProjectEntity(entityType) {
    return entityType.label !== PROJECTPATNER_ENTITY_METADATA && entityType.label !== FUNDING_ENTITY;
  }

  /**
   * Return if the user is authenticated
   */
  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  /**
   * Check if user is coordinator for this project/funding
   */
  private checkIsCoordinator(): Observable<boolean> {
    return combineLatest([
      this.authorizationService.isAuthorized(FeatureID.isCoordinatorOfProject, this.item.self, undefined),
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf)]
    ).pipe(
      map(([isCoordinatorOfFunding, isAdminstrator]) => isCoordinatorOfFunding || isAdminstrator),
    );
  }

  /**
   * Check if the user is an administrator
   */
  private isAdministrator(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf).pipe(
      map((isAdminstrator) => isAdminstrator),
    );
  }

  /**
   * Check if the user is an administrator
   */
  private isFunderOrganizationalManager(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.isFunderOrganizationalManagerOfAnyProject).pipe(
      map((isFunderOrganizationalManager) => isFunderOrganizationalManager),
    );
  }

  openDialog() {
    if (this.targetEntityType === FUNDING_ENTITY) {
      this.createSubproject();
    } else {
      this.createEntity();
    }
  }

  /**
   * It opens a dialog for selecting a collection.
   */
  createEntity() {
    const modalRef = this.modalService.open(SubmissionImportExternalCollectionComponent);
    modalRef.componentInstance.entityType = this.targetEntityType;
    modalRef.componentInstance.scope = this.targetEntityType === environment.comments.commentEntityType ? null : this.scope;
    modalRef.componentInstance.selectedEvent.pipe(
      take(1)
    ).subscribe((collectionListEntry: CollectionListEntry) => {
      modalRef.close();
      const navigationExtras: NavigationExtras = {
        queryParams: {
          ['collection']: collectionListEntry.collection.uuid,
        }
      };
      if (this.targetEntityType) {
        navigationExtras.queryParams.entityType = this.targetEntityType;
      }
      this.router.navigate(['/submit'], navigationExtras);
    });
  }

  /**
   * Open creation sub-project modal
   */
  createSubproject() {
    const modalRef = this.modalService.open(CreateProjectComponent, {
      keyboard: false,
      backdrop: 'static',
      size: 'lg'
    });
    modalRef.componentInstance.isSubproject = true;
    modalRef.componentInstance.parentProjectUUID = this.scope;
  }

}
