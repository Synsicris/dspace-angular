import { Config } from './config.interface';

export interface ProjectsConfig extends Config {
  projectTemplateUUID: string;
  communityProjectsUUID: string;
}
