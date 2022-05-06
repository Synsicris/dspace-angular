import { Config } from './config.interface';

export interface ProjectsConfig extends Config {
  projectsGrantsOptionsVocabularyName: string;
  projectsEntityEditMode: string;
  projectVersionUniqueIdMetadata: string;
  excludeComparisonMetadata: string[];
  commentEntityName: string;
}
