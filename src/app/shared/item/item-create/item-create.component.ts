import { Collection } from './../../../core/shared/collection.model';
import { Item } from './../../../core/shared/item.model';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { map, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../../core/auth/auth.service';
import {
  SubmissionImportExternalCollectionComponent
} from '../../../submission/import-external/import-external-collection/submission-import-external-collection.component';
import { CollectionListEntry } from '../../collection-dropdown/collection-dropdown.component';
import { EntityTypeService } from '../../../core/data/entity-type.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { isNotEmpty } from '../../empty.util';
import { CreateProjectComponent } from '../../../projects/create-project/create-project.component';
import {
  PARENT_PROJECT_ENTITY,
  PROJECT_ENTITY,
  PROJECTPATNER_ENTITY_METADATA,
  SUBCONTRACTOR_ENTITY_METADATA
} from '../../../core/project/project-data.service';
import { environment } from '../../../../environments/environment';
import { CreateItemSubmissionModalComponent } from '../../create-item-submission-modal/create-item-submission-modal.component';

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

  canShow$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService, private entityTypeService: EntityTypeService, private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    combineLatest([
      this.authService.isAuthenticated(),
      this.entityTypeService.getEntityTypeByLabel(this.targetEntityType).pipe(
        getFirstSucceededRemoteDataPayload()
      )]
    ).pipe(
      map(([isAuthenticated, entityType]) => isAuthenticated && isNotEmpty(entityType)
        && !(this.relatedEntityType === PARENT_PROJECT_ENTITY && entityType.label === SUBCONTRACTOR_ENTITY_METADATA)
        && !(this.relatedEntityType === PARENT_PROJECT_ENTITY && entityType.label === PROJECTPATNER_ENTITY_METADATA)),
      take(1)
    ).subscribe((canShow) => this.canShow$.next(canShow));
  }

  /**
   * Return if the user is authenticated
   */
  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  openDialog() {
    if (this.targetEntityType === PROJECT_ENTITY) {
      this.createSubproject();
    } else if (this.targetEntityType === 'comment') {
      this.createComment();
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
    modalRef.componentInstance.scope = this.targetEntityType === environment.projects.commentEntityName ? null : this.scope;
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
    const modalRef = this.modalService.open(CreateProjectComponent, { size: 'lg' });
    modalRef.componentInstance.isSubproject = true;
    modalRef.componentInstance.parentProjectUUID = this.scope;
  }

  /**
   * Open creation sub-project modal
   */
  createComment() {
    this.item.owningCollection.pipe(
      getFirstSucceededRemoteDataPayload()
    ).subscribe((colection: Collection) => {
      const modalRef = this.modalService.open(CreateItemSubmissionModalComponent, { size: 'lg' });
      modalRef.componentInstance.entityType = this.targetEntityType;
      modalRef.componentInstance.collectionId = colection.id;
      modalRef.componentInstance.formName = environment.comment.commentEditFormSection;
    });
  }
}
