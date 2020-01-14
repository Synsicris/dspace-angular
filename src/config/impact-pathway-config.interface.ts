import { Config } from './config.interface';

export interface ImpactPathwayConfig extends Config {
  impactPathwaysCollection: string;
  impactPathwayStepsCollection: string;
  impactPathwayTasksCollection: string;
  impactPathwaysFormSection: string;
  impactPathwayStepsFormSection: string;
  impactPathwayTasksFormSection: string;
}
