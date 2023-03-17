import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingPlanCommentsComponent } from './working-plan-comments.component';

describe('WorkingPlanCommentsComponent', () => {
  let component: WorkingPlanCommentsComponent;
  let fixture: ComponentFixture<WorkingPlanCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingPlanCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingPlanCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
