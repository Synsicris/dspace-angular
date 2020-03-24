import { Config } from './config.interface';

export interface ImpactPathwayConfig extends Config {
  impactPathwaysFormSection: string;
  impactPathwayStepsFormSection: string;
  impactPathwayTasksFormSection: string;
  impactPathwayEntity: string;
  impactPathwayStepEntity: string;
  impactPathwayParentRelationMetadata: string;
  impactPathwayStepRelationMetadata: string;
  impactPathwayStepTypeMetadata: string;
  impactPathwayTaskRelationMetadata: string;
  impactpathwayOutcomeLinkMetadata: string;
  impactpathwayBidirectionalLinkMetadata: string;
  impactPathwayStepTypeAuthority: string;
  entityToCollectionMapAuthority: string;
  entityToCollectionMapAuthorityMetadata: string;
}
