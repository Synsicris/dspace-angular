import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingPlanChartToolbarComponent } from './working-plan-chart-toolbar.component';

describe('WorkingPlanChartToolbarComponent', () => {
  let component: WorkingPlanChartToolbarComponent;
  let fixture: ComponentFixture<WorkingPlanChartToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingPlanChartToolbarComponent ]
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
