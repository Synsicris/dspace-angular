import { ProjectDataService } from './../../../../../core/project/project-data.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingPlanBoxComponent } from './working-plan-box.component';

describe('WorkingPlanBoxComponent', () => {
  let component: WorkingPlanBoxComponent;
  let fixture: ComponentFixture<WorkingPlanBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingPlanBoxComponent],
      providers: [
        {
          provider: ProjectDataService, useValue: jasmine.createSpyObj('ProjectDataService', {
            getProjectCommunityByProjectItemId: jasmine.createSpy('getProjectCommunityByProjectItemId')
          })
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingPlanBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
