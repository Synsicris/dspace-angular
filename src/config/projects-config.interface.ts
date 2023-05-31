import { Config } from './config.interface';

export interface ProjectBrowseDiscoveryConfig {
  firstStepSearchQueryConfigurationName: string;
  firstStepSearchBrowseAllProjectConfigurationName: string;
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
  projectEditGrantsForm: string;
  projectEditGrantsAdminMode: string;
  projectEditGrantsMode: string;
  projectEditGrantsMetadata: string;
  excludeComparisonMetadata: string[];
  projectsBrowse: ProjectsBrowseConfig;
  versioningEditMode: string;
  versioningEditFormSection: string;
  lastVersionDiscoveryConfig: string;
}
