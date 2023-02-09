import { Item } from '../../../core/shared/item.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { BehaviorSubject, combineLatest } from 'rxjs';
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
  PROJECT_ENTITY,
  PROJECTPATNER_ENTITY_METADATA
} from '../../../core/project/project-data.service';
import { environment } from '../../../../environments/environment';
import { ItemDataService } from '../../../core/data/item-data.service';

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
   * The entity type which the target entity type is related
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
    private itemService: ItemDataService,
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
      )]
    ).pipe(
      map(([isAuthenticated, entityType]) =>
        isAuthenticated &&
        isNotEmpty(entityType) &&
        this.canCreateProjectPartner(entityType)
      ),
      take(1)
    ).subscribe((canShow) => this.canShow$.next(canShow));
  }

  protected canCreateProjectPartner(entityType) {
    return !(this.relatedEntityType === PROJECT_ENTITY && entityType.label === PROJECTPATNER_ENTITY_METADATA);
  }

  /**
   * Return if the user is authenticated
   */
  isAuthenticated() {
    return this.authService.isAuthenticated();
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
    const modalRef = this.modalService.open(CreateProjectComponent, { keyboard: false, backdrop: 'static', size: 'lg' });
    modalRef.componentInstance.isSubproject = true;
    modalRef.componentInstance.parentProjectUUID = this.scope;
  }

}
