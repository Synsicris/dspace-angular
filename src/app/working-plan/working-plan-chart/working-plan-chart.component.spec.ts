import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingPlanChartComponent } from './working-plan-chart.component';

describe('WorkingPlanChartComponent', () => {
  let component: WorkingPlanChartComponent;
  let fixture: ComponentFixture<WorkingPlanChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingPlanChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingPlanChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
