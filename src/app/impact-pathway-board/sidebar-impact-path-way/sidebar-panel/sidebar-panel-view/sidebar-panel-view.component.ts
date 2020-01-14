import { Component, Input, OnInit } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs/';
import { distinctUntilChanged, filter, flatMap, map, tap } from 'rxjs/operators';
import {
  DynamicFormControlModel,
  DynamicSelectModel,
  DynamicSelectModelConfig,
  DynamicTextAreaModel
} from '@ng-dynamic-forms/core';
import { remove } from 'lodash';

import { ImpactPathWayTask } from '../../../../core/impact-pathway/models/impact-path-way-task.model';
import {
  DynamicRowArrayModel,
  DynamicRowArrayModelConfig
} from '../../../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-row-array-model';
import {
  EXPLOITATION_PLAN_ARRAY_CONFIG,
  EXPLOITATION_PLAN_ARRAY_LAYOUT,
  EXPLOITATION_PLAN_DEFAULT_SELECT_OPTIONS,
  EXPLOITATION_PLAN_SELECT_CONFIG,
  EXPLOITATION_PLAN_SELECT_LAYOUT,
  TASK_NOTE_TEXTAREA_CONFIG
} from '../../../../core/impact-pathway/models/task-edit-form.model';
import { isEmpty, isNotEmpty, isNotUndefined } from '../../../../shared/empty.util';
import {
  DsDynamicTextAreaModel,
  DsDynamicTextAreaModelConfig
} from '../../../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-textarea.model';
import { FormService } from '../../../../shared/form/form.service';
import { SidebarPanelComponent } from '../sidebar-panel.component';
import { MetadataMap } from '../../../../core/shared/metadata.models';
import { ExploitationPlanType } from '../../../../core/impact-pathway/models/exploitation-plan-type';

@Component({
  selector: 'ipw-sidebar-panel-view',
  styleUrls: ['./sidebar-panel-view.component.scss'],
  templateUrl: './sidebar-panel-view.component.html'
})

/**
 * Represents a part of the filter section for a single type of filter
 */
export class SidebarPanelViewComponent implements OnInit {

  /**
   * The form id
   */
  public formId$: Observable<string>;

  /**
   * The form layout
   */
  public formLayout;

  /**
   * The form model
   */
  public formModel$: Observable<DynamicFormControlModel[]> = observableOf([]);

  public formModel2: DynamicFormControlModel[] = [

    new DynamicRowArrayModel({

        id: 'bsFormArray',
        label: 'Exploitation Plans',
        initialCount: 1,
        notRepeatable: false,
        required: false,
        showButtons: true,
        groupFactory: () => {
          return [
            new DynamicSelectModel({

                id: 'exploitationPlans',
                options: [
                  {
                    label: 'Question 1',
                    value: 'question-1'
                  },
                  {
                    label: 'Question 2',
                    value: 'question-2'
                  },
                  {
                    label: 'Question 3',
                    value: 'question-3'
                  },
                  {
                    label: 'Question 4',
                    value: 'question-4'
                  }
                ],
                value: ''
              },
              {
                element: {
                  host: 'col'
                }
              })
          ];
        }
      },
      {
        grid: {
          group: 'form-row'
        }
      })
    ,
    new DynamicTextAreaModel({

      id: 'note',
      label: 'Note',
      placeholder: 'Note',
      rows: 5
    })
  ];

  public displaySubmit = false;

  private task: ImpactPathWayTask;

  @Input() task$: Observable<ImpactPathWayTask>;
  @Input() panel: SidebarPanelComponent;

  constructor(private formService: FormService) {

  }

  ngOnInit(): void {
    this.formId$ = this.task$.pipe(
      filter((task: ImpactPathWayTask) => isNotEmpty(task)),
      map((task: ImpactPathWayTask) => `form-${task.id}`)
    );

    this.formModel$ = this.initModel();

    this.formId$.pipe(
      filter((formId) => isNotUndefined(formId)),
      flatMap((formId) => this.formService.getFormData(formId)))
      .subscribe((formData: MetadataMap) => {
        let changes = false;
        if (formData.exploitationPlans) {
          this.task.exploitationPlans = formData.exploitationPlans
            .map((exploitationPlan) => exploitationPlan.value as ExploitationPlanType);
          changes = true;
        }

        if (formData.note) {
          this.task.item.note = formData.note[0].value;
          changes = true;
        }
      })
  }

  private initModel(): Observable<any[]> {
    return this.task$.pipe(
      map((task: ImpactPathWayTask) => {
        this.task = task;
        let arrayCounter = 0;
        const arrayConfig = Object.assign({} as DynamicRowArrayModelConfig, EXPLOITATION_PLAN_ARRAY_CONFIG);
        arrayConfig.initialCount = isEmpty(task.exploitationPlans) ? 1 : task.exploitationPlans.length;
        arrayConfig.groupFactory = () => {
          let model;
          const selectConfig = Object.assign({} as DynamicSelectModelConfig<any>, EXPLOITATION_PLAN_SELECT_CONFIG);
          selectConfig.options = Array.from(EXPLOITATION_PLAN_DEFAULT_SELECT_OPTIONS);
          if ((arrayCounter === 0)) {
            model = new DynamicSelectModel(selectConfig, EXPLOITATION_PLAN_SELECT_LAYOUT);
            arrayCounter++;
          } else {
            selectConfig.value = task.exploitationPlans[arrayCounter - 1] || null;
            if (task.exploitationPlans.length > 0) {
              let options = Array.from(EXPLOITATION_PLAN_DEFAULT_SELECT_OPTIONS);
              task.exploitationPlans.forEach((value) => {
                // removed already selected value from the list, expect itself
                options = remove(options, (option) => {
                  return option.value !== value || option.value === selectConfig.value;
                });
              });
              selectConfig.options = options;
            }
            model = new DynamicSelectModel(selectConfig, EXPLOITATION_PLAN_SELECT_LAYOUT);
            arrayCounter++;
          }
          return [model]
        };

        const arrayModel = new DynamicRowArrayModel(arrayConfig, EXPLOITATION_PLAN_ARRAY_LAYOUT);

        const noteConfig = Object.assign({} as DsDynamicTextAreaModelConfig, TASK_NOTE_TEXTAREA_CONFIG);
        noteConfig.value = task.item.note || null;
        const noteModel = new DsDynamicTextAreaModel(noteConfig);

        return [arrayModel, noteModel];
      }),
      tap((model) => {
        if (isNotEmpty(model) && this.panel.collapsed.value) {
          this.panel.toggle();
        }
      }),
      distinctUntilChanged()
    );
  }
}
