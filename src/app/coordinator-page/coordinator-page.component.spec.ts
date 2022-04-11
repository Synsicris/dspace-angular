import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { getMockTranslateService } from '../shared/mocks/translate.service.mock';

import { CoordinatorPageComponent } from './coordinator-page.component';

describe('CoordinatorPageComponent', () => {
  let component: CoordinatorPageComponent;
  let fixture: ComponentFixture<CoordinatorPageComponent>;

  let translateService: TranslateService;
  let dsoNameService;

  beforeEach(async(() => {
    translateService = getMockTranslateService();

    dsoNameService = jasmine.createSpyObj('dsoNameService', {
      getName: 'Collection Name'
    });

    TestBed.configureTestingModule({
      declarations: [CoordinatorPageComponent],
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
        { provide: DSONameService, useValue: dsoNameService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
