export const ProjectEntityList = new Map([
    [
      'activities', new Map([
        ['plan', ['plan_cooperation_events', 'plan_participation_events', 'plan_events', 'targetgroups' ]],
        ['ist', ['cooperation_events', 'participation_events', 'events', 'targetgroups']]
      ])
    ],
    [
      'results', new Map([
        ['plan', [
          'plan_publications',
          'plan_physical_objects',
          'plan_patents',
          'plan_innovationideas',
          'plan_innovationpotentials_econtech',
          'plan_innovationpotentials_social',
          'plan_spinoffs'
        ]],
        ['ist', [
          'publications',
          'physical_objects',
          'patents',
          'innovationideas',
          'innovationpotentials_econtech',
          'innovationpotentials_social',
          'unexpected_results',
          'steps',
          'spinoffs',
          'applications_econtech',
          'applications_social',
          'awards'
        ]]
      ])
    ]
])
