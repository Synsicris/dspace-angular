import { commentItem } from '../../../../../shared/mocks/comment.mock';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectionStrategy, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { CommentSearchResultListElementComponent } from './comment-search-result-list-element.component';
import { Item } from '../../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../../../shared/mocks/dso-name.service.mock';
import { By } from '@angular/platform-browser';
import { SubmissionFormsConfigService } from '../../../../../core/config/submission-forms-config.service';
import { AuthorizationDataService } from '../../../../../core/data/feature-authorization/authorization-data.service';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../../../shared/testing/notifications-service.stub';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';
import { EditItemDataService } from '../../../../../core/submission/edititem-data.service';
import { followLink } from '../../../../../shared/utils/follow-link-config.model';

let component: CommentSearchResultListElementComponent;
let fixture: ComponentFixture<CommentSearchResultListElementComponent>;
let de: DebugElement;
let submissionConfigurationStub: SubmissionFormsConfigService;
let authorizationService: AuthorizationDataService;
let itemDataServiceStub: ItemDataService;
let editItemDataService: EditItemDataService;

const commentItemObjectMock: ItemSearchResult = Object.assign(
  new ItemSearchResult(),
  {
    indexableObject: Object.assign(new Item(), commentItem)
  });

const eiResult = 'eiResult' as any;

function getMockSubmissionFormsConfigService(): SubmissionFormsConfigService {
  return jasmine.createSpyObj('SubmissionFormsConfigService', {
    findByName: jasmine.createSpy('findByName'),
  });
}

describe('CommentSearchResultListElementComponent', () => {
  submissionConfigurationStub = getMockSubmissionFormsConfigService();

  authorizationService = jasmine.createSpyObj('authorizationService', {
    isAuthorized: observableOf(true)
  });

  itemDataServiceStub = jasmine.createSpyObj('itemDataService', {
    delete: observableOf(null)
  });

  editItemDataService = jasmine.createSpyObj('EditItemDataService', {
    findById: observableOf(eiResult)
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [CommentSearchResultListElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: {} },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: SubmissionFormsConfigService, useValue: submissionConfigurationStub },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: ItemDataService, useValue: itemDataServiceStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: EditItemDataService, useValue: editItemDataService },
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CommentSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CommentSearchResultListElementComponent);
    component = fixture.componentInstance;
    component.object = commentItemObjectMock;
    de = fixture.debugElement;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have called editItemService findby id with correct parametners', () => {
    expect(editItemDataService.findById).toHaveBeenCalledWith('940bbbbe-94ff-481f-ae87-2dbf9b36ae53:none', false, true, followLink('modes'));
  });

  it('should show ds-type-badge', () => {
    expect(de.query(By.css('ds-type-badge'))).toBeTruthy();
  });

  it('should show item-list-title', () => {
    console.log(de.query(By.css('item-list-title')));
    expect(de.query(By.css('.item-list-title'))).toBeTruthy();
  });

  it('should show item-list-authors', () => {
    expect(de.query(By.css('.item-list-authors'))).toBeTruthy();
  });

  it('shold have item-list-date length 2', () => {
    expect(de.queryAll(By.css('.item-list-date')).length).toEqual(2);
  });

  it('should show badge-info', () => {
    expect(de.query(By.css('.badge-info'))).toBeTruthy();
  });

  it('should show description', () => {
    expect(de.query(By.css('.description'))).toBeTruthy();
  });

  it('should have called getCanDelete', () => {
    const spyon = spyOn(component, 'canDelete');
    fixture.detectChanges();
    expect(spyon).toHaveBeenCalled();
  });

  it('should have called getCanEdit', () => {
    const spyon = spyOn(component, 'canEdit');
    fixture.detectChanges();
    expect(spyon).toHaveBeenCalled();
  });

  describe('when user is not authorized', () => {
    beforeEach(() => {
      (authorizationService.isAuthorized as any).and.returnValue(observableOf(false));
      fixture.detectChanges();
    });

    it('should not deisplay edit button', () => {
      expect(de.query(By.css('.btn-primary'))).toBeNull();
    });

    it('should not display delete button', () => {
      expect(de.query(By.css('.btn-danger'))).toBeNull();
    });

  });

  describe('when user is authorized', () => {
    beforeEach(() => {
      const spyon = spyOn(component, 'canEdit');
      (authorizationService.isAuthorized as any).and.returnValue(observableOf(true));
      (spyon as any).and.returnValue(observableOf(true));
      fixture.detectChanges();
    });


    it('should display edit button', () => {
      expect(de.query(By.css('.btn-primary'))).toBeTruthy();
    });

    it('should display delete button', () => {
      expect(de.query(By.css('.btn-danger'))).toBeTruthy();
    });

  });

});
