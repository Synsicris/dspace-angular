import { RestRequestMethod } from '../app/core/data/rest-request-method';
import { NotificationAnimationsType } from '../app/shared/notifications/models/notification-animations-type';
import { AppConfig } from './app-config.interface';
import { AuthConfig } from './auth-config.interfaces';
import { BrowseByConfig } from './browse-by-config.interface';
import { CacheConfig } from './cache-config.interface';
import { CollectionPageConfig } from './collection-page-config.interface';
import { FormConfig } from './form-config.interfaces';
import { ItemPageConfig } from './item-page-config.interface';
import { LangConfig } from './lang-config.interface';
import { MediaViewerConfig } from './media-viewer-config.interface';
import { INotificationBoardOptions } from './notifications-config.interfaces';
import { ServerConfig } from './server-config.interface';
import { SubmissionConfig } from './submission-config.interface';
import { ThemeConfig } from './theme.model';
import { UIServerConfig } from './ui-server-config.interface';
import { UniversalConfig } from './universal-config.interface';
import { AddThisPluginConfig } from './addThisPlugin-config';
import { CmsMetadata } from './cms-metadata';
import { CrisLayoutConfig, LayoutConfig, SuggestionConfig } from './layout-config.interfaces';
import { MetadataSecurityConfig } from './metadata-security-config';
import { FollowAuthorityMetadata } from './search-follow-metadata.interface';
import { DisplayItemMetadataType } from './display-search-result-config.interface';
import { WorkingPlanConfig } from './working-plan-config.interface';
import { ProjectsConfig } from './projects-config.interface';

export class DefaultAppConfig implements AppConfig {
  production = false;

  // Angular Universal settings
  universal: UniversalConfig = {
    preboot: true,
    async: true,
    time: false
  };

  // NOTE: will log all redux actions and transfers in console
  debug = false;

  // Angular Universal server settings
  // NOTE: these must be 'synced' with the 'dspace.ui.url' setting in your backend's local.cfg.
  ui: UIServerConfig = {
    ssl: false,
    host: 'localhost',
    port: 4000,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/',

    // The rateLimiter settings limit each IP to a 'max' of 500 requests per 'windowMs' (1 minute).
    rateLimiter: {
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 500 // limit each IP to 500 requests per windowMs
    }
  };

  // The REST API server settings
  // NOTE: these must be 'synced' with the 'dspace.server.url' setting in your backend's local.cfg.
  rest: ServerConfig = {
    ssl: false,
    host: 'localhost',
    port: 8080,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/',
  };

  // Caching settings
  cache: CacheConfig = {
    // NOTE: how long should objects be cached for by default
    msToLive: {
      default: 15 * 60 * 1000 // 15 minutes
    },
    control: 'max-age=60', // revalidate browser
    autoSync: {
      defaultTime: 0,
      maxBufferSize: 100,
      timePerMethod: { [RestRequestMethod.PATCH]: 3 } as any // time in seconds
    }
  };

  // Authentication settings
  auth: AuthConfig = {
    // Authentication UI settings
    ui: {
      // the amount of time before the idle warning is shown
      timeUntilIdle: 15 * 60 * 1000, // 15 minutes
      // the amount of time the user has to react after the idle warning is shown before they are logged out.
      idleGracePeriod: 5 * 60 * 1000 // 5 minutes
    },
    // Authentication REST settings
    rest: {
      // If the rest token expires in less than this amount of time, it will be refreshed automatically.
      // This is independent from the idle warning.
      timeLeftBeforeTokenRefresh: 2 * 60 * 1000 // 2 minutes
    }
  };

  // Form settings
  form: FormConfig = {
    // NOTE: Map server-side validators to comparative Angular form validators
    validatorMap: {
      required: 'required',
      regex: 'pattern'
    }
  };

  // Notifications
  notifications: INotificationBoardOptions = {
    rtl: false,
    position: ['top', 'right'],
    maxStack: 8,
    // NOTE: after how many seconds notification is closed automatically. If set to zero notifications are not closed automatically
    timeOut: 5000, // 5 second
    clickToClose: true,
    // NOTE: 'fade' | 'fromTop' | 'fromRight' | 'fromBottom' | 'fromLeft' | 'rotate' | 'scale'
    animate: NotificationAnimationsType.Scale
  };

