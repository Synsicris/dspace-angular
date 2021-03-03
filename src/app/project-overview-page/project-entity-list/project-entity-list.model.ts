export const ProjectEntityList = new Map([
    [
      'activities', new Map([
        ['plan', ['plan_cooperation_events', 'plan_participation_events', 'plan_events', 'targetgroups' ]],
        ['ist', ['cooperation_events', 'participation_events', 'Event', 'targetgroups']]
      ])
    ],
    [
      'results', new Map([
        ['plan', [
          'plan_publication',
          'plan_physical_objects',
          'plan_patent',
          'plan_innovationideas',
          'plan_inn_pot_econtech',
          'plan_inn_pot_social',
          'plan_spinoffs'
        ]],
        ['ist', [
          'Publication',
          'physical_objects',
          'Patent',
          'innovationideas',
          'inn_pot_econtech',
          'inn_pot_social',
          'unexpected_results',
          'steps',
          'spinoffs',
          'applications_econtech',
          'applications_social',
          'awards'
        ]]
      ])
    ]
]);
