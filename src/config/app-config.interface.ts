import { InjectionToken } from '@angular/core';
import { makeStateKey } from '@angular/platform-browser';
import { Config } from './config.interface';
import { ServerConfig } from './server-config.interface';
import { CacheConfig } from './cache-config.interface';
import { UniversalConfig } from './universal-config.interface';
import { INotificationBoardOptions } from './notifications-config.interfaces';
import { SubmissionConfig } from './submission-config.interface';
import { FormConfig } from './form-config.interfaces';
import { LangConfig } from './lang-config.interface';
import { ItemPageConfig } from './item-page-config.interface';
import { CollectionPageConfig } from './collection-page-config.interface';
import { ThemeConfig } from './theme.model';
import { AuthConfig } from './auth-config.interfaces';
import { UIServerConfig } from './ui-server-config.interface';
import { MediaViewerConfig } from './media-viewer-config.interface';
import { BrowseByConfig } from './browse-by-config.interface';
import { CrisLayoutConfig, LayoutConfig, SuggestionConfig } from './layout-config.interfaces';
import { MetadataSecurityConfig } from './metadata-security-config';
import { CmsMetadata } from './cms-metadata';
import { AddThisPluginConfig } from './addThisPlugin-config';
import { FollowAuthorityMetadata } from './search-follow-metadata.interface';
import { ImpactPathwayConfig } from './impact-pathway-config.interface';
import { WorkingPlanConfig } from './working-plan-config.interface';
import { ProjectsConfig } from './projects-config.interface';
import { ExploitationPlanConfig } from './exploitation-plan.config';
import { DisplayItemSearchResultConfig } from './display-search-result-config.interface';
import { CommentConfig } from './comment.config';

interface AppConfig extends Config {
  ui: UIServerConfig;
  rest: ServerConfig;
  production: boolean;
  cache: CacheConfig;
  auth?: AuthConfig;
  form: FormConfig;
  notifications: INotificationBoardOptions;
  submission: SubmissionConfig;
  universal: UniversalConfig;
  debug: boolean;
  defaultLanguage: string;
  languages: LangConfig[];
  browseBy: BrowseByConfig;
  item: ItemPageConfig;
  collection: CollectionPageConfig;
  themes: ThemeConfig[];
  mediaViewer: MediaViewerConfig;
  crisLayout: CrisLayoutConfig;
  layout: LayoutConfig;
  security: MetadataSecurityConfig;
  cms: CmsMetadata;
  suggestion: SuggestionConfig[];
  addThisPlugin: AddThisPluginConfig;
  followAuthorityMetadata: FollowAuthorityMetadata[];
  impactPathway: ImpactPathwayConfig;
  workingPlan: WorkingPlanConfig;
  projects: ProjectsConfig;
  exploitationPlan: ExploitationPlanConfig;
  displayItemSearchResult?: DisplayItemSearchResultConfig;
  comments: CommentConfig;
}

const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

const APP_CONFIG_STATE = makeStateKey('APP_CONFIG_STATE');

export {
  AppConfig,
  APP_CONFIG,
  APP_CONFIG_STATE
};
