import { CoordinatorPageModule } from './coordinator-page.module';

describe('CoordinatorPageModule', () => {
  let coordinatorPageModule: CoordinatorPageModule;

  beforeEach(() => {
    coordinatorPageModule = new CoordinatorPageModule();
  });

  it('should create an instance', () => {
    expect(coordinatorPageModule).toBeTruthy();
  });
});
