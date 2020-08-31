import { hasValue, isNotEmpty, isNotNull, isUndefined } from '../../shared/empty.util';
import { differenceWith, findKey, isEqual, uniqWith } from 'lodash';

import {
  ChangeSubmissionCollectionAction,
  CompleteInitSubmissionFormAction,
  DeleteSectionErrorsAction,
  DeleteUploadedFileAction,
  DepositSubmissionAction,
  DepositSubmissionErrorAction,
  DepositSubmissionSuccessAction,
  DisableSectionAction,
  DisableSectionErrorAction,
  EditFileDataAction,
  EnableSectionAction,
  InertSectionErrorsAction,
  InitSectionAction,
  InitSubmissionFormAction,
  NewUploadedFileAction,
  RemoveSectionErrorsAction,
  ResetSubmissionFormAction,
  SaveAndDepositSubmissionAction,
  SaveForLaterSubmissionFormAction,
  SaveForLaterSubmissionFormErrorAction,
  SaveForLaterSubmissionFormSuccessAction,
  SaveSubmissionFormAction,
  SaveSubmissionFormErrorAction,
  SaveSubmissionFormSuccessAction,
  SaveSubmissionSectionFormAction,
  SaveSubmissionSectionFormErrorAction,
  SaveSubmissionSectionFormSuccessAction,
  SectionStatusChangeAction,
  SetActiveSectionAction,
  SubmissionObjectAction,
  SubmissionObjectActionTypes,
  UpdateSectionDataAction,
  SetDuplicateDecisionAction,
  SetDuplicateDecisionSuccessAction,
  SetDuplicateDecisionErrorAction
} from './submission-objects.actions';
import { WorkspaceitemSectionDataType } from '../../core/submission/models/workspaceitem-sections.model';
import { WorkspaceitemSectionUploadObject } from '../../core/submission/models/workspaceitem-section-upload.model';
import { SectionsType } from '../sections/sections-type';
import { WorkspaceitemSectionDetectDuplicateObject } from '../../core/submission/models/workspaceitem-section-deduplication.model';

/**
 * An interface to represent section visibility
 */
export interface SectionVisibility {
  main: any;
  other: any;
}

/**
 * An interface to represent section object state
 */
export interface SubmissionSectionObject {
  /**
   * The section header
   */
  header: string;

  /**
   * The section configuration url
   */
  config: string;

  /**
   * A boolean representing if this section is mandatory
   */
  mandatory: boolean;

  /**
   * The section type
   */
  sectionType: SectionsType;

  /**
   * The section visibility
   */
  visibility: SectionVisibility;

  /**
   * A boolean representing if this section is collapsed
   */
  collapsed: boolean,

  /**
   * A boolean representing if this section is enabled
   */
  enabled: boolean;

  /**
   * The section data object
   */
  data: WorkspaceitemSectionDataType;

  /**
   * The list of the section errors
   */
  errors: SubmissionSectionError[];

  /**
   * A boolean representing if this section is loading
   */
  isLoading: boolean;

  /**
   * A boolean representing if this section removal is pending
   */
  removePending: boolean;

  /**
   * A boolean representing if this section is valid
   */
  isValid: boolean;
}

/**
 * An interface to represent section error
 */
export interface SubmissionSectionError {
  /**
   * A string representing error path
   */
  path: string;

  /**
   * The error message
   */
  message: string;
}

/**
 * An interface to represent SubmissionSectionObject entry
 */
export interface SubmissionSectionEntry {
  [sectionId: string]: SubmissionSectionObject;
}

/**
 * An interface to represent submission object state
 */
export interface SubmissionObjectEntry {
  /**
   * The collection this submission belonging to
   */
  collection?: string,

  /**
   * The configuration name that define this submission
   */
  definition?: string,

  /**
   * The submission self url
   */
  selfUrl?: string;

  /**
   * The submission active section
   */
  activeSection?: string;

  /**
   * The list of submission's sections
   */
  sections?: SubmissionSectionEntry;

  /**
   * A boolean representing if this submission is loading
   */
  isLoading?: boolean;

  /**
   * A boolean representing if a submission save operation is pending
   */
  savePending?: boolean;

  /**
   * A boolean representing if a duplicate decision is pending
   */
  saveDecisionPending?: boolean;