  // Submission settings
  submission: SubmissionConfig = {
    autosave: {
      // NOTE: which metadata trigger an autosave
      metadata: ['dc.title', 'dc.identifier.doi', 'dc.identifier.pmid', 'dc.identifier.arxiv', 'dc.identifier.patentno', 'dc.identifier.scopus', 'dc.identifier.isi', 'dcterms.dateSubmitted', 'dc.identifier.applicationnumber'],
      /**
       * NOTE: after how many time (milliseconds) submission is saved automatically
       * eg. timer: 5 * (1000 * 60); // 5 minutes
       */
      timer: 5 * (1000 * 60)
    },
    icons: {
      metadata: [
        /**
         * NOTE: example of configuration
         * {
         *    // NOTE: metadata name
         *    name: 'dc.author',
         *    // NOTE: fontawesome (v5.x) icon classes and bootstrap utility classes can be used
         *    style: 'fa-user'
         * }
         */
        {
          name: 'dc.author',
          style: 'fas fa-user'
        },
        {
          name: 'dc.contributor.author',
          style: 'fas fa-user'
        },
        {
          name: 'dc.contributor.editor',
          style: 'fas fa-user'
        },
        {
          name: 'oairecerif.author.affiliation',
          style: 'fas fa-university'
        },
        {
          name: 'oairecerif.editor.affiliation',
          style: 'fas fa-university'
        },
        {
          name: 'dc.relation.grantno',
          style: 'fas fa-info-circle'
        },
        // default configuration
        {
          name: 'default',
          style: ''
        }
      ],
      authority: {
        confidence: [
          /**
           * NOTE: example of configuration
           * {
           *    // NOTE: confidence value
           *    value: 'dc.author',
           *    // NOTE: fontawesome (v4.x) icon classes and bootstrap utility classes can be used
           *    style: 'fa-user'
           * }
           */
          {
            value: 600,
            style: 'text-success'
          },
          {
            value: 500,
            style: 'text-info'
          },
          {
            value: 400,
            style: 'text-warning'
          },
          // default configuration
          {
            value: 'default',
            style: 'text-muted'
          }

        ]
      }
    },
    detectDuplicate: {
      // NOTE: list of additional item metadata to show for duplicate match presentation list
      metadataDetailsList: [
        { label: 'Document type', name: 'dc.type' }
      ]
    }
  };

  // Default Language in which the UI will be rendered if the user's browser language is not an active language
  defaultLanguage = 'en';

  // Languages. DSpace Angular holds a message catalog for each of the following languages.
  // When set to active, users will be able to switch to the use of this language in the user interface.
  languages: LangConfig[] = [
    { code: 'en', label: 'English', active: true },
    { code: 'de', label: 'Deutsch', active: true }
  ];

  // Browse-By Pages
  browseBy: BrowseByConfig = {
    // Amount of years to display using jumps of one year (current year - oneYearLimit)
    oneYearLimit: 10,
    // Limit for years to display using jumps of five years (current year - fiveYearLimit)
    fiveYearLimit: 30,
    // The absolute lowest year to display in the dropdown (only used when no lowest date can be found for all items)
    defaultLowerLimit: 1900
  };

  // Item Page Config
  item: ItemPageConfig = {
    edit: {
      undoTimeout: 10000 // 10 seconds
    }
  };

  // When the search results are retrieved, for each item type the metadata with a valid authority value are inspected.
  // Referenced items will be fetched with a find all by id strategy to avoid individual rest requests
  // to efficiently display the search results.
  followAuthorityMetadata: FollowAuthorityMetadata[] = [
    {
      type: 'Publication',
      metadata: ['dc.contributor.author']
    },
    {
      type: 'Product',
      metadata: ['dc.contributor.author']
    },
    {
      type: 'workpackage',
      metadata: ['workingplan.relation.step']
    },
    {
      type: 'milestone',
      metadata: ['workingplan.relation.step']
    },
  ];

  // Collection Page Config
  collection: CollectionPageConfig = {
    edit: {
      undoTimeout: 10000 // 10 seconds
    }
  };

