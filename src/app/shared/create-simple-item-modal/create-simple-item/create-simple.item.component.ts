import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { SubmissionFormModel } from '../../../core/config/models/config-submission-form.model';
import { FormService } from '../../form/form.service';
import { FormBuilderService } from '../../form/builder/form-builder.service';
import { FormFieldMetadataValueObject } from '../../form/builder/models/form-field-metadata-value.model';
import { SimpleItem } from '../models/simple-item.model';

@Component({
  selector: 'ds-create-simple-item',
  styleUrls: ['./create-simple-item.component.scss'],
  templateUrl: './create-simple-item.component.html'
})
export class CreateSimpleItemComponent implements OnInit, OnDestroy {

  @Input() formConfig: Observable<SubmissionFormModel>;
  @Input() processing: Observable<boolean>;

  @Output() createItem: EventEmitter<SimpleItem> = new EventEmitter<SimpleItem>();

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

  public displaySubmit = true;

  constructor(
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private formBuilderService: FormBuilderService,
    private formService: FormService) {
  }

  ngOnInit(): void {

    this.formId = this.formService.getUniqueId('create-simple-item');
    this.initFormModel();

  }

  isProcessing(): Observable<boolean> {
    return this.processing;
  }

  private initFormModel() {
    this.formConfig
      .subscribe((formConfig: SubmissionFormModel) => {
        this.formModel = this.formBuilderService.modelFromConfiguration(
          null,
          formConfig,
          ''
        )
      });
  }

  public createTask(data: Observable<any>) {
    data.pipe(first()).subscribe((formData) => {

      const type = (formData['relationship.type']) ? formData['relationship.type'][0] : null;
      const metadataMap = {};
      Object.keys(formData).forEach((metadataName) => {
        metadataMap[metadataName] = formData[metadataName].map((formValue: FormFieldMetadataValueObject) => ({
          language: formValue.language,
          value: formValue.value,
          place: formValue.place,
          authority: formValue.authority,
          confidence: formValue.confidence
        }))
      });

      this.createItem.emit({ type: type, metadata: metadataMap });
    })
  }

  ngOnDestroy(): void {
    this.formId = null;
    this.formModel = null;
  }
}