  /**
   * A boolean representing if a submission deposit operation is pending
   */
  depositPending?: boolean;
}

/**
 * The Submission State
 *
 * Consists of a map with submission's ID as key,
 * and SubmissionObjectEntries as values
 */
export interface SubmissionObjectState {
  [submissionId: string]: SubmissionObjectEntry;
}

const initialState: SubmissionObjectState = Object.create({});

export function submissionObjectReducer(state = initialState, action: SubmissionObjectAction): SubmissionObjectState {
  switch (action.type) {

    // submission form actions
    case SubmissionObjectActionTypes.COMPLETE_INIT_SUBMISSION_FORM: {
      return completeInit(state, action as CompleteInitSubmissionFormAction);
    }

    case SubmissionObjectActionTypes.INIT_SUBMISSION_FORM: {
      return initSubmission(state, action as InitSubmissionFormAction);
    }

    case SubmissionObjectActionTypes.RESET_SUBMISSION_FORM: {
      return resetSubmission(state, action as ResetSubmissionFormAction);
    }

    case SubmissionObjectActionTypes.CANCEL_SUBMISSION_FORM: {
      return initialState;
    }

    case SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM:
    case SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM:
    case SubmissionObjectActionTypes.SAVE_AND_DEPOSIT_SUBMISSION:
    case SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM: {
      return saveSubmission(state, action as SaveSubmissionFormAction);
    }

    case SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_SUCCESS:
    case SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_SUCCESS:
    case SubmissionObjectActionTypes.SAVE_SUBMISSION_FORM_ERROR:
    case SubmissionObjectActionTypes.SAVE_FOR_LATER_SUBMISSION_FORM_ERROR:
    case SubmissionObjectActionTypes.SAVE_SUBMISSION_SECTION_FORM_ERROR: {
      return completeSave(state, action as SaveSubmissionFormErrorAction);
    }

    case SubmissionObjectActionTypes.CHANGE_SUBMISSION_COLLECTION: {
      return changeCollection(state, action as ChangeSubmissionCollectionAction);
    }

    case SubmissionObjectActionTypes.DEPOSIT_SUBMISSION: {
      return startDeposit(state, action as DepositSubmissionAction);
    }

    case SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_SUCCESS: {
      return initialState;
    }

    case SubmissionObjectActionTypes.DEPOSIT_SUBMISSION_ERROR: {
      return endDeposit(state, action as DepositSubmissionAction);
    }

    case SubmissionObjectActionTypes.DISCARD_SUBMISSION: {
      return state;
    }

    case SubmissionObjectActionTypes.DISCARD_SUBMISSION_SUCCESS: {
      return initialState;
    }

    case SubmissionObjectActionTypes.DISCARD_SUBMISSION_ERROR: {
      return state;
    }

    case SubmissionObjectActionTypes.SET_ACTIVE_SECTION: {
      return setActiveSection(state, action as SetActiveSectionAction);
    }

    // Section actions

    case SubmissionObjectActionTypes.INIT_SECTION: {
      return initSection(state, action as InitSectionAction);
    }

    case SubmissionObjectActionTypes.ENABLE_SECTION: {
      return changeSectionState(state, action as EnableSectionAction, true);
    }

    case SubmissionObjectActionTypes.UPDATE_SECTION_DATA: {
      return updateSectionData(state, action as UpdateSectionDataAction);
    }

    case SubmissionObjectActionTypes.DISABLE_SECTION: {
      return changeSectionRemoveState(state, action as DisableSectionAction, true);
    }

    case SubmissionObjectActionTypes.DISABLE_SECTION_SUCCESS: {
      return changeSectionState(state, action as DisableSectionAction, false);
    }

    case SubmissionObjectActionTypes.DISABLE_SECTION_ERROR: {
      return changeSectionRemoveState(state, action as DisableSectionErrorAction, false);
    }

    case SubmissionObjectActionTypes.SECTION_STATUS_CHANGE: {
      return setIsValid(state, action as SectionStatusChangeAction);
    }

    // Files actions
    case SubmissionObjectActionTypes.NEW_FILE: {
      return newFile(state, action as NewUploadedFileAction);
    }

    case SubmissionObjectActionTypes.EDIT_FILE_DATA: {
      return editFileData(state, action as EditFileDataAction);
    }

    case SubmissionObjectActionTypes.DELETE_FILE: {
      return deleteFile(state, action as DeleteUploadedFileAction);
    }

    // errors actions
    case SubmissionObjectActionTypes.ADD_SECTION_ERROR: {
      return addError(state, action as InertSectionErrorsAction);
    }

    case SubmissionObjectActionTypes.DELETE_SECTION_ERROR: {
      return removeError(state, action as DeleteSectionErrorsAction);
    }

    case SubmissionObjectActionTypes.REMOVE_SECTION_ERRORS: {
      return removeSectionErrors(state, action as RemoveSectionErrorsAction);
    }

    // detect duplicate
    case SubmissionObjectActionTypes.SET_DUPLICATE_DECISION: {
      return startSaveDecision(state, action as SetDuplicateDecisionAction);
    }

    case SubmissionObjectActionTypes.SET_DUPLICATE_DECISION_SUCCESS: {
      return setDuplicateMatches(state, action as SetDuplicateDecisionSuccessAction);
    }

    case SubmissionObjectActionTypes.SET_DUPLICATE_DECISION_ERROR: {
      return endSaveDecision(state, action as SetDuplicateDecisionErrorAction);
    }

    default: {
      return state;
    }
  }
}

