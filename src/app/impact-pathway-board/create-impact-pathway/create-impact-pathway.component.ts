import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, of as observableOf } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import {
  COLLECTION_PARENT_PARAMETER,
  getCollectionCreatePath
} from '../../+collection-page/collection-page-routing.module';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { ImpactPathwayService } from '../../core/impact-pathway/impact-pathway.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { CoreState } from '../../core/core.reducers';
import { GenerateImpactPathwayAction } from '../../core/impact-pathway/impact-pathway.actions';
import { isImpactPathwayProcessingSelector } from '../../core/impact-pathway/selectors';

/**
 * Component to wrap a list of existing communities inside a modal
 * Used to choose a community from to create a new collection in
 */

@Component({
  selector: 'ds-create-collection-parent-selector',
  templateUrl: './create-impact-pathway.component.html',
})
export class CreateImpactPathwayComponent implements OnInit {

  /**
   * The reject form group
   */
  public createForm: FormGroup;

  public processing$: Observable<boolean> = observableOf(false);

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private impactPathwayService: ImpactPathwayService,
    private notificationService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<CoreState>) {
  }

  ngOnInit(): void {
    this.processing$ = this.store.pipe(
      select(isImpactPathwayProcessingSelector)
    );
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
    this.store.dispatch(new GenerateImpactPathwayAction(impactPathwayName, this.activeModal));
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
    this.router.navigate([getCollectionCreatePath()], navigationExtras);
  }

}