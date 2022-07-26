import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('QueryConditionGroupComponent', () => {
  let component: any;
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
    getConfig: jasmine.createSpy('getConfig'),
    getFacetValuesFor: jasmine.createSpy('getFacetValuesFor')
  });

  beforeEach(async () => {
    builderService = getMockFormBuilderService();
    const formBuilder = new FormBuilder()

    const formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = formBuilder.group({
      queryArray: formBuilder.array([
        formBuilder.group({
          defaultFilter: formBuilder.control(null),
          queryGroup: formBuilder.array([
            formBuilder.group({
              filter: formBuilder.control(
                { value: null, disabled: true },
                Validators.required
              ),
              value: formBuilder.control(
                { value: null, disabled: true },
                Validators.required
              ),
              toDate: formBuilder.control(
                { value: null, disabled: false },
              ),
              fromDate: formBuilder.control(
                { value: null, disabled: false },
              ),
            })
          ])
        })
      ])
    });

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
        FormBuilder,
        { provide: FormGroupDirective, useValue: formGroupDirective },
        { provide: SearchService, useValue: searchServiceStub },
        { provide: LocaleService, useValue: {} },
        { provide: FormBuilderService, useValue: builderService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryConditionGroupComponent);
    component = fixture.componentInstance;
    component.formGroupName = 0;
    searchService = component.searchService;
    searchServiceStub.getConfig.and.returnValue(createSuccessfulRemoteDataObject$([mockFundingFilterConfig, mockDateFilterConfig]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show dropdown and do not show datepicker', () => {
    expect(fixture.debugElement.query(By.css('[data-test="query-condition-select"]'))).not.toBeNull();

    expect(fixture.debugElement.query(By.css('[data-test="query-condition-date"]'))).toBeNull();
  });

  it('should not show dropdown and show datepicker', () => {
    component.queryGroup.get('0.filter').setValue({
      "type": {
          "value": "projectStartDate"
      },
      "pageSize": 10,
      "name": "types",
      "filterType": "date",
      "_links": {
          "self": {
              "href": "http://localhost:8080/server/api/discover/facets/types"
          }
      }
    });
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('[data-test="query-condition-select"]'))).toBeNull();

    expect(fixture.debugElement.query(By.css('[data-test="query-condition-date"]'))).not.toBeNull();
  });
});