// ------ Submission error functions ------ //

const removeError = (state: SubmissionObjectState, action: DeleteSectionErrorsAction): SubmissionObjectState => {
  const { submissionId, sectionId, errors } = action.payload;

  if (hasValue(state[ submissionId ].sections[ sectionId ])) {
    let filteredErrors;

    if (Array.isArray(errors)) {
      filteredErrors = differenceWith(errors, errors, isEqual);
    } else {
      filteredErrors = state[ submissionId ].sections[ sectionId ].errors
        .filter((currentError) => currentError.path !== errors.path || !isEqual(currentError, errors));
    }

    return Object.assign({}, state, {
      [ submissionId ]: Object.assign({}, state[ submissionId ], {
        sections: Object.assign({}, state[ submissionId ].sections, {
          [ sectionId ]: Object.assign({}, state[ submissionId ].sections [ sectionId ], {
            errors: filteredErrors
          })
        })
      })
    });
  } else {
    return state;
  }
};

const addError = (state: SubmissionObjectState, action: InertSectionErrorsAction): SubmissionObjectState => {
  const { submissionId, sectionId, error } = action.payload;

  if (hasValue(state[ submissionId ].sections[ sectionId ])) {
    const errors = uniqWith(state[ submissionId ].sections[ sectionId ].errors.concat(error), isEqual);

    return Object.assign({}, state, {
      [ submissionId ]: Object.assign({}, state[ submissionId ], {
        activeSection: state[ action.payload.submissionId ].activeSection,        sections: Object.assign({}, state[ submissionId ].sections, {
          [ sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
            errors
          })
        }),
      })
    });
  } else {
    return state;
  }
};

/**
 * Remove all section's errors.
 *
 * @param state
 *    the current state
 * @param action
 *    a RemoveSectionErrorsAction
 * @return SubmissionObjectState
 *    the new state, with the section's errors updated.
 */
function removeSectionErrors(state: SubmissionObjectState, action: RemoveSectionErrorsAction): SubmissionObjectState {
  if (isNotEmpty(state[ action.payload.submissionId ])
    && isNotEmpty(state[ action.payload.submissionId ].sections[ action.payload.sectionId])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        sections: Object.assign({}, state[ action.payload.submissionId ].sections, {
          [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
            errors: []
          })
        })
      })
    });
  } else {
    return state;
  }
}

// ------ Submission functions ------ //

