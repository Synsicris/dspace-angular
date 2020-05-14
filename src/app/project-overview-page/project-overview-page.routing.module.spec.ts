import { ProjectOverViewPageRoutingModule } from './project-page.routing.module';

describe('ProjectPage.RoutingModule', () => {
  let projectPageRoutingModule: ProjectOverViewPageRoutingModule;

  beforeEach(() => {
    projectPageRoutingModule = new ProjectOverViewPageRoutingModule();
  });

  it('should create an instance', () => {
    expect(projectPageRoutingModule).toBeTruthy();
  });
});
