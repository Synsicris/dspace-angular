import { TranslateLoaderMock } from './../../../shared/testing/translate-loader.mock';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingPlanChartContainerComponent } from './working-plan-chart-container.component';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { getMockTranslateService } from './../../../shared/mocks/translate.service.mock';

describe('WorkingPlanChartContainerComponent', () => {
  let component: WorkingPlanChartContainerComponent;
  let fixture: ComponentFixture<WorkingPlanChartContainerComponent>;

  let translateService: TranslateService;

  beforeEach(async(() => {
    translateService = getMockTranslateService();
    TestBed.configureTestingModule({
      declarations: [WorkingPlanChartContainerComponent],
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingPlanChartContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
