import { InjectionToken } from '@angular/core';
import { makeStateKey } from '@angular/platform-browser';
import { MetricVisualizationConfig } from './metric-visualization-config.interfaces';
import { Config } from './config.interface';
import { ServerConfig } from './server-config.interface';
import { CacheConfig } from './cache-config.interface';
import { INotificationBoardOptions } from './notifications-config.interfaces';
import { SubmissionConfig } from './submission-config.interface';
import { FormConfig } from './form-config.interfaces';
import { LangConfig } from './lang-config.interface';
import { ItemConfig } from './item-config.interface';
import { CollectionPageConfig } from './collection-page-config.interface';
import { ThemeConfig } from './theme.model';
import { AuthConfig } from './auth-config.interfaces';
import { UIServerConfig } from './ui-server-config.interface';
import { MediaViewerConfig } from './media-viewer-config.interface';
import { BrowseByConfig } from './browse-by-config.interface';
import { BundleConfig } from './bundle-config.interface';
import { ActuatorsConfig } from './actuators.config';
import { InfoConfig } from './info-config.interface';
import { CommunityListConfig } from './community-list-config.interface';
import { HomeConfig } from './homepage-config.interface';
import { MarkdownConfig } from './markdown-config.interface';
import { CrisLayoutConfig, LayoutConfig, SuggestionConfig } from './layout-config.interfaces';
import { MetadataSecurityConfig } from './metadata-security-config';
import { CmsMetadata } from './cms-metadata';
import { AddThisPluginConfig } from './addThisPlugin-config';
import { FollowAuthorityMetadata } from './search-follow-metadata.interface';
import { AdvancedAttachmentRenderingConfig } from './advanced-attachment-rendering.config';
import { AttachmentRenderingConfig } from './attachment-rendering.config';
import { ImpactPathwayConfig } from './impact-pathway-config.interface';
import { WorkingPlanConfig } from './working-plan-config.interface';
import { ProjectsConfig } from './projects-config.interface';
import { DisplayItemSearchResultConfig } from './display-search-result-config.interface';
import { CommentConfig } from './comment.config';
import { QuestionsBoardConfig } from './questions-board.config';

interface AppConfig extends Config {
  ui: UIServerConfig;
  rest: ServerConfig;
  production: boolean;
  cache: CacheConfig;
  auth?: AuthConfig;
  form: FormConfig;
  notifications: INotificationBoardOptions;
  submission: SubmissionConfig;
  debug: boolean;
  defaultLanguage: string;
  languages: LangConfig[];
  browseBy: BrowseByConfig;
  communityList: CommunityListConfig;
  homePage: HomeConfig;
  item: ItemConfig;
  collection: CollectionPageConfig;
  themes: ThemeConfig[];
  mediaViewer: MediaViewerConfig;
  bundle: BundleConfig;
  actuators: ActuatorsConfig
  info: InfoConfig;
  markdown: MarkdownConfig;
  crisLayout: CrisLayoutConfig;
  layout: LayoutConfig;
  security: MetadataSecurityConfig;
  cms: CmsMetadata;
  suggestion: SuggestionConfig[];
  addThisPlugin: AddThisPluginConfig;
  followAuthorityMetadata: FollowAuthorityMetadata[];
  metricVisualizationConfig: MetricVisualizationConfig[];
  attachmentRendering: AttachmentRenderingConfig;
  advancedAttachmentRendering: AdvancedAttachmentRenderingConfig;
  impactPathway: ImpactPathwayConfig;
  workingPlan: WorkingPlanConfig;
  projects: ProjectsConfig;
  exploitationPlan: QuestionsBoardConfig;
  interimReport: QuestionsBoardConfig;
  displayItemSearchResult?: DisplayItemSearchResultConfig;
  comments: CommentConfig;
}

/**
 * Injection token for the app configuration.
 * Provided in {@link InitService.providers}.
 */
const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

const APP_CONFIG_STATE = makeStateKey('APP_CONFIG_STATE');

export {
  AppConfig,
  APP_CONFIG,
  APP_CONFIG_STATE
};