/**
 * Init a SubmissionObjectState.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitSubmissionFormAction | ResetSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function initSubmission(state: SubmissionObjectState, action: InitSubmissionFormAction | ResetSubmissionFormAction): SubmissionObjectState {

  const newState = Object.assign({}, state);
  newState[ action.payload.submissionId ] = {
    collection: action.payload.collectionId,
    definition: action.payload.submissionDefinition.name,
    selfUrl: action.payload.selfUrl,
    activeSection: null,
    sections: Object.create(null),
    isLoading: true,
    savePending: false,
    saveDecisionPending: false,
    depositPending: false,
  };
  return newState;
}

/**
 * Reset submission.
 *
 * @param state
 *    the current state
 * @param action
 *    a ResetSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function resetSubmission(state: SubmissionObjectState, action: ResetSubmissionFormAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        sections: Object.create(null),
        isLoading: true
      })
    });
  } else {
    return state;
  }
}

/**
 * Set submission loading to false.
 *
 * @param state
 *    the current state
 * @param action
 *    a CompleteInitSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function completeInit(state: SubmissionObjectState, action: CompleteInitSubmissionFormAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        isLoading: false
      })
    });
  } else {
    return state;
  }
}

/**
 * Set submission save flag to true
 *
 * @param state
 *    the current state
 * @param action
 *    a SaveSubmissionFormAction | SaveSubmissionSectionFormAction
 *    | SaveForLaterSubmissionFormAction | SaveAndDepositSubmissionAction
 * @return SubmissionObjectState
 *    the new state, with the flag set to true.
 */
function saveSubmission(state: SubmissionObjectState,
                        action: SaveSubmissionFormAction
                          | SaveSubmissionSectionFormAction
                          | SaveForLaterSubmissionFormAction
                          | SaveAndDepositSubmissionAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        activeSection: state[ action.payload.submissionId ].activeSection,
        sections: state[ action.payload.submissionId ].sections,
        isLoading: state[ action.payload.submissionId ].isLoading,
        savePending: true,
      })
    });
  } else {
    return state;
  }
}

/**
 * Set submission save flag to false.
 *
 * @param state
 *    the current state
 * @param action
 *    a SaveSubmissionFormSuccessAction | SaveForLaterSubmissionFormSuccessAction
 *    | SaveSubmissionSectionFormSuccessAction | SaveSubmissionFormErrorAction
 *    | SaveForLaterSubmissionFormErrorAction | SaveSubmissionSectionFormErrorAction
 * @return SubmissionObjectState
 *    the new state, with the flag set to false.
 */
function completeSave(state: SubmissionObjectState,
                      action: SaveSubmissionFormSuccessAction
                        | SaveForLaterSubmissionFormSuccessAction
                        | SaveSubmissionSectionFormSuccessAction
                        | SaveSubmissionFormErrorAction
                        | SaveForLaterSubmissionFormErrorAction
                        | SaveSubmissionSectionFormErrorAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        savePending: false,
      })
    });
  } else {
    return state;
  }
}

/**
 * Set deposit flag to true
 *
 * @param state
 *    the current state
 * @param action
 *    a DepositSubmissionAction
 * @return SubmissionObjectState
 *    the new state, with the deposit flag changed.
 */
function startDeposit(state: SubmissionObjectState, action: DepositSubmissionAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        savePending: false,
        depositPending: true,
      })
    });
  } else {
    return state;
  }
}

/**
 * Set deposit flag to false
 *
 * @param state
 *    the current state
 * @param action
 *    a DepositSubmissionSuccessAction or a DepositSubmissionErrorAction
 * @return SubmissionObjectState
 *    the new state, with the deposit flag changed.
 */
function endDeposit(state: SubmissionObjectState, action: DepositSubmissionSuccessAction | DepositSubmissionErrorAction | DepositSubmissionAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        depositPending: false,
      })
    });
  } else {
    return state;
  }
}

/**
 * Init a SubmissionObjectState.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitSubmissionFormAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function changeCollection(state: SubmissionObjectState, action: ChangeSubmissionCollectionAction): SubmissionObjectState {
  return Object.assign({}, state, {
    [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
      collection: action.payload.collectionId
    })
  });
}

// ------ Section functions ------ //

/**
 * Set submission active section.
 *
 * @param state
 *    the current state
 * @param action
 *    a SetActiveSectionAction
 * @return SubmissionObjectState
 *    the new state, with the active section.
 */
function setActiveSection(state: SubmissionObjectState, action: SetActiveSectionAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        activeSection: action.payload.sectionId,
        sections: state[ action.payload.submissionId ].sections,
        isLoading: state[ action.payload.submissionId ].isLoading,
        savePending: state[ action.payload.submissionId ].savePending,
      })
    });
  } else {
    return state;
  }
}

