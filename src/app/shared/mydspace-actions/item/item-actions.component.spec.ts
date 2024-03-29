import { ChangeDetectionStrategy, Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';

import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { RouterStub } from '../../testing/router.stub';
import { Item } from '../../../core/shared/item.model';
import { ItemActionsComponent } from './item-actions.component';
import { ItemDataService } from '../../../core/data/item-data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { RequestService } from '../../../core/data/request.service';
import { getMockSearchService } from '../../mocks/search-service.mock';
import { getMockRequestService } from '../../mocks/request.service.mock';
import { SearchService } from '../../../core/shared/search/search.service';
import { ProjectVersionService } from '../../../core/project/project-version.service';
import { EditItemDataService } from '../../../core/submission/edititem-data.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import SpyObj = jasmine.SpyObj;

let component: ItemActionsComponent;
let fixture: ComponentFixture<ItemActionsComponent>;

let mockObject: Item;

const mockDataService = {};

mockObject = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dc.type': [
      {
        language: null,
        value: 'Article'
      }
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald'
      }
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26'
      }
    ]
  },
  _links: {
    self: 'http://localhost:8000'
  }
});

const searchService = getMockSearchService();

const requestServce = getMockRequestService();

const authorizationDataService: AuthorizationDataService = jasmine.createSpyObj('AuthorizationDataService', {
  isAuthorized: observableOf(true)
});

const projectVersionService = jasmine.createSpyObj('ProjectVersionService', {
  isVersionOfAnItem: jasmine.createSpy('isVersionOfAnItem'),
  getVersionByItemId: jasmine.createSpy('getVersionByItemId')
});
let editItemDataService: SpyObj<EditItemDataService>;

let aroute;

describe('ItemActionsComponent', () => {
  beforeEach(waitForAsync(() => {

    aroute = {
      data: observableOf({ isVersionOfAnItem: observableOf(false) }),
    };

    editItemDataService = jasmine.createSpyObj('EditItemDataService', {
      checkEditModeByIdAndType: jasmine.createSpy('checkEditModeByIdAndType')
    });

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [ItemActionsComponent],
      providers: [
        { provide: Injector, useValue: {} },
        { provide: Router, useValue: new RouterStub() },
        { provide: ItemDataService, useValue: mockDataService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: SearchService, useValue: searchService },
        { provide: RequestService, useValue: requestServce },
        { provide: AuthorizationDataService, useValue: authorizationDataService },
        { provide: ActivatedRoute, useValue: aroute },
        { provide: EditItemDataService, useValue: editItemDataService },
        { provide: ProjectVersionService, useValue: projectVersionService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemActionsComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemActionsComponent);
    component = fixture.componentInstance;
    component.object = mockObject;

  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  describe('when is version of an item', () => {
    beforeEach(() => {
      projectVersionService.isVersionOfAnItem.and.returnValue(false);
      editItemDataService.checkEditModeByIdAndType.and.returnValues(observableOf(false), observableOf(true));
      fixture.detectChanges();
    });

    it('should init object properly', () => {
      component.object = null;
      component.initObjects(mockObject);

      expect(component.object).toEqual(mockObject);
    });

    it('should not render edit button', () => {
      const link = fixture.debugElement.query(By.css('button[data-test="edit"]'));
      expect(link).toBeTruthy();
    });
  });


  describe('when is version of an item', () => {

    beforeEach(() => {
      projectVersionService.isVersionOfAnItem.and.returnValue(true);
      fixture.detectChanges();
    });

    it('should not render edit button', () => {
      const link = fixture.debugElement.query(By.css('button[data-test="edit"]'));
      expect(link).toBeNull();
    });
    it('should not render edit grants button', () => {
      const link = fixture.debugElement.query(By.css('button[data-test="edit-grants"]'));
      expect(link).toBeNull();
    });

  });


});