  // Theme Config
  themes: ThemeConfig[] = [
    // Add additional themes here. In the case where multiple themes match a route, the first one
    // in this list will get priority. It is advisable to always have a theme that matches
    // every route as the last one

    // {
    //   // A theme with a handle property will match the community, collection or item with the given
    //   // handle, and all collections and/or items within it
    //   name: 'custom',
    //   handle: '10673/1233'
    // },
    // {
    //   // A theme with a regex property will match the route using a regular expression. If it
    //   // matches the route for a community or collection it will also apply to all collections
    //   // and/or items within it
    //   name: 'custom',
    //   regex: 'collections\/e8043bc2.*'
    // },
    // {
    //   // A theme with a uuid property will match the community, collection or item with the given
    //   // ID, and all collections and/or items within it
    //   name: 'custom',
    //   uuid: '0958c910-2037-42a9-81c7-dca80e3892b4'
    // },
    // {
    //   // The extends property specifies an ancestor theme (by name). Whenever a themed component is not found
    //   // in the current theme, its ancestor theme(s) will be checked recursively before falling back to default.
    //   name: 'custom-A',
    //   extends: 'custom-B',
    //   // Any of the matching properties above can be used
    //   handle: '10673/34'
    // },
    // {
    //   name: 'custom-B',
    //   extends: 'custom',
    //   handle: '10673/12'
    // },
    // {
    //   // A theme with only a name will match every route
    //   name: 'custom'
    // },
    // {
    //   // This theme will use the default bootstrap styling for DSpace components
    //   name: BASE_THEME_NAME
    // },

    {
      // The default dspace theme
      name: 'synsicris',
      // Whenever this theme is active, the following tags will be injected into the <head> of the page.
      // Example use case: set the favicon based on the active theme.
      headTags: [
        {
          // Insert <link rel="icon" href="assets/dspace/images/favicons/favicon.ico" sizes="any"/> into the <head> of the page.
          tagName: 'link',
          attributes: {
            'rel': 'icon',
            'href': 'assets/dspace/images/favicons/favicon.ico',
            'sizes': 'any',
          }
        },
        {
          // Insert <link rel="icon" href="assets/dspace/images/favicons/favicon.svg" type="image/svg+xml"/> into the <head> of the page.
          tagName: 'link',
          attributes: {
            'rel': 'icon',
            'href': 'assets/dspace/images/favicons/favicon.svg',
            'type': 'image/svg+xml',
          }
        },
        {
          // Insert <link rel="apple-touch-icon" href="assets/dspace/images/favicons/apple-touch-icon.png"/> into the <head> of the page.
          tagName: 'link',
          attributes: {
            'rel': 'apple-touch-icon',
            'href': 'assets/dspace/images/favicons/apple-touch-icon.png',
          }
        },
        {
          // Insert <link rel="manifest" href="assets/dspace/images/favicons/manifest.webmanifest"/> into the <head> of the page.
          tagName: 'link',
          attributes: {
            'rel': 'manifest',
            'href': 'assets/dspace/images/favicons/manifest.webmanifest',
          }
        },
        {
          // Insert   <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"> into the <head> of the page.
          tagName: 'link',
          attributes: {
            'rel': 'stylesheet',
            'href': 'https://fonts.googleapis.com/icon?family=Material+Icons',
          }
        },
      ]
    },
  ];
  // Whether to enable media viewer for image and/or video Bitstreams (i.e. Bitstreams whose MIME type starts with "image" or "video").
  // For images, this enables a gallery viewer where you can zoom or page through images.
  // For videos, this enables embedded video streaming
  mediaViewer: MediaViewerConfig = {
    image: false,
    video: false
  };

  crisLayout: CrisLayoutConfig = {
    urn: [
      {
        name: 'doi',
        baseUrl: 'https://doi.org/'
      },
      {
        name: 'hdl',
        baseUrl: 'https://hdl.handle.net/'
      },
      {
        name: 'scopus',
        baseUrl: 'https://www.scopus.com/authid/detail.uri?authorId='
      },
      {
        name: 'researcherid',
        baseUrl: 'http://www.researcherid.com/rid/'
      },
      {
        name: 'mailto',
        baseUrl: 'mailto:'
      }
    ],
    crisRef: [
      {
        entityType: 'DEFAULT',
        icon: 'fa fa-info'
      },
      {
        entityType: 'PERSON',
        icon: 'fa fa-user'
      },
      {
        entityType: 'ORGUNIT',
        icon: 'fa fa-university'
      }
    ],
    itemPage: {
      default: {
        orientation: 'vertical'
      },
    },
    metadataBox: {
      defaultMetadataLabelColStyle: 'col-3',
      defaultMetadataValueColStyle: 'col-9'
    }
  };

  layout: LayoutConfig = {
    navbar: {
      // If true, show the "Community and Collections" link in the navbar; otherwise, show it in the admin sidebar
      showCommunityCollection: true,
    }
  };

  security: MetadataSecurityConfig = {
    levels: [
      {
        value: 0,
        icon: 'fa fa-globe',
        color: 'green'
      },
      {
        value: 1,
        icon: 'fa fa-key',
        color: 'orange'
      },
      {
        value: 2,
        icon: 'fa fa-lock',
        color: 'red'
      }
    ]
  };

