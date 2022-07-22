import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { LocaleService } from '../../core/locale/locale.service';

import { QueryConditionGroupComponent } from './query-condition-group.component';
import { FormBuilderService } from '../../shared/form/builder/form-builder.service';
import { getMockFormBuilderService } from '../../shared/mocks/form-builder-service.mock';
import { SearchService } from '../../core/shared/search/search.service';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { SearchFilterConfig } from '../../shared/search/models/search-filter-config.model';
import { FilterType } from '../../shared/search/models/filter-type.model';
import { NgSelectModule } from '@ng-select/ng-select';

fdescribe('QueryConditionGroupComponent', () => {
  let component: QueryConditionGroupComponent;
  let fixture: ComponentFixture<QueryConditionGroupComponent>;
  let builderService: FormBuilderService;
  let searchService: SearchService;

  const mockFundingFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'funding',
    filterType: FilterType.authority
  });

  const mockDateFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'projectStartDate',
    filterType: FilterType.range
  });

  const searchServiceStub = jasmine.createSpyObj('SearchService', {
    getConfig: jasmine.createSpy('getConfig')
  });

  beforeEach(async () => {
    builderService = getMockFormBuilderService();
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        NgSelectModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [ QueryConditionGroupComponent ],
      providers: [
        FormGroupDirective,
        { provide: SearchService, useValue: searchServiceStub },
        { provide: LocaleService, useValue: {} },
        { provide: FormBuilderService, useValue: builderService },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryConditionGroupComponent);
    component = fixture.componentInstance;
    searchService = (component as any).searchService;
    searchServiceStub.getConfig.and.returnValue(createSuccessfulRemoteDataObject$([mockFundingFilterConfig, mockDateFilterConfig]));
    component.formGroup = new FormGroup({
      defaultFilter: new FormControl(null),
      queryGroup: new FormArray([(new FormBuilder).group({
        filter: (new FormBuilder).control(
          { value: null, disabled: true },
          Validators.required
        ),
        value: (new FormBuilder).control(
          { value: null, disabled: true },
          Validators.required
        ),
        toDate: (new FormBuilder).control(
          { value: null, disabled: false },
        ),
        fromDate: (new FormBuilder).control(
          { value: null, disabled: false },
        ),
      })]),
    });
    (component.formGroup.get('queryGroup') as FormArray).get('0.filter').setValue({
      "type": {
          "value": "discovery-filter"
      },
      "pageSize": 10,
      "name": "types",
      "filterType": "authority",
      "_links": {
          "self": {
              "href": "http://localhost:8080/server/api/discover/facets/types"
          }
      }
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show dropdown', () => {
    expect(fixture.debugElement.query(By.css('div[data-test="query-condition-select"]'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('div[data-test="query-condition-date"]'))).toBeNull();
  });
});
