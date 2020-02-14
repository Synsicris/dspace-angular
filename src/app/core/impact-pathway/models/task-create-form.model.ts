import { DynamicSelectModelConfig } from '@ng-dynamic-forms/core';
import { DsDynamicTextAreaModelConfig } from '../../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-textarea.model';
import { DsDynamicInputModelConfig } from '../../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-input.model';

export const TASK_TYPE_SELECT_CONFIG: DynamicSelectModelConfig<any> = {
  id: 'type',
  label: 'Type',
  options: [],
  required: true,
  value: null,
  validators: {
    required: null
  },
  errorMessages: {
    required: '{{ label }} is required'
  }
};
/*
  Type1 = 'Input',
  Type2 = 'Process',
  Type3 = 'Output',
  Type4 = 'Patent',
  Type5 = 'Impact',
  Type6 = 'Contrib',
 */
export const TASK_TYPE_DEFAULT_SELECT_OPTIONS = [
  {
    label: 'Input',
    value: 'Input'
  },
  {
    label: 'Process',
    value: 'Process'
  },
  {
    label: 'Output',
    value: 'Output'
  },
  {
    label: 'Patent',
    value: 'Patent'
  },
  {
    label: 'Impact',
    value: 'Impact'
  },
  {
    label: 'Contrib',
    value: 'Contrib'
  }
];

export const TASK_TITLE_INPUT_CONFIG: DsDynamicInputModelConfig = {
  id: 'title',
  label: 'Title',
  metadataFields: [],
  repeatable: false,
  required: true,
  submissionId: null,
  value: null,
  validators: {
    required: null
  },
  errorMessages: {
    required: '{{ label }} is required'
  }
};

export const TASK_DESCRIPTION_CONFIG: DsDynamicTextAreaModelConfig = {
  id: 'description',
  label: 'Description',
  metadataFields: [],
  repeatable: false,
  rows: 5,
  required: true,
  submissionId: null,
  value: null,
  validators: {
    required: null
  },
  errorMessages: {
    required: '{{ label }} is required'
  }
};
