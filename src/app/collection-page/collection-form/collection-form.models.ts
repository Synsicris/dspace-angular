import {
  DynamicCheckboxModelConfig,
  DynamicFormArrayModelConfig,
  DynamicFormControlLayout,
  DynamicFormControlModel,
  DynamicInputModel,
  DynamicTextAreaModel
} from '@ng-dynamic-forms/core';
import { DynamicSelectModelConfig } from '@ng-dynamic-forms/core/lib/model/select/dynamic-select.model';
import { environment } from '../../../environments/environment';
import { LangConfig } from '../../../config/lang-config.interface';

export const collectionFormEntityTypeSelectionConfig: DynamicSelectModelConfig<string> = {
  id: 'entityType',
  name: 'dspace.entity.type',
  required: true,
  disabled: false,
  validators: {
    required: null
  },
  errorMessages: {
    required: 'collection.form.errors.entityType.required'
  },
};

export const collectionFormSubmissionDefinitionSelectionConfig: DynamicSelectModelConfig<string> = {
  id: 'submissionDefinition',
  name: 'cris.submission.definition',
  required: true,
  disabled: false,
  validators: {
    required: null
  },
  errorMessages: {
    required: 'collection.form.errors.submissionDefinition.required'
  },
};

export const collectionFormSharedWorkspaceCheckboxConfig: DynamicCheckboxModelConfig = {
  id: 'sharedWorkspace',
  name: 'cris.workspace.shared',
  disabled: false
};

export const collectionTitleArrayConfig: DynamicFormArrayModelConfig = {
  id: 'titleArray',
  groupFactory: null,
};

export const collectionTitleArrayLayout: DynamicFormControlLayout = {
  element: {
    group: 'form-row'
  }
};
export const collectionTitleLayout: DynamicFormControlLayout = {
  grid: {
    control: 'col',
    host: 'col'
  },
};

export const titleConfig: any = {
  id: 'title',
  name: 'dc.title',
  required: true,
  languageCodes: environment.languages
    .filter((lang: LangConfig) => lang.active)
    .map((lang: LangConfig) => ({
    display: lang.label, code: lang.code
  })),
  validators: {
    required: null
  },
  errorMessages: {
    required: 'Please enter a name for this title'
  },
};

/**
 * The dynamic form fields used for creating/editing a collection
 * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
 */
export const collectionFormModels: DynamicFormControlModel[] = [
  new DynamicTextAreaModel({
    id: 'description',
    name: 'dc.description',
  }),
  new DynamicTextAreaModel({
    id: 'abstract',
    name: 'dc.description.abstract',
  }),
  new DynamicTextAreaModel({
    id: 'rights',
    name: 'dc.rights',
  }),
  new DynamicTextAreaModel({
    id: 'tableofcontents',
    name: 'dc.description.tableofcontents',
  }),
  new DynamicTextAreaModel({
    id: 'license',
    name: 'dc.rights.license',
  })
];
