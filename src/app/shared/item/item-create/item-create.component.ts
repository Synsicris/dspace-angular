import { getRemoteDataPayload } from './../../../core/shared/operators';
import { Collection } from './../../../core/shared/collection.model';
import { PaginatedList } from './../../../core/data/paginated-list.model';
import { CollectionDataService } from './../../../core/data/collection-data.service';
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
  CALL_ENTITY,
  FUNDING_ENTITY,
  FUNDING_OBJECTIVE_ENTITY,
  ORGANISATION_UNIT_ENTITY,
  PERSON_ENTITY,
  PROGRAMME_ENTITY,
  PROJECT_ENTITY,
  PROJECTPATNER_ENTITY_METADATA
} from '../../../core/project/project-data.service';
import { environment } from '../../../../environments/environment';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';

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
    private collectionDataService: CollectionDataService,
    private entityTypeService: EntityTypeDataService,
    private modalService: NgbModal,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    combineLatest([
      this.authService.isAuthenticated(),
      this.entityTypeService.getEntityTypeByLabel(this.targetEntityType).pipe(
        getFirstSucceededRemoteDataPayload()
      ),
      this.hasAtLeastOneCollection$,
      this.checkIsCoordinator(),
      this.isAdministrator(),
      this.isFunderOrganizationalManager()
    ]).pipe(
      map(([isAuthenticated, entityType, hasAtLeastOneCollection, isCoordinator, isAdministrator, isFunderOrganizationalManager]) =>
        isAuthenticated &&
        isNotEmpty(entityType) &&
        (this.canCreateProjectPartner(entityType, hasAtLeastOneCollection) ||
          this.canCreateAnyProjectEntity(entityType, hasAtLeastOneCollection) ||
          this.canCreateFunding(entityType, isCoordinator)  ||
          this.canCreateFundingObjectives(entityType, hasAtLeastOneCollection, isFunderOrganizationalManager) ||
          this.adminCanCreate(isAdministrator, hasAtLeastOneCollection)
        )
      ),
      take(1)
    ).subscribe((canShow) => this.canShow$.next(canShow));
  }

  protected canCreateProjectPartner(entityType, hasAtLeastOneCollection) {
    return this.relatedEntityType === FUNDING_ENTITY && entityType.label === PROJECTPATNER_ENTITY_METADATA && hasAtLeastOneCollection;
  }

  protected canCreateFunding(entityType: ItemType, isCoordinator: boolean) {
    return this.relatedEntityType === PROJECT_ENTITY && entityType.label === FUNDING_ENTITY && isCoordinator;
  }

  protected canCreateFundingObjectives(entityType: ItemType, hasAtLeastOneCollection: boolean, isFunderOrganizationalManager: boolean) {
    return isFunderOrganizationalManager &&
           this.relatedEntityType === PERSON_ENTITY &&
           entityType.label === FUNDING_OBJECTIVE_ENTITY &&
           hasAtLeastOneCollection;
  }

  protected adminCanCreate(isAdministrator: boolean, hasAtLeastOneCollection: boolean) {
    return  isAdministrator && hasAtLeastOneCollection;
  }

  protected canCreateAnyProjectEntity(entityType, hasAtLeastOneCollection) {
    return entityType.label !== PROJECTPATNER_ENTITY_METADATA && entityType.label !== FUNDING_ENTITY && hasAtLeastOneCollection;
  }

  /**
   * Return if the user is authenticated
   */
  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  /**
   * Check if there is at least one collection available for the given entityType and scope
   */
  get hasAtLeastOneCollection$(): Observable<boolean> {
    if (this.isExcluded(this.targetEntityType)) {
      return of(true);
    }
    const findListOptions = Object.assign({}, new FindListOptions(), {
      elementsPerPage: 1,
      currentPage: 1,
    });

    if (this.isSharedEntity(this.targetEntityType)) {
      return this.canCreateSharedEntity(findListOptions);
    } else {
      return this.canCreateProjectEntity(findListOptions);
    }
  }

  protected isExcluded(entityType: string) {
    return entityType === FUNDING_ENTITY;
  }

  protected isSharedEntity(entityType: string){
    return entityType === FUNDING_OBJECTIVE_ENTITY ||
           entityType === CALL_ENTITY ||
           entityType === ORGANISATION_UNIT_ENTITY ||
           entityType === PROGRAMME_ENTITY;
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

  /**
   * Checks if the user has permission to create a project entity by having at least one collection based on the scope
   */
  private canCreateProjectEntity(findListOptions: FindListOptions) {
    return this.collectionDataService.getAuthorizedCollectionByCommunityAndEntityType(this.scope, this.targetEntityType, findListOptions).pipe(
      getRemoteDataPayload(),
      map((collections: PaginatedList<Collection>) => collections?.totalElements === 1)
    );
  }

  /**
   * Checks if the user has permission to create a shared entity by having at least one collection
   */
  private canCreateSharedEntity(findListOptions: FindListOptions): Observable<boolean> {
    return this.collectionDataService.getAuthorizedCollectionByEntityType('', this.targetEntityType, findListOptions).pipe(
      getRemoteDataPayload(),
      map((collections: PaginatedList<Collection>) => collections?.totalElements === 1)
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
