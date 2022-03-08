import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingPlanChartDatesComponent } from './working-plan-chart-dates.component';

describe('WorkingPlanChartDatesComponent', () => {
  let component: WorkingPlanChartDatesComponent;
  let fixture: ComponentFixture<WorkingPlanChartDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingPlanChartDatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingPlanChartDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
