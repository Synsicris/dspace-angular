import { Config } from './config.interface';

export interface ImpactPathwayConfig extends Config {
  impactPathwaysFormSection: string;
  impactPathwayStepsFormSection: string;
  impactPathwayTasksFormSection: string;
  impactPathwaysLinksEditFormSection: string;
  impactPathwaysEditFormSection: string;
  impactPathwaysEditMode: string;
  impactPathwaysLinkEditMode: string;
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
  projObjectiveEntity: string;
  iaObjectiveEntity: string;
  impactPathwaysSearchConfigName: string;
  contributionFundingprogrammeEntity: string;
}
