import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingPlanChartContainerComponent } from './working-plan-chart-container.component';

describe('WorkingPlanChartContainerComponent', () => {
  let component: WorkingPlanChartContainerComponent;
  let fixture: ComponentFixture<WorkingPlanChartContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingPlanChartContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingPlanChartContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
