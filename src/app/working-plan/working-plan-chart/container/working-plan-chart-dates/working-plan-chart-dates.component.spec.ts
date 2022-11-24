import { ChartDateViewType } from './../../../core/working-plan.reducer';
import { TranslateLoaderMock } from './../../../../shared/testing/translate-loader.mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingPlanChartDatesComponent } from './working-plan-chart-dates.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { getMockTranslateService } from './../../../../shared/mocks/translate.service.mock';
import { WorkingPlanService } from '../../../../working-plan/core/working-plan.service';
import { WorkingPlanStateService } from '../../../../working-plan/core/working-plan-state.service';
import { of } from 'rxjs';

describe('WorkingPlanChartDatesComponent', () => {
  let component: WorkingPlanChartDatesComponent;
  let fixture: ComponentFixture<WorkingPlanChartDatesComponent>;
  let translateService: TranslateService;

  const workingPlanService = jasmine.createSpyObj('WorkingPlanService', {
    getWorkpackageFormConfig: jasmine.createSpy('getWorkpackageFormConfig'),
    getWorkpackageFormHeader: jasmine.createSpy('getWorkpackageFormHeader'),
    getWorkingPlanTaskSearchHeader: jasmine.createSpy('getWorkingPlanTaskSearchHeader'),
    setDefaultForStatusMetadata: jasmine.createSpy('setDefaultForStatusMetadata'),
  });

  const workingPlanStateService = jasmine.createSpyObj('WorkingPlanStateService', {
    getChartDateViewSelector: jasmine.createSpy('getChartDateViewSelector'),
  });


  beforeEach(async () => {
    translateService = getMockTranslateService();

    workingPlanStateService.getChartDateViewSelector.and.returnValue(of(ChartDateViewType.year));

    await TestBed.configureTestingModule({
      declarations: [WorkingPlanChartDatesComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        { provide: TranslateService, useValue: translateService },
        { provide: WorkingPlanService, useValue: workingPlanService },
        { provide: WorkingPlanStateService, useValue: workingPlanStateService },
      ]
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
