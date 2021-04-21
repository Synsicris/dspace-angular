import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ProjectDataService } from '../../core/project/project-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Community } from '../../core/shared/community.model';
import { RequestService } from '../../core/data/request.service';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { createFailedRemoteDataObject$ } from '../../shared/remote-data.utils';
import { VocabularyService } from '../../core/submission/vocabularies/vocabulary.service';
import { VocabularyOptions } from '../../core/submission/vocabularies/models/vocabulary-options.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { VocabularyEntry } from '../../core/submission/vocabularies/models/vocabulary-entry.model';
import { environment } from '../../../environments/environment';

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
   * A boolean representing if creation regarding a project or a subproject
   */
  @Input() isSubproject = false;

  /**
   * In case of subproject represent the parent project's UUID
   */
  @Input() parentProjectUUID: string;

  /**
   * The reject form group
   */
  public createForm: FormGroup;

  /**
   * The grant options available
   */
  public grantsOptions = [
    { id: 'project', name: 'project.create.grants.project-option' },
    { id: 'subproject', name: 'project.create.grants.subproject-option' }
  ];

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
   * @param {VocabularyService} vocabulary
   */
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private notificationService: NotificationsService,
    private projectService: ProjectDataService,
    private requestService: RequestService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private vocabulary: VocabularyService) {
  }

  /**
   * Initialize the component, setting up creation form
   */
  ngOnInit(): void {
    if (this.isSubproject) {
      this.vocabulary.getVocabularyEntries(
        new VocabularyOptions(environment.projects.projectsGrantsOptionsVocabularyName),
        new PageInfo()
      ).pipe(
        getFirstCompletedRemoteData()
      ).subscribe((results: RemoteData<PaginatedList<VocabularyEntry>>) => {
        if (results.hasSucceeded) {
          // use grant options from rest only if available
          this.grantsOptions = results.payload.page.map((entry: VocabularyEntry) => ({
            id: entry.value,
            name: entry.display
          }));
        }

        this.createForm = this.formBuilder.group({
          name: ['', Validators.required],
          grants: [
            '',
            Validators.required
          ]
        });
      });
    } else {
      this.createForm = this.formBuilder.group({
        name: ['', Validators.required]
      });
    }
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

    let create$: Observable<RemoteData<Community>>;
    if (this.isSubproject) {
      const projectGrants = this.createForm.get('grants').value;
      create$ = this.projectService.createSubproject(projectName, this.parentProjectUUID, projectGrants);
    } else {
      create$ = this.projectService.createProject(projectName);
    }

    create$.pipe(
      catchError(() => {
        return createFailedRemoteDataObject$() as Observable<RemoteData<Community>>;
      })
    ).subscribe({
        next: (response: RemoteData<Community>) => {
          if (response.hasSucceeded) {
            this.navigate(response.payload);
            response.payload.parentCommunity.pipe(getFirstSucceededRemoteDataPayload())
              .subscribe((parent: Community) => {
                this.notificationService.success(null, this.translate.instant('project.create.success'));
                this.requestService.removeByHrefSubstring(parent._links.self.href);
              });
          } else {
            this.notificationService.error(null,  this.translate.instant('project.create.error'));
          }
          this.processing$.next(false);
          this.close();
        },
      error: () => {
          this.notificationService.error(null,  this.translate.instant('project.create.error'));
        }
      });
  }

  /**
   * Navigate to the collection create page
   */
  navigate(dso: DSpaceObject) {
    if (this.isSubproject) {
      this.router.navigate(['project-overview', this.parentProjectUUID, 'subproject', dso.id]);
    } else {
      this.router.navigate(['project-overview', dso.id]);
    }
  }

}