  suggestion: SuggestionConfig[] = [
    // {
    //   // Use this configuration to map a suggestion import to a specific collection based on the suggestion type.
    //   source: 'suggestionSource',
    //   collectionId: 'collectionUUID'
    // }
  ];

  cms: CmsMetadata = {
    metadataList: [
      'cris.cms.home-header',
      'cris.cms.home-news',
      'cris.cms.footer',
    ]
  };

  addThisPlugin: AddThisPluginConfig = {
    siteId: '',
    scriptUrl: 'http://s7.addthis.com/js/300/addthis_widget.js#pubid=',
    socialNetworksEnabled: false
  };

  impactPathway = {
    impactPathwaysFormSection: 'impact_pathway_form',
    impactPathwayStepsFormSection: 'impact_pathway_step_form',
    impactPathwayTasksFormSection: 'impact_pathway_task_form',
    impactPathwaysEditFormSection: 'impact_pathway-edit_form',
    impactPathwaysLinksEditFormSection: 'impact_pathway-edit_link_form',
    impactPathwaysEditMode: 'IMPACTPATHWAY',
    impactPathwaysLinkEditMode: 'IMPACTPATHWAY_LINK',
    impactPathwayEntity: 'impactpathway',
    impactPathwayStepEntity: 'impactpathwaystep',
    impactPathwayParentRelationMetadata: 'impactpathway.relation.parent',
    impactPathwayStepRelationMetadata: 'impactpathway.relation.step',
    impactPathwayStepTypeMetadata: 'impactpathway.step.type',
    impactPathwayTaskRelationMetadata: 'impactpathway.relation.task',
    impactpathwayOutcomeLinkMetadata: 'impactpathway.outcome.link',
    impactpathwayBidirectionalLinkMetadata: 'impactpathway.bidirectional.link',
    impactPathwayStepTypeAuthority: 'impactpathway_step_type',
    entityToCollectionMapAuthority: 'impactpathway_entity_to_collection_map',
    entityToCollectionMapAuthorityMetadata: 'impactpathway.entity.map',
    projObjectiveEntity: 'proj_objective',
    iaObjectiveEntity: 'ia_objective',
    impactPathwaysSearchConfigName: 'allImpactPathways',
    contributionFundingprogrammeEntity: 'contribution_fundingprogramme'
  };
  workingPlan: WorkingPlanConfig = {
    workingPlanRelationMetadata: 'synsicris.relation.workingplan',
    workingPlanFormName: 'working_plan_form',
    workingPlanStepsFormName: 'working_plan_step_form',
    workingPlanEditMode: 'WORKINGPLAN',
    workingPlanEditFormSection: 'working_plan-edit_form',
    workingPlanStepStatusMetadata: 'synsicris.type.status',
    workingPlanStepResponsibleMetadata: 'synsicris.relation.partner-wp',
    workingPlanStepResponsibleAuthority: 'PartnerWPAuthority',
    workingPlanStepRelationMetadata: 'workingplan.relation.step',
    workingPlanStepDateStartMetadata: 'dc.date.start',
    workingPlanStepDateEndMetadata: 'dc.date.end',
    workpackageEntityName: 'workpackage',
    milestoneEntityName: 'milestone',
    allLinkedWorkingPlanObjSearchConfigName: 'allLinkedWorkingPlanObj',
    allUnlinkedWorkingPlanObjSearchConfigName: 'allUnlinkedWorkingPlanObj',
    workpackageStepsSearchConfigName: 'workpackageSteps',
    workpackageStatusTypeAuthority: 'stat_col23',
    workpackageTypeAuthority: 'working_plan_workpackage_type',
    workpackageStepTypeAuthority: 'working_plan_workpackage_step_type',
    workingPlanPlaceMetadata: 'workingplan.place',
    workingPlanLinkMetadata: 'workingplan.link.status'
  };