/**
 * Set a section enabled.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitSectionAction
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function initSection(state: SubmissionObjectState, action: InitSectionAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        sections: Object.assign({}, state[ action.payload.submissionId ].sections, {
          [ action.payload.sectionId ]: {
            header: action.payload.header,
            config: action.payload.config,
            mandatory: action.payload.mandatory,
            sectionType: action.payload.sectionType,
            visibility: action.payload.visibility,
            collapsed: false,
            enabled: action.payload.enabled,
            data: action.payload.data,
            errors: action.payload.errors || [],
            isLoading: false,
            isValid: false,
            removePending: false
          }
        })
      })
    });
  } else {
    return state;
  }
}

/**
 * Update section's data.
 *
 * @param state
 *    the current state
 * @param action
 *    an UpdateSectionDataAction
 * @return SubmissionObjectState
 *    the new state, with the section's data updated.
 */
function updateSectionData(state: SubmissionObjectState, action: UpdateSectionDataAction): SubmissionObjectState {
  if (isNotEmpty(state[ action.payload.submissionId ])
      && isNotEmpty(state[ action.payload.submissionId ].sections[ action.payload.sectionId])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        sections: Object.assign({}, state[ action.payload.submissionId ].sections, {
          [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
            enabled: true,
            data: action.payload.data,
            errors: action.payload.errors
          })
        })
      })
    });
  } else {
    return state;
  }
}

/**
 * Set a section state.
 *
 * @param state
 *    the current state
 * @param action
 *    a DisableSectionAction
 * @param enabled
 *    enabled or disabled section.
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function changeSectionState(state: SubmissionObjectState, action: EnableSectionAction | DisableSectionAction, enabled: boolean): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ].sections[ action.payload.sectionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        // sections: deleteProperty(state[ action.payload.submissionId ].sections, action.payload.sectionId),
        sections: Object.assign({}, state[ action.payload.submissionId ].sections, {
          [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
            enabled,
            data: (enabled) ? state[ action.payload.submissionId ].sections [ action.payload.sectionId ] : {},
            removePending: false
          })
        })
      })
    });
  } else {
    return state;
  }
}

/**
 * Change removePending flag.
 *
 * @param state
 *    the current state
 * @param action
 *    a DisableSectionAction or a DisableSectionErrorAction
 * @param removePending
 *    representing if remove operation is pending or not.
 * @return SubmissionObjectState
 *    the new state, with the section removed.
 */
function changeSectionRemoveState(state: SubmissionObjectState, action: DisableSectionAction | DisableSectionErrorAction, removePending: boolean): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ].sections[ action.payload.sectionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        // sections: deleteProperty(state[ action.payload.submissionId ].sections, action.payload.sectionId),
        sections: Object.assign({}, state[ action.payload.submissionId ].sections, {
          [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
            removePending
          })
        })
      })
    });
  } else {
    return state;
  }
}

/**
 * Set the section validity.
 *
 * @param state
 *    the current state
 * @param action
 *    a SectionStatusChangeAction
 * @return SubmissionObjectState
 *    the new state, with the section new validity status.
 */
function setIsValid(state: SubmissionObjectState, action: SectionStatusChangeAction): SubmissionObjectState {
  if (isNotEmpty(state[ action.payload.submissionId ]) && hasValue(state[ action.payload.submissionId ].sections[ action.payload.sectionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        sections: Object.assign({}, state[ action.payload.submissionId ].sections,
          Object.assign({}, {
            [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
              isValid: action.payload.status
            })
          })
        )
      })
    });
  } else {
    return state;
  }
}

// ------ Upload file functions ------ //

/**
 * Set a new file.
 *
 * @param state
 *    the current state
 * @param action
 *    a NewUploadedFileAction action
 * @return SubmissionObjectState
 *    the new state, with the new file.
 */
function newFile(state: SubmissionObjectState, action: NewUploadedFileAction): SubmissionObjectState {
  const filesData = state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data as WorkspaceitemSectionUploadObject;
  let newData;
  if (isUndefined(filesData.files)) {
    newData = {
      files: [action.payload.data]
    };
  } else {
    newData = filesData;
    newData.files.push(action.payload.data)
  }

  return Object.assign({}, state, {
    [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
      sections: Object.assign({}, state[ action.payload.submissionId ].sections, {
        [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
          enabled: true,
          data: newData
        })
      })
    })
  });
}

/**
 * Edit a file.
 *
 * @param state
 *    the current state
 * @param action
 *    an EditFileDataAction action
 * @return SubmissionObjectState
 *    the new state, with the edited file.
 */
