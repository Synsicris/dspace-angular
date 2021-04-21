import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ProjectDataService } from '../../core/project/project-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { VocabularyService } from '../../core/submission/vocabularies/vocabulary.service';
import { VocabularyOptions } from '../../core/submission/vocabularies/models/vocabulary-options.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { VocabularyEntry } from '../../core/submission/vocabularies/models/vocabulary-entry.model';
import { environment } from '../../../environments/environment';
import { ItemDataService } from '../../core/data/item-data.service';
import { Item } from '../../core/shared/item.model';
import { Metadata } from '../../core/shared/metadata.utils';

/**
 * Component to wrap a form inside a modal
 * Used to create a new project
 */
@Component({
  selector: 'ds-edit-item-grants',
  templateUrl: './edit-item-grants-modal.component.html',
})
export class EditItemGrantsModalComponent implements OnInit {

  /**
   * The target item
   */
  @Input() item: Item;

  /**
   * The current value of the item grants
   */
  public currentItemGrantsValue: string;

  /**
   * The edit item grants form group
   */
  public editForm: FormGroup;

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
   * @param {ItemDataService} itemService
   * @param {FormBuilder} formBuilder
   * @param {NotificationsService} notificationService
   * @param {ProjectDataService} projectService
   * @param {TranslateService} translate
   * @param {VocabularyService} vocabulary
   */
  constructor(
    private activeModal: NgbActiveModal,
    private itemService: ItemDataService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationsService,
    private projectService: ProjectDataService,
    private translate: TranslateService,
    private vocabulary: VocabularyService) {
  }

  /**
   * Initialize the component, setting up creation form
   */
  ngOnInit(): void {
    console.log('init');
    this.currentItemGrantsValue = Metadata.firstValue(this.item.metadata, 'cris.workspace.shared');
    console.log(this.item.metadata, this.currentItemGrantsValue);
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

      this.editForm = this.formBuilder.group({
        grants: [
          '',
          Validators.required
        ]
      });
    });

  }

  canSubmit() {
    return this.editForm.valid && (this.editForm.get('grants').value !== this.currentItemGrantsValue);
  }

  /**
   * Close the active modal
   */
  close(item?: Item) {
    this.editForm.reset();
    this.activeModal.close(item);
  }

  /**
   * Dispatch new project creation
   */
  editGrants() {
    this.processing$.next(true);
    const projectGrants = this.editForm.get('grants').value;

    this.itemService.updateItemMetadata(
      this.item.uuid,
      'cris.workspace.shared',
      0,
      projectGrants
    ).subscribe({
        next: (response: RemoteData<Item>) => {
          if (response.hasSucceeded) {
            console.log(response.payload);
            this.currentItemGrantsValue = projectGrants;
            this.notificationService.success(null, this.translate.instant('submission.workflow.generic.edit-grants.success'));
            this.close(response.payload);
          } else {
            this.notificationService.error(null,  this.translate.instant('submission.workflow.generic.edit-grants.error'));
            this.close();
          }
          this.processing$.next(false);
        },
      error: () => {
          this.notificationService.error(null,  this.translate.instant('submission.workflow.generic.edit-grants.error'));
        }
      });
  }

  /**
   * Set edit form value on radio box change
   * @param value
   */
  onChange(value) {
    this.editForm.setValue({grants: value});
  }
}
