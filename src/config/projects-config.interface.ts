import { Config } from './config.interface';

export interface ProjectsFunderConfig {
  searchQueryConfigurationName: string;
  searchProjectConfigurationName: string;
  searchProjectItemsConfigurationName: string;
  entityTypeFilterName: string;
}
export interface ProjectsConfig extends Config {
  projectsGrantsOptionsVocabularyName: string;
  projectsEntityEditMode: string;
  projectVersionUniqueIdMetadata: string;
  excludeComparisonMetadata: string[];
  projectsFunder: ProjectsFunderConfig;
}
