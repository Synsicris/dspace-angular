import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ProjectDataService, ProjectGrantsTypes } from '../../core/project/project-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Community } from '../../core/shared/community.model';
import { RequestService } from '../../core/data/request.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { createFailedRemoteDataObject$ } from '../../shared/remote-data.utils';
import { VocabularyService } from '../../core/submission/vocabularies/vocabulary.service';
import { VocabularyOptions } from '../../core/submission/vocabularies/models/vocabulary-options.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { VocabularyEntry } from '../../core/submission/vocabularies/models/vocabulary-entry.model';
import { environment } from '../../../environments/environment';
import { getItemPageRoute } from '../../item-page/item-page-routing-paths';
import { Item } from '../../core/shared/item.model';
import { isNotEmpty } from '../../shared/empty.util';

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
    { id: ProjectGrantsTypes.Project, name: 'project.create.grants.project-option' },
    { id: ProjectGrantsTypes.OwningCommunity, name: 'project.create.grants.subproject-option' }
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
            id: entry.value as any,
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
    this.processing$.next(false);
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
      // TODO fix in the rest configuration
      const projectGrants = (this.createForm.get('grants').value === ProjectGrantsTypes.Subproject) ?
        ProjectGrantsTypes.OwningCommunity : ProjectGrantsTypes.Project;
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
          } else {
            this.notificationService.error(null,  this.translate.instant('project.create.error'));
          }
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
    this.projectService.getProjectItemByProjectCommunity(dso as Community).pipe(
      take(1),
      map((itemRD: RemoteData<Item>) => itemRD.hasSucceeded ? itemRD.payload : null),
    ).subscribe((projectItem: Item) => {
      this.close();
      if (isNotEmpty(projectItem)) {
        this.router.navigate([getItemPageRoute(projectItem)]);
      } else {
        this.notificationService.error(null,  this.translate.instant('project.create.error'));
      }
    });

  }

}
