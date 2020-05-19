import { ProjectOverviewPageRoutingModule } from './project-overview-page.routing.module';

describe('ProjectPage.RoutingModule', () => {
  let projectPageRoutingModule: ProjectOverviewPageRoutingModule;

  beforeEach(() => {
    projectPageRoutingModule = new ProjectOverviewPageRoutingModule();
  });

  it('should create an instance', () => {
    expect(projectPageRoutingModule).toBeTruthy();
  });
});
