import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core';

import { SubmissionFormModel } from '../../core/config/models/config-submission-form.model';
import { FormBuilderService } from '../form/builder/form-builder.service';
import { FormService } from '../form/form.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { Item } from '../../core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { SubmissionFormsModel } from '../../core/config/models/config-submission-forms.model';
import { SubmissionScopeType } from '../../core/submission/submission-scope-type';
import { EditSimpleItemModalComponent } from '../edit-simple-item-modal/edit-simple-item-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ds-view-simple-item-form',
  templateUrl: './view-simple-item-form.component.html',
  styleUrls: ['./view-simple-item-form.component.scss']
})
export class ViewSimpleItemFormComponent implements OnInit {

  /**
   * The item edit mode
   */
  @Input() editMode: string;

  /**
   * The label to use as edit button's title
   */
  @Input() public editTitle: string;

  /**
   * The label to use as field title
   */
  @Input() public fieldTitle: string;

  /**
   * The form config
   * @type {Observable<SubmissionFormModel>}
   */
  @Input() formConfig: Observable<SubmissionFormModel>;

  /**
   * The path to metadata section to patch
   */
  @Input() formSectionName: string;

  /**
   * The item's id related to the edit form
   */
  @Input() itemId: string;

  /**
   * The form id
   */
  public formId: string;

  /**
   * The form layout
   */
  public formLayout;

  /**
   * The form model
   */
  public formModel: DynamicFormControlModel[];

  /**
   * EventEmitter that will emit the updated item
   */
  @Output() itemUpdate: EventEmitter<Item> = new EventEmitter<Item>();

  /**
   * The textarea disabled
   */
  @Input() public disabled = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilderService: FormBuilderService,
    private formService: FormService,
    private itemService: ItemDataService,
    private modalService: NgbModal
  ) {
  }

  /**
   * Initialize all instance variables and init form
   */
  ngOnInit(): void {
    this.formId = this.formService.getUniqueId('view-simple-item');
    this.initFormModel();
  }

  openEditModal() {
    const modalRef = this.modalService.open(EditSimpleItemModalComponent, { size: 'lg' });
    modalRef.componentInstance.editMode = this.editMode;
    modalRef.componentInstance.formConfig = this.formConfig;
    modalRef.componentInstance.formSectionName = this.formSectionName;
    modalRef.componentInstance.itemId = this.itemId;

    modalRef.componentInstance.itemUpdate.subscribe((item: Item) => {
      this.formModel = null;
      this.cdr.detectChanges();
      this.initFormModel();
      this.cdr.detectChanges();
      this.itemUpdate.emit(item);
    });
  }

  /**
   * Retrieve form configuration and build form model
   */
  private initFormModel() {
    const item$: Observable<Item> = this.itemService.findById(this.itemId).pipe(
      getFirstSucceededRemoteDataPayload()
    );
    observableCombineLatest([item$, this.formConfig]).pipe(take(1))
      .subscribe(([item, formConfig]: [Item, SubmissionFormsModel]) => {
        this.formModel = this.formBuilderService.modelFromConfiguration(
          null,
          formConfig,
          '',
          item.metadata,
          SubmissionScopeType.WorkspaceItem,
          true
        );
      });
  }

}
