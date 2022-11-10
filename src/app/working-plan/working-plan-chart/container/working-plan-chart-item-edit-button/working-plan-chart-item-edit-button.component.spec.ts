import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditItemDataService } from '../../../../core/submission/edititem-data.service';

import { WorkingPlanChartItemEditButtonComponent } from './working-plan-chart-item-edit-button.component';

describe('WorkingPlanChartItemEditButtonComponent', () => {
  let component: WorkingPlanChartItemEditButtonComponent;
  let fixture: ComponentFixture<WorkingPlanChartItemEditButtonComponent>;

  const editItemDataService = jasmine.createSpyObj('EditItemDataService', {
    checkEditModeByIDAndType: jasmine.createSpy('checkEditModeByIDAndType'),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingPlanChartItemEditButtonComponent],
      providers: [
        { provide: EditItemDataService, useValue: editItemDataService }
      ]
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
