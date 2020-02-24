import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core';

import { ImpactPathwayStep } from '../../core/impact-pathway/models/impact-pathway-step.model';
import { ImpactPathwayService } from '../../core/impact-pathway/impact-pathway.service';
import { SubmissionFormModel } from '../../core/config/models/config-submission-form.model';
import { FormBuilderService } from '../../shared/form/builder/form-builder.service';
import { FormService } from '../../shared/form/form.service';
import { ImpactPathwayTask } from '../../core/impact-pathway/models/impact-pathway-task.model';
import { FormFieldMetadataValueObject } from '../../shared/form/builder/models/form-field-metadata-value.model';

@Component({
  selector: 'ipw-create-task',
  styleUrls: ['./create-task.component.scss'],
  templateUrl: './create-task.component.html'
})
export class CreateTaskComponent implements OnInit, OnDestroy {

  @Input() step: ImpactPathwayStep;
  @Input() parentTask: ImpactPathwayTask;
  @Input() isObjectivePage: boolean;

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

  private processing$: Observable<boolean> = observableOf(false);

  constructor(
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private formBuilderService: FormBuilderService,
    private formService: FormService,
    private impactPathwayService: ImpactPathwayService) {
  }

  ngOnInit(): void {
    this.processing$ = this.impactPathwayService.isProcessing();

    this.formId = this.formService.getUniqueId('create-task');
    this.initFormModel();

  }

  isProcessing(): Observable<boolean> {
    return this.processing$;
  }

  private initFormModel() {
    this.impactPathwayService.getImpactPathwayStepTaskFormConfig(this.step.type, this.isObjectivePage)
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

      const type = (formData['relationship.type']) ? formData['relationship.type'][0].value : null;
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

      if (this.isObjectivePage) {
        this.impactPathwayService.dispatchGenerateImpactPathwaySubTask(
          this.step.parentId,
          this.step.id,
          this.parentTask.id,
          type,
          metadataMap,
          this.activeModal);
      } else {
        this.impactPathwayService.dispatchGenerateImpactPathwayTask(
          this.step.parentId,
          this.step.id,
          type,
          metadataMap,
          this.activeModal);
      }
    })
  }

  ngOnDestroy(): void {
    this.formId = null;
    this.formModel = null;
  }
}
