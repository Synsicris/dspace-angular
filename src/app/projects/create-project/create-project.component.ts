import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ProjectDataService } from '../../core/project/project-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Community } from '../../core/shared/community.model';
import { RequestService } from '../../core/data/request.service';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';

/**
 * Component to wrap a form inside a modal
 * Used to create a new project
 */
@Component({
  selector: 'ds-create-project-parent-selector',
  templateUrl: './create-project.component.html',
})
export class CreateProjectComponent implements OnInit {

  /**
   * The reject form group
   */
  public createForm: FormGroup;

  public processing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Initialize instance variables
   *
   * @param {NgbActiveModal} activeModal
   * @param {FormBuilder} formBuilder
   * @param {NotificationsService} notificationService
   * @param {ProjectDataService} projectService
   * @param {RequestService} requestService
   * @param {ActivatedRoute} route
   * @param {Router} router
   * @param {TranslateService} translate
   */
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private notificationService: NotificationsService,
    private projectService: ProjectDataService,
    private requestService: RequestService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService) {
  }

  /**
   * Initialize the component, setting up creation form
   */
  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  /**
   * Close the active modal
   */
  close() {
    this.createForm.reset();
    this.activeModal.close();
  }

  /**
   * Dispatch new project creation
   */
  create() {
    this.processing$.next(true);
    const projectName = this.createForm.get('name').value;
    this.projectService.createProject(projectName)
      .subscribe((response: RemoteData<Community>) => {
        if (response.hasSucceeded) {
          this.navigate(response.payload);
          response.payload.parentCommunity.pipe(getFirstSucceededRemoteDataPayload())
            .subscribe((parent: Community) => {
              this.notificationService.success(null, this.translate.instant('project.create.success'));
              this.requestService.removeByHrefSubstring(parent._links.self.href);
            });
        }
        this.processing$.next(false);
        this.close();
    });
  }

  /**
   * Navigate to the collection create page
   */
  navigate(dso: DSpaceObject) {
    this.router.navigate(['project-overview', dso.id]);
  }

}
