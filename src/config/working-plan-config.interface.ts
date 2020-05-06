import { Config } from './config.interface';

export interface WorkingPlanConfig extends Config {
  workingPlanFormName: string;
  workingPlanStepsFormName: string;
  workingPlanStepStatusMetadata: string;
  workingPlanStepResponsibleMetadata: string;
  workingPlanStepResponsibleAuthority: string;
  workingPlanStepRelationMetadata: string;
  workingPlanStepDateStartMetadata: string;
  workingPlanStepDateEndMetadata: string;
  workpackageEntityName: string;
  workpackagesSearchConfigName: string;
  workpackageStepsSearchConfigName: string;
  workpackageStatusTypeAuthority: string
  workpackageStepTypeAuthority: string;
  workingPlanPlaceMetadata: string;
}
