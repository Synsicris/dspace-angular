import { TranslateLoaderMock } from './../../../../shared/testing/translate-loader.mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingPlanChartDatesComponent } from './working-plan-chart-dates.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { getMockTranslateService } from './../../../../shared/mocks/translate.service.mock';

describe('WorkingPlanChartDatesComponent', () => {
  let component: WorkingPlanChartDatesComponent;
  let fixture: ComponentFixture<WorkingPlanChartDatesComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    translateService = getMockTranslateService();
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
