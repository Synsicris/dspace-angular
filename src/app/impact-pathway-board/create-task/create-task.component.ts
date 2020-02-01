import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormControlModel, DynamicSelectModel, DynamicSelectModelConfig } from '@ng-dynamic-forms/core';

import { ImpactPathwayStep } from '../../core/impact-pathway/models/impact-pathway-step.model';
import {
  TASK_DESCRIPTION_CONFIG,
  TASK_TITLE_INPUT_CONFIG,
  TASK_TYPE_SELECT_CONFIG
} from '../../core/impact-pathway/models/task-create-form.model';
import { DsDynamicInputModel } from '../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { DsDynamicTextAreaModel } from '../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-textarea.model';
import {
  DynamicRowArrayModel,
  DynamicRowArrayModelConfig
} from '../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-row-array-model';
import {
  EXPLOITATION_PLAN_ARRAY_CONFIG,
  EXPLOITATION_PLAN_ARRAY_LAYOUT,
  EXPLOITATION_PLAN_DEFAULT_SELECT_OPTIONS,
  EXPLOITATION_PLAN_SELECT_CONFIG,
  EXPLOITATION_PLAN_SELECT_LAYOUT,
  TASK_NOTE_TEXTAREA_CONFIG
} from '../../core/impact-pathway/models/task-edit-form.model';
import { ExploitationPlanType } from '../../core/impact-pathway/models/exploitation-plan-type';
import { ImpactPathwayService } from '../../core/impact-pathway/impact-pathway.service';
import { ImpactPathwayStepType } from '../../core/impact-pathway/models/impact-pathway-step-type';
import { SubmissionFormModel } from '../../core/config/models/config-submission-form.model';
import { FormBuilderService } from '../../shared/form/builder/form-builder.service';
import { FormService } from '../../shared/form/form.service';
import { AppState } from '../../app.reducer';
import { select, Store } from '@ngrx/store';
import {
  GenerateImpactPathwayTaskAction,
  InitImpactPathwayAction
} from '../../core/impact-pathway/impact-pathway.actions';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { isImpactPathwayProcessingSelector } from '../../core/impact-pathway/selectors';

@Component({
  selector: 'ipw-create-task',
  styleUrls: ['./create-task.component.scss'],
  templateUrl: './create-task.component.html'
})
export class CreateTaskComponent implements OnInit, OnDestroy {

  @Input() step: ImpactPathwayStep;

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

  public processing$: Observable<boolean> = observableOf(false);

  private typeModel: DynamicSelectModel<any>;
  private titleModel: DsDynamicInputModel;
  private descriptionModel: DsDynamicTextAreaModel;
  private exploitationPlanModel: DynamicRowArrayModel;
  private noteModel;

  constructor(
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private formBuilderService: FormBuilderService,
    private formService: FormService,
    private impactPathwayService: ImpactPathwayService,
    private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.processing$ = this.store.pipe(
      select(isImpactPathwayProcessingSelector)
    );

    this.formId = this.formService.getUniqueId('create-task');
    this.initFormModel();

  }

  private initFormModel() {
    this.impactPathwayService.getImpactPathwayStepTaskFormConfig(this.step.type)
      .subscribe((formConfig: SubmissionFormModel) => {
        this.formModel = this.formBuilderService.modelFromConfiguration(
          null,
          formConfig,
          ''
        )
      });

/*    this.initTypeModel();
    this.initTitleModel();
    this.initDescriptionModel();
    this.initExploitationPlanModel();
    this.initNoteModel();

    this.formModel = [
      this.typeModel,
      this.titleModel,
      this.descriptionModel,
      this.exploitationPlanModel,
      this.noteModel
    ];*/
  }

  private initTypeModel(): void {
    const selectConfig = Object.assign({} as DynamicSelectModelConfig<any>, TASK_TYPE_SELECT_CONFIG);
    const taskList = this.impactPathwayService.getAvailableTaskTypeByStep(this.step.type)
      .map((taskType) => {
        return {
          label: taskType,
          value: taskType
        }
      });

    selectConfig.options = Array.from(taskList);
    this.typeModel = new DynamicSelectModel(selectConfig);
  }

  private initTitleModel(): void {
    this.titleModel = new DsDynamicInputModel(TASK_TITLE_INPUT_CONFIG);
  }

  private initDescriptionModel(): void {
    this.descriptionModel = new DsDynamicTextAreaModel(TASK_DESCRIPTION_CONFIG);
  }

  private initExploitationPlanModel() {
    let arrayCounter = 0;
    const arrayConfig = Object.assign({} as DynamicRowArrayModelConfig, EXPLOITATION_PLAN_ARRAY_CONFIG);
    // arrayConfig.initialCount = isEmpty(task.item.exploitationPlans) ? 1 : task.item.exploitationPlans.length;
    arrayConfig.initialCount = 1;
    arrayConfig.groupFactory = () => {
      let model;
      const selectConfig = Object.assign({} as DynamicSelectModelConfig<any>, EXPLOITATION_PLAN_SELECT_CONFIG);
      selectConfig.options = Array.from(EXPLOITATION_PLAN_DEFAULT_SELECT_OPTIONS);
      if ((arrayCounter === 0)) {
        model = new DynamicSelectModel(selectConfig, EXPLOITATION_PLAN_SELECT_LAYOUT);
        arrayCounter++;
      } else {
        selectConfig.value = null;
        /*        if (task.item.exploitationPlans.length > 0) {
                  let options = Array.from(EXPLOITATION_PLAN_DEFAULT_SELECT_OPTIONS);
                  task.item.exploitationPlans.forEach((value) => {
                    // removed already selected value from the list, expect itself
                    options = remove(options, (option) => {
                      return option.value !== value || option.value === selectConfig.value;
                    });
                  });
                  selectConfig.options = options;
                }*/
        model = new DynamicSelectModel(selectConfig, EXPLOITATION_PLAN_SELECT_LAYOUT);
        arrayCounter++;
      }
      return [model]
    };

    this.exploitationPlanModel = new DynamicRowArrayModel(arrayConfig, EXPLOITATION_PLAN_ARRAY_LAYOUT);
  }

  private initNoteModel(): void {
    this.noteModel = new DsDynamicTextAreaModel(TASK_NOTE_TEXTAREA_CONFIG);
  }

  public createTask(data: Observable<any>) {
    data.pipe(first()).subscribe((formData) => {
      console.log(formData);
      const type = (formData['relationship.type']) ? formData['relationship.type'][0].value : null;
      const title = (formData['dc.title']) ? formData['dc.title'][0].value : null;
      const description = (formData['dc.description']) ? formData['dc.description'][0].value : null;

      // let exploitationPlans = [];
      // if (formData.exploitationPlans) {
      //   exploitationPlans = formData.exploitationPlans
      //     .map((exploitationPlan) => exploitationPlan.value as ExploitationPlanType);
      // }
      //
      // const note = (formData.note) ? formData.note[0].value : null;
      //

      this.store.dispatch(new GenerateImpactPathwayTaskAction(
          this.step.parentId,
          this.step.id,
          type,
          title,
          description,
          this.activeModal));
      // this.cdr.detectChanges();
      // this.activeModal.close(true);
    })
  }

  ngOnDestroy(): void {
    this.formId = null;
    this.formModel = null;
    this.typeModel = null;
    this.titleModel = null;
    this.descriptionModel = null;
    this.exploitationPlanModel = null;
    this.noteModel = null;
  }
}