  projects: ProjectsConfig = {
    projectsGrantsOptionsVocabularyName: 'item_shared',
    projectsEntityAdminEditMode: 'ADMIN_EDIT',
    projectsEntityEditMode: 'CUSTOM',
    projectsEntityFunderEditMode: 'FUNDER_EDIT',
    projectVersionUniqueIdMetadata: 'synsicris.uniqueid',
    excludeComparisonMetadata: [
      'cris.policy.group', 'cris.project.shared', 'dc.date.accessioned', 'dc.date.available', 'dspace.entity.type',
      'synsicris.funder-policy.group', 'synsicris.coordinator-policy.group', 'synsicris.member-policy.group',
      'synsicris.reader-policy.group', 'synsicris.relation.project', 'synsicris.relation.funding',
      'synsicris.versioning-edit-policy.group', 'synsicris.versioning-read-policy.group','synsicris.uniqueid',
      'synsicris.relation.workingplan', 'workingplan.link.status', 'workingplan.place', 'workingplan.relation.step',
      'impactpathway.relation.parent', 'impactpathway.relation.step', 'impactpathway.relation.task',
      'impactpathway.outcome.link', 'impactpathway.bidirectional.link', 'impactpathway.entity.map',
      'synsicris.relation.exploitationplan', 'exploitationplan.relation.step', 'exploitationplan.relation.task',
      'synsicris.isLastVersion','synsicris.isLastVersion.visible', 'synsicris.version'
    ],
    projectsBrowse: {
      adminAndFunders: {
        searchQueryConfigurationName: 'searchProjectsForAdminAndFunders',
        searchProjectConfigurationName: 'searchAllProjectForAdminAndFunders',
        searchProjectItemsConfigurationName: 'allProjectItemsForAdminAndFunders',
      },
      members: {
        searchQueryConfigurationName: 'searchProjectsForMembers',
        searchProjectConfigurationName: 'searchAllProjectForMembers',
        searchProjectItemsConfigurationName: 'allProjectItems',
      },
      entityTypeFilterName: 'entityType'
    },
    versioningEditMode: 'VERSIONING',
    versioningEditFormSection: 'projects_versioning',
  };

  exploitationPlan = {
    exploitationPlanRelationMetadata: 'synsicris.relation.exploitationplan',
    exploitationPlanStepRelationMetadata: 'exploitationplan.relation.step',
    exploitationPlanTaskRelationMetadata: 'exploitationplan.relation.task',
    exploitationPlanPartnerMetadata: '',
    exploitationPlanTaskFormSection: 'exploitation_plan_task_form',
    exploitationPlanEditFormSection: 'exploitation_plan-edit_form',
    exploitationPlanEditMode: 'EXPLOITATIONPLAN',
  };

  displayItemSearchResult = {
    default: [
      {
        metadata: [
          {
            name: 'dc.title',
            type: DisplayItemMetadataType.Title
          }
        ]
      },
      {
        metadata: [
          {
            name: 'dc.description',
            type: DisplayItemMetadataType.Text
          }
        ]
      },
    ],
    Publication: [
      {
        metadata: [
          {
            name: 'dc.title',
            type: DisplayItemMetadataType.Title
          }
        ]
      },
      {
        metadata: [
          {
            name: 'dc.date.issued',
            type: DisplayItemMetadataType.Date
          },
          {
            name: 'dc.contributor.author',
            type: DisplayItemMetadataType.Text
          }
        ]
      },
      {
        metadata: [
          {
            name: 'dc.type',
            type: DisplayItemMetadataType.Text
          }
        ]
      },
    ],
    Event: [
      {
        metadata: [
          {
            name: 'dc.title',
            type: DisplayItemMetadataType.Title
          }
        ]
      },
      {
        metadata: [
          {
            name: 'oairecerif.event.startDate',
            type: DisplayItemMetadataType.Date
          },
          {
            name: 'dc.type',
            type: DisplayItemMetadataType.Text
          },
          {
            name: 'synsicris.type.project-contribution',
            type: DisplayItemMetadataType.Text
          }
        ]
      },
      {
        metadata: [
          {
            name: 'dc.description',
            type: DisplayItemMetadataType.Text
          }
        ]
      },
    ],
    comment: [
      {
        metadata: [
          {
            name: 'dc.title',
            type: DisplayItemMetadataType.Title
          }
        ]
      },
      {
        metadata: [
          {
            name: 'dc.type',
            type: DisplayItemMetadataType.Text
          }
        ]
      },
      {
        metadata: [
          {
            name: 'synsicris.date.reminder',
            type: DisplayItemMetadataType.Date
          }
        ]
      },
      {
        metadata: [
          {
            name: 'synsicris.date.creation',
            type: DisplayItemMetadataType.Date
          }
        ]
      },
      {
        metadata: [
          {
            name: 'synsicris.creator',
            type: DisplayItemMetadataType.Text
          }
        ]
      },
      {
        metadata: [
          {
            name: 'dc.description',
            type: DisplayItemMetadataType.Text,
            truncatable: true
          }
        ]
      }
    ]
  };

  comments = {
    commentEditFormName: 'comments',
    commentEditFormSection: 'comments',
    commentEditMode: 'CUSTOM',
    commentEntityType: 'comment',
    commentRelationItemMetadata: 'synsicris.relation.item'
  };

}
