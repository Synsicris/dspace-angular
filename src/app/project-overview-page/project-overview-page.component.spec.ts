import { TranslateLoaderMock } from './../shared/testing/translate-loader.mock';
import { DsoRedirectDataService } from './../core/data/dso-redirect-data.service';
import { RouterMock } from './../shared/mocks/router.mock';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOverviewPageComponent } from './project-overview-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MockActivatedRoute } from '../shared/mocks/active-router.mock';
import { AuthService } from '../core/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { getMockTranslateService } from '../shared/mocks/translate.service.mock';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

describe('ProjectOverviewPageComponent', () => {
  let component: ProjectOverviewPageComponent;
  let fixture: ComponentFixture<ProjectOverviewPageComponent>;

  const route = new RouterMock();
  const authServiceStub = jasmine.createSpyObj('authorizationService', {
    getAuthenticatedUserFromStore: jasmine.createSpy('getAuthenticatedUserFromStore'),
    isAuthenticated: jasmine.createSpy('isAuthenticated')
  });
  let translateService: TranslateService;
  let dsoNameService;

  beforeEach(async(() => {
    translateService = getMockTranslateService();

    dsoNameService = jasmine.createSpyObj('dsoNameService', {
      getName: 'Collection Name'
    });


    TestBed.configureTestingModule({
      declarations: [ProjectOverviewPageComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: AuthService, useValue: authServiceStub },
        { provide: Router, useValue: route },
        { provide: TranslateService, useValue: translateService },
        { provide: DSONameService, useValue: dsoNameService },
        { provide: DsoRedirectDataService, useValue: {} },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectOverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
