import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { TranslateService } from '@ngx-translate/core';

import { SubmissionFormModel } from '../../../core/config/models/config-submission-form.model';
import { FormService } from '../../form/form.service';
import { FormBuilderService } from '../../form/builder/form-builder.service';
import { FormFieldMetadataValueObject } from '../../form/builder/models/form-field-metadata-value.model';
import { SimpleItem } from '../models/simple-item.model';
import { dateToISOFormat, isNgbDateStruct } from '../../date.util';
import { isNotEmpty } from '../../empty.util';
import { SubmissionScopeType } from '../../../core/submission/submission-scope-type';

@Component({
  selector: 'ds-create-simple-item',
  styleUrls: ['./create-simple-item.component.scss'],
  templateUrl: './create-simple-item.component.html'
})
export class CreateSimpleItemComponent implements OnInit, OnDestroy {

  /**
   * The form config
   * @type {Observable<SubmissionFormModel>}
   */
  @Input() formConfig: Observable<SubmissionFormModel>;

  /**
   * The form config name
   * @type {string}
   */
  @Input() formHeader: string;

  /**
   * A boolean representing if an operation is processing
   * @type {Observable<boolean>}
   */
  @Input() processing: Observable<boolean>;

  /**
   * The collection scope used for authority
   * @type {string}
   */
  @Input() authorityScope: string;

  /**
   * EventEmitter that will emit a SimpleItem object
   */
  @Output() createItem: EventEmitter<SimpleItem> = new EventEmitter<SimpleItem>();

  /**
   * A boolean representing if there is an info message to display
   */
  public hasInfoMessage: Observable<boolean>;

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
  public formModel$ = new BehaviorSubject<DynamicFormControlModel[]>([]);

  /**
   * A boolean that indicate if to display form's submit and cancel buttons
   */
  public displaySubmit = true;

  /**
   * The i18n key of the info message to display
   */
  public messageInfoKey;

  private subscription = new Subscription();

  constructor(
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private formBuilderService: FormBuilderService,
    private formService: FormService,
    private translate: TranslateService) {
  }

  /**
   * Initialize all instance variables and init form
   */
  ngOnInit(): void {
    this.formId = this.formService.getUniqueId('create-simple-item');
    this.initFormModel();
    this.messageInfoKey = 'submission.sections.submit.progressbar.' + this.formHeader + '.info';
    this.hasInfoMessage = this.translate.get( this.messageInfoKey ).pipe(
      map((message: string) => isNotEmpty(message) && this.messageInfoKey !== message)
    );
  }

  /**
   * Return boolean representing if an operation is processing
   *
   * @return {Observable<boolean>}
   */
  isProcessing(): Observable<boolean> {
    return this.processing;
  }

  /**
   * Retrieve form configuration and build form model
   */
  private initFormModel() {
    this.subscription.add(
      this.formConfig
        .pipe(
          map(formConfig =>
            this.formBuilderService.modelFromConfiguration(
              null,
              formConfig,
              this.authorityScope || '',
              null,
              SubmissionScopeType.WorkspaceItem
            )
          )
        )
        .subscribe((formModel: DynamicFormControlModel[]) => this.formModel$.next(formModel))
    );
    this.subscription.add(
      this.formModel$
        .subscribe(formModel => this.formBuilderService.addFormModel(this.formId, formModel))
    );
  }

  /**
   * Create a new SimpleItem object and emit an event containing it
   */
  public createTask(data: Observable<any>): void {
    this.subscription.add(
      data.pipe(first()).subscribe((formData) => {

        const type = (formData['dspace.entity.type']) ? formData['dspace.entity.type'][0] : null;
        const metadataMap = {};
        Object.keys(formData).forEach((metadataName) => {
          metadataMap[metadataName] = formData[metadataName].map((formValue: FormFieldMetadataValueObject) => ({
            language: formValue.language,
            value: (isNgbDateStruct(formValue.value)) ? dateToISOFormat(formValue.value) : formValue.value,
            place: formValue.place,
            authority: formValue.authority,
            confidence: formValue.confidence
          }));
        });

        this.createItem.emit({ type: type, metadata: metadataMap });
      })
    );
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.formId = null;
    this.formModel$.complete();
    this.formBuilderService.removeFormModel(this.formId);
    this.subscription.unsubscribe();
  }
}
