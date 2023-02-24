import { Config } from './config.interface';

export interface InterimReportConfig extends Config {
  interimReportRelationMetadata: string;
  interimReportStepEntityName: string;
  interimReportStepRelationMetadata: string;
  interimReportTaskRelationMetadata: string;
  interimReportPartnerMetadata: string;
  interimReportTaskFormSection: string;
  interimReportEditFormSection: string;
  interimReportEditMode: string;
}
