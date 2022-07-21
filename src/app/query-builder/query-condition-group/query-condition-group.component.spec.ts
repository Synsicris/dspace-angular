import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
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
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule,
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
