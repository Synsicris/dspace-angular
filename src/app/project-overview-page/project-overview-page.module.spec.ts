import { ProjectOverviewPageModule } from './project-overview-page.module';

describe('ProjectOverviewPageModule', () => {
  let projectOverviewPageModule: ProjectOverviewPageModule;

  beforeEach(() => {
    projectOverviewPageModule = new ProjectOverviewPageModule();
  });

  it('should create an instance', () => {
    expect(projectOverviewPageModule).toBeTruthy();
  });
});
