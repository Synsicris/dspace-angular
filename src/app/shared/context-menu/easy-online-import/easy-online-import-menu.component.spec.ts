import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TestScheduler } from 'rxjs/testing';
import { of as observableOf } from 'rxjs';
import { getTestScheduler } from 'jasmine-marbles';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { Item } from '../../../core/shared/item.model';
import { EasyOnlineImportMenuComponent } from './easy-online-import-menu.component';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';

describe('AuditItemMenuComponent', () => {
  let component: EasyOnlineImportMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<EasyOnlineImportMenuComponent>;
  let scheduler: TestScheduler;

  let dso: DSpaceObject;
  let authorizationService: any;

  beforeEach(waitForAsync(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: jasmine.createSpy('isAuthorized')
    });
    TestBed.configureTestingModule({
      declarations: [ EasyOnlineImportMenuComponent ],
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
        { provide: AuthorizationDataService, useValue: authorizationService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(EasyOnlineImportMenuComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    component.contextMenuObject = dso;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user can make import', () => {
    beforeEach(() => {
      authorizationService.isAuthorized.and.returnValue(observableOf(true));
      fixture.detectChanges();
    });

    it('should render a button', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).not.toBeNull();
    });

  });

  describe('when the user cannot make import', () => {
    beforeEach(() => {
      authorizationService.isAuthorized.and.returnValue(observableOf(false));
      fixture.detectChanges();
    });

    it('should not render a link', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).toBeNull();
    });
  });

});
