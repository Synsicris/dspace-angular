// This configuration is only used for unit tests, end-to-end tests use environment.production.ts
import { BuildConfig } from 'src/config/build-config.interface';
import { RestRequestMethod } from '../app/core/data/rest-request-method';
import { NotificationAnimationsType } from '../app/shared/notifications/models/notification-animations-type';
import { AdvancedAttachmentElementType } from '../config/advanced-attachment-rendering.config';
import { DisplayItemMetadataType } from '../config/display-search-result-config.interface';

export const environment: BuildConfig = {
  production: false,

  // Angular Universal settings
  universal: {
    preboot: true,
    async: true,
    time: false
  },

  // Angular Universal server settings.
  ui: {
    ssl: false,
    host: 'dspace.com',
    port: 80,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/angular-dspace',
    baseUrl: 'http://dspace.com/angular-dspace',
    // The rateLimiter settings limit each IP to a 'max' of 500 requests per 'windowMs' (1 minute).
    rateLimiter: {
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 500 // limit each IP to 500 requests per windowMs
    },
    useProxies: true,
  },

  // The REST API server settings.
  rest: {
    ssl: true,
    host: 'rest.com',
    port: 443,
    // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
    nameSpace: '/api',
    baseUrl: 'https://rest.com/api'
  },

  actuators: {
    endpointPath: '/actuator/health'
  },

  // Caching settings
  cache: {
    // NOTE: how long should objects be cached for by default
    msToLive: {
      default: 15 * 60 * 1000, // 15 minutes
    },
    // msToLive: 1000, // 15 minutes
    control: 'max-age=60',
    autoSync: {
      defaultTime: 0,
      maxBufferSize: 100,
      timePerMethod: { [RestRequestMethod.PATCH]: 3 } as any // time in seconds
    }
  },

  // Authentication settings
  auth: {
    // Authentication UI settings
    ui: {
      // the amount of time before the idle warning is shown
      timeUntilIdle: 20000,

      // the amount of time the user has to react after the idle warning is shown before they are logged out.
      idleGracePeriod: 20000, // 20 sec
    },
    // Authentication REST settings
    rest: {
      // If the rest token expires in less than this amount of time, it will be refreshed automatically.
      // This is independent from the idle warning.
      timeLeftBeforeTokenRefresh: 20000, // 20 sec
    },
  },

  // Form settings
  form: {
    // NOTE: Map server-side validators to comparative Angular form validators
    validatorMap: {
      required: 'required',
      regex: 'pattern'
    }
  },

  // Notifications
  notifications: {
    rtl: false,
    position: ['top', 'right'],
    maxStack: 8,
    // NOTE: after how many seconds notification is closed automatically. If set to zero notifications are not closed automatically
    timeOut: 5000,
    clickToClose: true,
    // NOTE: 'fade' | 'fromTop' | 'fromRight' | 'fromBottom' | 'fromLeft' | 'rotate' | 'scale'
    animate: NotificationAnimationsType.Scale
  },

  // Submission settings
  submission: {
    autosave: {
      // NOTE: which metadata trigger an autosave
      metadata: ['dc.title', 'dc.identifier.doi', 'dc.identifier.pmid', 'dc.identifier.arxiv'],
      // NOTE: every how many minutes submission is saved automatically
      timer: 5
    },
    typeBind: {
      field: 'dc.type'
    },
    icons: {
      metadata: [
        {
          name: 'mainField',
          style: 'fas fa-user'
        },
        {
          name: 'relatedField',
          style: 'fas fa-university'
        },
        {
          name: 'otherRelatedField',
          style: 'fas fa-circle'
        },
        {
          name: 'default',
          style: ''
        }
      ],
      authority: {
        confidence: [
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
          {
            value: 'default',
            style: 'text-muted'
          },
        ]
      }
    },
    detectDuplicate: {
      // NOTE: list of additional item metadata to show for duplicate match presentation list
      metadataDetailsList: [
        { label: 'Document type', name: 'dc.type' }
      ]
    }
  },

  // NOTE: will log all redux actions and transfers in console
  debug: false,

  // Default Language in which the UI will be rendered if the user's browser language is not an active language
  defaultLanguage: 'en',

  // Languages. DSpace Angular holds a message catalog for each of the following languages.
  // When set to active, users will be able to switch to the use of this language in the user interface.
  languages: [{
    code: 'en',
    label: 'English',
    active: true,
  }, {
    code: 'de',
    label: 'Deutsch',
    active: true,
  }, {
    code: 'cs',
    label: 'Čeština',
    active: true,
  }, {
    code: 'nl',
    label: 'Nederlands',
    active: true,
  }, {
    code: 'pt',
    label: 'Português',
    active: true,
  }, {
    code: 'fr',
    label: 'Français',
    active: true,
  }, {
    code: 'lv',
    label: 'Latviešu',
    active: true,
  }, {
    code: 'bn',
    label: 'বাংলা',
    active: true,
  }, {
    code: 'el',
    label: 'Ελληνικά',
    active: true,
  }],

  // Browse-By Pages
  browseBy: {
    // Amount of years to display using jumps of one year (current year - oneYearLimit)
    oneYearLimit: 10,
    // Limit for years to display using jumps of five years (current year - fiveYearLimit)
    fiveYearLimit: 30,
    // The absolute lowest year to display in the dropdown (only used when no lowest date can be found for all items)
    defaultLowerLimit: 1900,
    // Whether to add item thumbnail images to BOTH browse and search result lists.
    showThumbnails: true,
    // The number of entries in a paginated browse results list.
    // Rounded to the nearest size in the list of selectable sizes on the
    // settings menu.  See pageSizeOptions in 'pagination-component-options.model.ts'.
    pageSize: 20,
  },
  communityList: {
    pageSize: 20
  },
  homePage: {
    recentSubmissions: {
      pageSize: 5,
      // sort record of recent submission
      sortField: 'dc.date.accessioned',
    },
    topLevelCommunityList: {
      pageSize: 5
    }
  },
  followAuthorityMetadata: [
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
    }
  ],
  item: {
    edit: {
      undoTimeout: 10000 // 10 seconds
    },
    // Show the item access status label in items lists
    showAccessStatuses: false
  },
  collection: {
    edit: {
      undoTimeout: 10000 // 10 seconds
    }
  },
  themes: [
    {
      name: 'full-item-page-theme',
      regex: 'items/aa6c6c83-3a83-4953-95d1-2bc2e67854d2/full'
    },
    {
      name: 'error-theme',
      regex: 'collections/aaaa.*'
    },
    {
      name: 'handle-theme',
      handle: '10673/1233'
    },
    {
      name: 'regex-theme',
      regex: 'collections\/e8043bc2.*'
    },
    {
      name: 'uuid-theme',
      uuid: '0958c910-2037-42a9-81c7-dca80e3892b4'
    },
    {
      name: 'base',
    },
  ],
  bundle: {
    standardBundles: ['ORIGINAL', 'THUMBNAIL', 'LICENSE'],
  },
  mediaViewer: {
    image: true,
    video: true
  },
  info: {
    enableEndUserAgreement: true,
    enablePrivacyStatement: true,
  },
  markdown: {
    enabled: false,
    mathjax: false,
  },
  crisLayout: {
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
        name: 'mailto',
        baseUrl: 'mailto:'
      }
    ],
    crisRef: [
      {
        entityType: 'DEFAULT',
        entityStyle: {
          default: {
            icon: 'fa fa-user',
            style: 'text-success'
          }
        }
      },
      {
        entityType: 'PERSON',
        entityStyle: {
          person: {
            icon: 'fa fa-user',
            style: 'text-success'
          },
          personStaff: {
            icon: 'fa fa-user',
            style: 'text-primary'
          },
          default: {
            icon: 'fa fa-user',
            style: 'text-success'
          }
        }
      },
      {
        entityType: 'ORGUNIT',
        entityStyle: {
          default: {
            icon: 'fa fa-university',
            style: 'text-success'
          }
        }
      }
    ],
    crisRefStyleMetadata: 'cris.entity.style',
    itemPage: {
      Person: {
        orientation: 'horizontal'
      },
      OrgUnit: {
        orientation: 'horizontal'
      },
      default: {
        orientation: 'vertical'
      },
    },
    metadataBox: {
      defaultMetadataLabelColStyle: 'col-3',
      defaultMetadataValueColStyle: 'col-9'
    }
  },
  layout: {
    navbar: {
      // If true, show the "Community and Collections" link in the navbar; otherwise, show it in the admin sidebar
      showCommunityCollection: true,
    },
    search: {
      filters: {
        datepicker: ['dateReminder'],
        discoveryConfig: {
          'COMMENT_ALL.Person.comment_person_all': {
            'dateReminder': {
              filterType: 'range',
              minValue: {
                operator: '-',
                value: { day: 10 }
              },
              maxValue: {
                operator: '+',
                value: { day: 10 }
              }
            }
          }
        }
      }
    }
  },
  security: {
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
      }]
  },
  suggestion: [
  ],
  cms: {
    metadataList: [
      'cris.cms.home-header',
      'cris.cms.home-news',
      'cris.cms.footer',
    ]
  },
  addThisPlugin: {
    siteId: '',
    scriptUrl: 'http://s7.addthis.com/js/300/addthis_widget.js#pubid=',
    socialNetworksEnabled: false
  },
  metricVisualizationConfig: [
    {
      type: 'altmetric',
      icon: null,
      class: 'alert-light',
    },
    {
      type: 'plumX',
      icon: null,
      class: null,
    },
    {
      type: 'dimensions',
      icon: 'fa fa-cubes',
      class: 'alert-secondary',
    },
    {
      type: 'google-scholar',
      icon: '/assets/images/google-scholar.svg',
      class: 'alert-info',
    },
    {
      type: 'embedded-view',
      icon: 'fa fa-eye',
      class: 'alert-success'
    },
    {
      type: 'embedded-download',
      icon: 'fa fa-cloud-download-alt',
      class: 'alert-danger',
    },
    {
      type: 'view',
      icon: 'fa fa-eye',
      class: 'alert-success',
    },
    {
      type: 'download',
      icon: 'fa fa-cloud-download-alt',
      class: 'alert-danger',
    },
  ],

  attachmentRendering: {
    pagination: {
      enabled: true,
      elementsPerPage: 2
    },
  },

  advancedAttachmentRendering: {
    pagination: {
      enabled: true,
      elementsPerPage: 2
    },
    metadata: [
      {
        name: 'dc.title',
        type: AdvancedAttachmentElementType.Metadata,
        truncatable: false
      },
      {
        name: 'dc.type',
        type: AdvancedAttachmentElementType.Metadata,
        truncatable: false
      },
      {
        name: 'dc.description',
        type: AdvancedAttachmentElementType.Metadata,
        truncatable: true
      },
      {
        name: 'size',
        type: AdvancedAttachmentElementType.Attribute,
      },
      {
        name: 'format',
        type: AdvancedAttachmentElementType.Attribute,
      },
      {
        name: 'checksum',
        type: AdvancedAttachmentElementType.Attribute,
      }
    ]
  },
  projects: {
    projectsGrantsOptionsVocabularyName: 'item_shared',
    projectsEntityAdminEditMode: 'ADMIN_EDIT',
    projectsEntityEditMode: 'CUSTOM',
    projectsEntityFunderEditMode: 'FUNDER_EDIT',
    projectVersionUniqueIdMetadata: 'synsicris.uniqueid',
    excludeComparisonMetadata: ['dspace.entity.type'],
    projectsBrowse: {
      adminAndFunders: {
        firstStepSearchQueryConfigurationName: 'firstStepSearchProjectsForAdminAndFunders',
        firstStepSearchBrowseAllProjectConfigurationName: 'firstStepSearchAllProjectForAdminAndFunders',
        secondSearchProjectItemsConfigurationName: 'secondStepSearchProjectItemsForAdminAndFunders',
      },
      members: {
        firstStepSearchQueryConfigurationName: 'firstStepSearchProjectsForMembers',
        firstStepSearchBrowseAllProjectConfigurationName: 'firstStepSearchAllProjectForMembers',
        secondSearchProjectItemsConfigurationName: 'secondStepSearchProjectItems',
      },
      entityTypeFilterName: 'entityType'
    },
    versioningEditMode: 'VERSIONING',
    versioningEditFormSection: 'projects_versioning',
    lastVersionDiscoveryConfig: 'RELATION.last_visible_version'
  },
  impactPathway: {
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
  },
  workingPlan: {
    workingPlanRelationMetadata: 'synsicris.relation.workingplan',
    workingPlanFormName: 'working_plan_form',
    workingPlanStepsFormName: 'working_plan_step_form',
    workingPlanEditMode: 'WORKINGPLAN',
    workingPlanEditFormSection: 'working_plan-edit_form',
    workingPlanStepStatusMetadata: 'synsicris.type.status',
    workingPlanStepResponsibleMetadata: 'synsicris.relation.partnerwp',
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
  },
  exploitationPlan: {
    questionsBoardFormPrefix: 'exploitation_plan',
    questionsBoardI18nPrefix: 'exploitation-plan',
    questionsBoardRelationMetadata: 'synsicris.relation.exploitationplan',
    questionsBoardStepEntityName: 'exploitationplanstep',
    questionsBoardStepRelationMetadata: 'exploitationplan.relation.step',
    questionsBoardTaskRelationMetadata: 'exploitationplan.relation.task',
    questionsBoardPartnerMetadata: '',
    questionsBoardTaskFormSection: 'exploitation_plan_task_form',
    questionsBoardEditFormSection: 'exploitation_plan-edit_form',
    questionsBoardEditMode: 'EXPLOITATIONPLAN',
    questionsBoardStepIcon: true
  },
  interimReport: {
    questionsBoardFormPrefix: 'interim_report',
    questionsBoardI18nPrefix: 'interim-report',
    questionsBoardRelationMetadata: 'synsicris.relation.interimreport',
    questionsBoardStepEntityName: 'interim_report_step',
    questionsBoardStepRelationMetadata: 'interimreport.relation.step',
    questionsBoardTaskRelationMetadata: 'interimreport.relation.task',
    questionsBoardPartnerMetadata: '',
    questionsBoardTaskFormSection: 'interim_report_task_form',
    questionsBoardEditFormSection: 'interim_report-edit_form',
    questionsBoardEditMode: 'INTERIMREPORT',
    questionsBoardStepIcon: false
  },
  displayItemSearchResult: {
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
            type: DisplayItemMetadataType.Date
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
    ]
  },
  comments: {
    commentEditFormName: 'comments',
    commentEditFormSection: 'comments',
    commentAdminEditMode: 'ADMIN_EDIT',
    commentEditMode: 'COMMENT',
    commentEntityType: 'comment',
    commentRelationItemMetadata: 'synsicris.relation.commentItem',
    commentRelationItemVersionMetadata: 'synsicris.relation.commentItemVersion',
    commentRelationProjectMetadata: 'synsicris.relation.commentProject',
    commentRelationProjectVersionMetadata: 'synsicris.relation.commentProjectVersion',
    commentRelationBoardMetadata: 'synsicris.relation.commentBoard',
  }
};
