import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkingPlanService } from '../../core/working-plan.service';

import { WorkingPlanChartToolbarComponent } from './working-plan-chart-toolbar.component';

describe('WorkingPlanChartToolbarComponent', () => {
  let component: WorkingPlanChartToolbarComponent;
  let fixture: ComponentFixture<WorkingPlanChartToolbarComponent>;

  const workingPlanService = jasmine.createSpyObj('WorkingPlanService', {
    getWorkpackageFormConfig: jasmine.createSpy('getWorkpackageFormConfig'),
    getWorkpackageFormHeader: jasmine.createSpy('getWorkpackageFormHeader'),
    getWorkingPlanTaskSearchHeader: jasmine.createSpy('getWorkingPlanTaskSearchHeader'),
    setDefaultForStatusMetadata: jasmine.createSpy('setDefaultForStatusMetadata'),
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkingPlanChartToolbarComponent],
      providers: [
        { provide: WorkingPlanService, useValue: workingPlanService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingPlanChartToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
