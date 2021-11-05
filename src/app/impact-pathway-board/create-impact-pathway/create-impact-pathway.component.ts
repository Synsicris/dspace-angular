import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, of as observableOf } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import {
  COLLECTION_PARENT_PARAMETER,
  getCollectionCreateRoute
} from '../../collection-page/collection-page-routing-paths';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { ImpactPathwayService } from '../core/impact-pathway.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';

/**
 * Component to wrap a form inside a modal
 * Used to create a new impact pathway
 */
@Component({
  selector: 'ds-create-collection-parent-selector',
  templateUrl: './create-impact-pathway.component.html',
})
export class CreateImpactPathwayComponent implements OnInit {

  /**
   * The project's UUID where to create the new impact pathway
   */
  @Input() projectId: string;

  /**
   * The creation form group
   */
  public createForm: FormGroup;

  public processing$: Observable<boolean> = observableOf(false);

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private impactPathwayService: ImpactPathwayService,
    private notificationService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.processing$ = this.impactPathwayService.isProcessing();

    this.createForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  /**
   * Close the modal
   */
  close() {
    this.createForm.reset();
    this.activeModal.close();
  }

  create() {
    const impactPathwayName = this.createForm.get('name').value;
    this.impactPathwayService.dispatchGenerateImpactPathway(this.projectId, impactPathwayName);
  }

  /**
   * Navigate to the collection create page
   */
  navigate(dso: DSpaceObject) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        [COLLECTION_PARENT_PARAMETER]: dso.uuid,
      }
    };
    this.router.navigate([getCollectionCreateRoute()], navigationExtras);
  }

}
