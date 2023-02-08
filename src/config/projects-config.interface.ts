import { Config } from './config.interface';

export interface ProjectBrowseDiscoveryConfig {
  firstStepSearchQueryConfigurationName: string;
  firstStepSearchAllProjectConfigurationName: string;
  secondSearchProjectItemsConfigurationName: string;
}

export interface ProjectsBrowseConfig {
  adminAndFunders: ProjectBrowseDiscoveryConfig;
  members: ProjectBrowseDiscoveryConfig;
  entityTypeFilterName: string;
}

export interface ProjectsConfig extends Config {
  projectsGrantsOptionsVocabularyName: string;
  projectsEntityEditMode: string;
  projectsEntityAdminEditMode: string;
  projectsEntityFunderEditMode: string;
  projectVersionUniqueIdMetadata: string;
  excludeComparisonMetadata: string[];
  projectsBrowse: ProjectsBrowseConfig;
  versioningEditMode: string;
  versioningEditFormSection: string;
  lastVersionDiscoveryConfig: string;
}
