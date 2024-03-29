import { Config } from './config.interface';

export interface WorkingPlanConfig extends Config {
  workingPlanRelationMetadata: string;
  workingPlanFormName: string;
  workingPlanStepsFormName: string;
  workingPlanEditMode: string;
  workingPlanEditFormSection: string;
  workingPlanStepStatusMetadata: string;
  workingPlanStepResponsibleMetadata: string;
  workingPlanStepResponsibleAuthority: string;
  workingPlanStepRelationMetadata: string;
  workingPlanStepDateStartMetadata: string;
  workingPlanStepDateEndMetadata: string;
  workpackageEntityName: string;
  milestoneEntityName: string;
  allLinkedWorkingPlanObjSearchConfigName: string;
  allUnlinkedWorkingPlanObjSearchConfigName: string;
  workpackageStepsSearchConfigName: string;
  workpackageTypeAuthority: string;
  workpackageStatusTypeAuthority: string;
  workpackageStepTypeAuthority: string;
  workingPlanPlaceMetadata: string;
  workingPlanLinkMetadata: string;
}
