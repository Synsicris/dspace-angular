import { AuthorizationDataService } from './../../../core/data/feature-authorization/authorization-data.service';
import { ComponentFixture, TestBed, waitForAsync, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { Item } from '../../../core/shared/item.model';
import { AuditItemMenuComponent } from './audit-item-menu.component';
import { AuthService } from '../../../core/auth/auth.service';
import { DebugElement } from '@angular/core';

describe('AuditItemMenuComponent', () => {
  let component: AuditItemMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<AuditItemMenuComponent>;
  let scheduler: TestScheduler;
  let dso: DSpaceObject;
  let de: DebugElement;

  const authorizationDataService: AuthorizationDataService = jasmine.createSpyObj('AuthorizationDataService', {
    isAuthorized: observableOf(true)
  });

  const authServiceStub = jasmine.createSpyObj('authorizationService', {
    getAuthenticatedUserFromStore: jasmine.createSpy('getAuthenticatedUserFromStore'),
    isAuthenticated: jasmine.createSpy('isAuthenticated')
  });

  beforeEach(async(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });

    TestBed.configureTestingModule({
      declarations: [AuditItemMenuComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
        { provide: AuthService, useValue: authServiceStub },
        { provide: AuthorizationDataService, useValue: authorizationDataService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(AuditItemMenuComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    componentAsAny.authorizationDataService = authorizationDataService;
    component.contextMenuObject = dso;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user is authenticated', () => {
    beforeEach(() => {
      (authServiceStub.isAuthenticated as jasmine.Spy).and.returnValue(observableOf(true));
      fixture.detectChanges();
    });
    it('should render a button', () => {
      const link = de.query(By.css('button'));
      expect(link).not.toBeNull();
    });

  });

  describe('when the user is not authenticated', () => {
    beforeEach(() => {
      (authServiceStub.isAuthenticated as jasmine.Spy).and.returnValue(observableOf(false));
      fixture.detectChanges();
    });
    it('should render a button', () => {
      const link = de.query(By.css('button'));
      expect(link).toBeNull();
    });

  });
});
