import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { EditItemDataService } from '../../core/submission/edititem-data.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WorkingPlanChartComponent } from './working-plan-chart.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { getMockTranslateService } from '../../shared/mocks/translate.service.mock';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { createPaginatedList } from '../../shared/testing/utils.test';

describe('WorkingPlanChartComponent', () => {
  let component: WorkingPlanChartComponent;
  let fixture: ComponentFixture<WorkingPlanChartComponent>;
  let editItemDataService: EditItemDataService;
  const eiResult = 'eiResult' as any;
  let translateService: TranslateService;

  beforeEach(waitForAsync(() => {

    editItemDataService = jasmine.createSpyObj('EditItemDataService', {
      findById: eiResult
    });
    translateService = getMockTranslateService();
    const emptyList = createSuccessfulRemoteDataObject(createPaginatedList([]));

    const collectionDataServiceStub = jasmine.createSpyObj('CollectionDataService', {
      getMappedItems: () => observableOf(emptyList),
      clearMappedItemsRequests: () => null
    });
    TestBed.configureTestingModule({
      declarations: [WorkingPlanChartComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        NgbAccordionModule
      ],
      providers: [
        { provide: EditItemDataService, useValue: editItemDataService },
        { provide: TranslateService, useValue: translateService },
        { provide: CollectionDataService, useValue: collectionDataServiceStub },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingPlanChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
