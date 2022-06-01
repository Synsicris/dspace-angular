import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingPlanChartItemEditButtonComponent } from './working-plan-chart-item-edit-button.component';

describe('WorkingPlanChartItemEditButtonComponent', () => {
  let component: WorkingPlanChartItemEditButtonComponent;
  let fixture: ComponentFixture<WorkingPlanChartItemEditButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingPlanChartItemEditButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingPlanChartItemEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
