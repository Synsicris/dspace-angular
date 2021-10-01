import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { map, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../../core/auth/auth.service';
import { SubmissionImportExternalCollectionComponent } from '../../../submission/import-external/import-external-collection/submission-import-external-collection.component';
import { CollectionListEntry } from '../../collection-dropdown/collection-dropdown.component';
import { EntityTypeService } from '../../../core/data/entity-type.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { isNotEmpty } from '../../empty.util';
import { CreateProjectComponent } from '../../../projects/create-project/create-project.component';
import { PROJECT_ENTITY } from '../../../core/project/project-data.service';

@Component({
  selector: 'ds-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.scss']
})
export class ItemCreateComponent implements OnInit {

  /**
   * The entity type for which create an item
   */
  @Input() entityType: string;
  /**
   * The current relevant scope
   */
  @Input() scope: string;

  canShow$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService, private entityTypeService: EntityTypeService, private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    console.log(this.entityType);
    combineLatest([
      this.authService.isAuthenticated(),
      this.entityTypeService.getEntityTypeByLabel(this.entityType).pipe(
        getFirstSucceededRemoteDataPayload()
      )]
    ).pipe(
      map(([isAuthenticated, entityType]) => isAuthenticated && isNotEmpty(entityType)),
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
    if (this.entityType === PROJECT_ENTITY) {
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
    modalRef.componentInstance.entityType = this.entityType;
    modalRef.componentInstance.scope = this.scope;
    modalRef.componentInstance.selectedEvent.pipe(
      take(1)
    ).subscribe((collectionListEntry: CollectionListEntry) => {
      modalRef.close();
      const navigationExtras: NavigationExtras = {
        queryParams: {
          ['collection']: collectionListEntry.collection.uuid,
        }
      };
      if (this.entityType) {
        navigationExtras.queryParams.entityType = this.entityType;
      }
      this.router.navigate(['/submit'], navigationExtras);
    });
  }

  /**
   * Open creation sub-project modal
   */
  createSubproject() {
    const modalRef = this.modalService.open(CreateProjectComponent);
    modalRef.componentInstance.isSubproject = true;
    modalRef.componentInstance.parentProjectUUID = this.scope;
  }
}
