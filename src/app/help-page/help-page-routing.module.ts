import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HelpPageComponent } from './help-page.component';
import { HelpPageContentComponent } from './content/help-page-content.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: HelpPageComponent,
      },
      {
        path: 'funder',
        component: HelpPageContentComponent,
        data: {
          i18nKey: 'funder'
        }
      },
      {
        path: 'project',
        component: HelpPageContentComponent,
        data: {
          i18nKey: 'project',
          children: [
            'about',
            'use',
            'funder',
            'step',
            'details'
          ]
        },
        children: [
          {
            path: 'about',
            component: HelpPageContentComponent,
            data: {
              i18nKey: 'project.about',
              children: [
                'objectives',
                'difference',
                'overview'
              ]
            },
            children: [
              {
                path: 'objectives',
                component: HelpPageContentComponent,
                data: {
                  i18nKey: 'project.about.objectives'
                }
              },
              {
                path: 'difference',
                component: HelpPageContentComponent,
                data: {
                  i18nKey: 'project.about.difference'
                }
              },
              {
                path: 'overview',
                component: HelpPageContentComponent,
                data: {
                  i18nKey: 'project.about.overview',
                  children: [
                    'entities',
                    'structure'
                  ]
                },
                children: [
                  {
                    path: 'entities',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.about.overview.entities'
                    }
                  },
                  {
                    path: 'structure',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.about.overview.structure'
                    }
                  }
                ]
              }
            ]
          },
          {
            path: 'use',
            component: HelpPageContentComponent,
            data: {
              i18nKey: 'project.use',
              children: [
                'items',
                'functions'
              ]
            },
            children: [
              {
                path: 'items',
                component: HelpPageContentComponent,
                data: {
                  i18nKey: 'project.use.items',
                  children: [
                    'fill',
                    'help',
                    'upload'
                  ]
                },
                children: [
                  {
                    path: 'fill',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.use.items.fill'
                    },
                  },
                  {
                    path: 'help',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.use.items.help'
                    },
                  },
                  {
                    path: 'upload',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.use.items.upload'
                    },
                  }
                ]
              },
              {
                path: 'functions',
                component: HelpPageContentComponent,
                data: {
                  i18nKey: 'project.use.functions',
                  children: [
                    'language',
                    'menu',
                    'contextmenu',
                    'saving',
                    'versioning',
                    'export'
                  ]
                },
                children: [
                  {
                    path: 'language',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.use.functions.language'
                    },
                  },
                  {
                    path: 'menu',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.use.functions.menu'
                    },
                  },
                  {
                    path: 'contextmenu',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.use.functions.contextmenu'
                    },
                  },
                  {
                    path: 'saving',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.use.functions.saving'
                    },
                  },
                  {
                    path: 'versioning',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.use.functions.versioning'
                    },
                  },
                  {
                    path: 'export',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.use.functions.export'
                    },
                  }
                ]
              }
            ]
          },
          {
            path: 'funder',
            component: HelpPageContentComponent,
            data: {
              i18nKey: 'project.funder'
            }
          },
          {
            path: 'step',
            component: HelpPageContentComponent,
            data: {
              i18nKey: 'project.step',
              children: [
                'start',
                'proposal',
                'livetime',
                'completion',
                'update'
              ]
            },
            children: [
              {
                path: 'start',
                component: HelpPageContentComponent,
                data: {
                  i18nKey: 'project.step.start'
                }
              },
              {
                path: 'proposal',
                component: HelpPageContentComponent,
                data: {
                  i18nKey: 'project.step.proposal'
                }
              },
              {
                path: 'livetime',
                component: HelpPageContentComponent,
                data: {
                  i18nKey: 'project.step.livetime'
                }
              },
              {
                path: 'completion',
                component: HelpPageContentComponent,
                data: {
                  i18nKey: 'project.step.completion'
                }
              },
              {
                path: 'update',
                component: HelpPageContentComponent,
                data: {
                  i18nKey: 'project.step.update'
                }
              }
            ]
          },
          {
            path: 'details',
            component: HelpPageContentComponent,
            data: {
              i18nKey: 'project.details',
              children: [
                'ipw',
                'ap',
                'ep',
                'pages'
              ]
            },
            children: [
              {
                path: 'ipw',
                component: HelpPageContentComponent,
                data: {
                  i18nKey: 'project.details.ipw',
                  children: [
                    'ipwabout',
                    'ipwhelp'
                  ]
                },
                children: [
                  {
                    path: 'ipwabout',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.ipw.ipwabout'
                    }
                  },
                  {
                    path: 'ipwhelp',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.ipw.ipwhelp'
                    }
                  }
                ]
              },
              {
                path: 'ap',
                component: HelpPageContentComponent,
                data: {
                  i18nKey: 'project.details.ap',
                  children: [
                    'apabout',
                    'aphelp'
                  ]
                },
                children: [
                  {
                    path: 'apabout',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.ap.apabout'
                    }
                  },
                  {
                    path: 'aphelp',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.ap.aphelp'
                    }
                  }
                ]
              },
              {
                path: 'ep',
                component: HelpPageContentComponent,
                data: {
                  i18nKey: 'project.details.ep',
                  children: [
                    'epabout',
                    'ephelp'
                  ]
                },
                children: [
                  {
                    path: 'epabout',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.ep.epabout'
                    }
                  },
                  {
                    path: 'ephelp',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.ep.ephelp'
                    }
                  }
                ]
              },
              {
                path: 'pages',
                component: HelpPageContentComponent,
                data: {
                  i18nKey: 'project.details.pages',
                  children: [
                    'actor',
                    'application',
                    'award',
                    'contribution',
                    'cooperationpartner',
                    'ethics',
                    'event',
                    'impact',
                    'condition',
                    'gender',
                    'idea',
                    'milestone',
                    'step',
                    'object',
                    'orgunit',
                    'other',
                    'patent',
                    'person',
                    'planpublication',
                    'process',
                    'objective',
                    'parentproject',
                    'publication',
                    'finding',
                    'solution',
                    'spinoff',
                    'state',
                    'task',
                    'unexpected',
                    'workpackage',
                    'project',
                    'partner',
                    'subcontractor',
                    'data',
                    'team',
                  ]
                },
                children: [
                  {
                    path: 'actor',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.actor'
                    }
                  },
                  {
                    path: 'application',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.application'
                    }
                  },
                  {
                    path: 'award',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.award'
                    }
                  },
                  {
                    path: 'contribution',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.contribution'
                    }
                  },
                  {
                    path: 'cooperationpartner',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.cooperationpartner'
                    }
                  },
                  {
                    path: 'ethics',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.ethics'
                    }
                  },
                  {
                    path: 'event',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.event'
                    }
                  },
                  {
                    path: 'impact',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.impact'
                    }
                  },
                  {
                    path: 'condition',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.condition'
                    }
                  },
                  {
                    path: 'gender',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.gender'
                    }
                  },
                  {
                    path: 'idea',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.idea'
                    }
                  },
                  {
                    path: 'milestone',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.milestone'
                    }
                  },
                  {
                    path: 'step',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.step'
                    }
                  },
                  {
                    path: 'object',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.object'
                    }
                  },
                  {
                    path: 'orgunit',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.orgunit'
                    }
                  },
                  {
                    path: 'other',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.other'
                    }
                  },
                  {
                    path: 'patent',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.patent'
                    }
                  },
                  {
                    path: 'person',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.person'
                    }
                  },
                  {
                    path: 'planpublication',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.planpublication'
                    }
                  },
                  {
                    path: 'objective',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.objective'
                    }
                  },
                  {
                    path: 'parentproject',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.parentproject'
                    }
                  },
                  {
                    path: 'publication',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.publication'
                    }
                  },
                  {
                    path: 'finding',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.finding'
                    }
                  },
                  {
                    path: 'solution',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.solution'
                    }
                  },
                  {
                    path: 'spinoff',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.spinoff'
                    }
                  },
                  {
                    path: 'state',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.state'
                    }
                  },
                  {
                    path: 'task',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.task'
                    }
                  },
                  {
                    path: 'unexpected',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.unexpected'
                    }
                  },
                  {
                    path: 'workpackage',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.workpackage'
                    }
                  },
                  {
                    path: 'project',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.project'
                    }
                  },
                  {
                    path: 'partner',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.partner'
                    }
                  },
                  {
                    path: 'subcontractor',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.subcontractor'
                    }
                  },
                  {
                    path: 'data',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.data'
                    }
                  },
                  {
                    path: 'team',
                    component: HelpPageContentComponent,
                    data: {
                      i18nKey: 'project.details.pages.team'
                    }
                  }
                ]
              }
            ]
          }
        ],

      },
    ])
  ],
  providers: [
  ]
})
export class HelpPageRoutingModule {
}
