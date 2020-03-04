import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingPlanComponent } from './working-plan.component';

describe('WorkingPlanChartComponent', () => {
  let component: WorkingPlanComponent;
  let fixture: ComponentFixture<WorkingPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
