import { DynamicFormControlLayout, DynamicSelectModelConfig } from '@ng-dynamic-forms/core';

import { DynamicRowArrayModelConfig } from '../../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-row-array-model';
import { DsDynamicTextAreaModelConfig } from '../../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-textarea.model';

export const EXPLOITATION_PLAN_ARRAY_LAYOUT: DynamicFormControlLayout = {
  grid: {
    group: 'form-row'
  }
};

export const EXPLOITATION_PLAN_ARRAY_CONFIG: DynamicRowArrayModelConfig = {
  id: 'bsFormArray',
  label: 'Exploitation Plans',
  initialCount: 1,
  notRepeatable: false,
  groupFactory: null,
  required: false,
  showButtons: true,
  hasSelectableMetadata: false,
  metadataFields: [],
  metadataKey: '',
  relationshipConfig: undefined,
  submissionId: '',
};

export const EXPLOITATION_PLAN_SELECT_LAYOUT: DynamicFormControlLayout = {
  element:{
    host: 'col'
  }
};

export const EXPLOITATION_PLAN_SELECT_CONFIG: DynamicSelectModelConfig<any> = {
  id: 'exploitationPlans',
  options: [],
  value: null
};

export const EXPLOITATION_PLAN_DEFAULT_SELECT_OPTIONS = [
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
];

export const TASK_NOTE_TEXTAREA_CONFIG: DsDynamicTextAreaModelConfig = {
  id: 'note',
  label: 'Note',
  placeholder: 'Note',
  metadataFields: [],
  repeatable: false,
  required: true,
  rows: 5,
  submissionId: null,
  hasSelectableMetadata: false,
};