function editFileData(state: SubmissionObjectState, action: EditFileDataAction): SubmissionObjectState {
  const filesData = state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data as WorkspaceitemSectionUploadObject;
  if (hasValue(filesData.files)) {
    const fileIndex = findKey(
      filesData.files,
      { uuid: action.payload.fileId });
    if (isNotNull(fileIndex)) {
      const newData = Array.from(filesData.files);
      newData[fileIndex] = action.payload.data;
      return Object.assign({}, state, {
        [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
          activeSection: state[ action.payload.submissionId ].activeSection,
          sections: Object.assign({}, state[ action.payload.submissionId ].sections,
            Object.assign({}, {
              [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
                data: Object.assign({}, state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data, {
                  files: newData
                })
              })
            })
          ),
          isLoading: state[ action.payload.submissionId ].isLoading,
          savePending: state[ action.payload.submissionId ].savePending,
        })
      });
    }
  }
  return state;
}

/**
 * Delete a file.
 *
 * @param state
 *    the current state
 * @param action
 *    a DeleteUploadedFileAction action
 * @return SubmissionObjectState
 *    the new state, with the file removed.
 */
function deleteFile(state: SubmissionObjectState, action: DeleteUploadedFileAction): SubmissionObjectState {
  const filesData = state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data as WorkspaceitemSectionUploadObject;
  if (hasValue(filesData.files)) {
    const fileIndex: any = findKey(
      filesData.files,
      {uuid: action.payload.fileId});
    if (isNotNull(fileIndex)) {
      const newData = Array.from(filesData.files);
      newData.splice(fileIndex, 1);
      return Object.assign({}, state, {
        [ action.payload.submissionId ]: Object.assign({}, state[action.payload.submissionId], {
          sections: Object.assign({}, state[action.payload.submissionId].sections,
            Object.assign({}, {
              [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections[ action.payload.sectionId ], {
                data: Object.assign({}, state[ action.payload.submissionId ].sections[ action.payload.sectionId ].data, {
                  files: newData
                })
              })
            })
          )
        })
      });
    }
  }
  return state;
}

// ------ Detect duplicate functions ------ //

/**
 * Set decision flag to true
 *
 * @param state
 *    the current state
 * @param action
 *    a SetDuplicateDecisionAction
 * @return SubmissionObjectState
 *    the new state, with the decision flag changed.
 */
function startSaveDecision(state: SubmissionObjectState, action: SetDuplicateDecisionAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        saveDecisionPending: true,
      })
    });
  } else {
    return state;
  }
}

function setDuplicateMatches(state: SubmissionObjectState, action: SetDuplicateDecisionSuccessAction) {
  const index: any = findKey(
    action.payload.submissionObject,
    {id: parseInt(action.payload.submissionId, 10) as any});
  const sectionData = action.payload.submissionObject[index].sections[ action.payload.sectionId ] as WorkspaceitemSectionDetectDuplicateObject;
  const newData = (sectionData && sectionData.matches) ? sectionData : Object.create({});

  if (hasValue(state[ action.payload.submissionId ].sections[ action.payload.sectionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        sections: Object.assign({}, state[ action.payload.submissionId ].sections,
          Object.assign({}, {
            [ action.payload.sectionId ]: Object.assign({}, state[ action.payload.submissionId ].sections [ action.payload.sectionId ], {
              enabled: true,
              data: newData
            })
          })
        ),
        saveDecisionPending: false
      })
    });
  } else {
    return state;
  }
}

/**
 * Set decision flag to false
 *
 * @param state
 *    the current state
 * @param action
 *    a SetDuplicateDecisionSuccessAction or SetDuplicateDecisionErrorAction
 * @return SubmissionObjectState
 *    the new state, with the decision flag changed.
 */
function endSaveDecision(state: SubmissionObjectState, action: SetDuplicateDecisionSuccessAction | SetDuplicateDecisionErrorAction): SubmissionObjectState {
  if (hasValue(state[ action.payload.submissionId ])) {
    return Object.assign({}, state, {
      [ action.payload.submissionId ]: Object.assign({}, state[ action.payload.submissionId ], {
        saveDecisionPending: false,
      })
    });
  } else {
    return state;
  }
}
