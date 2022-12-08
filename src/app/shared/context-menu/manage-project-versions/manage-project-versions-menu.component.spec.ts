import { AuthorizationDataService } from './../../../core/data/feature-authorization/authorization-data.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { Item } from '../../../core/shared/item.model';
import { ManageProjectVersionsMenuComponent } from './manage-project-versions-menu.component';
import { Observable, of as observableOf } from 'rxjs';
import { ProjectVersionService } from '../../../core/project/project-version.service';
import { Version } from 'src/app/core/shared/version.model';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';

describe('ManageProjectVersionsMenuComponent', () => {
  let component: ManageProjectVersionsMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<ManageProjectVersionsMenuComponent>;
  let scheduler: TestScheduler;
  let authorizationService: AuthorizationDataService;

  const projectVersionService = jasmine.createSpyObj('ProjectVersionService', {
    getParentRelationVersionsByItemId: jasmine.createSpy('getParentRelationVersionsByItemId'),
    getRelationVersionsByItemId: jasmine.createSpy('getRelationVersionsByItemId'),
  });

  let dso: DSpaceObject;


  const vitem1 = Object.assign(new Item(), {
    id: 'test-item1',
    entityType: 'Project',
    _links: {
      self: { href: 'test-item-selflink' }
    }
  });
  const vitem2 = Object.assign(new Item(), {
    id: 'test-item2',
    entityType: 'Project',
    _links: {
      self: { href: 'test-item-selflink' }
    }
  });


  beforeEach(async(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      entityType: 'Project',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });

    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true)
    });

    TestBed.configureTestingModule({
      declarations: [ManageProjectVersionsMenuComponent],
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
        { provide: ProjectVersionService, useValue: projectVersionService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(ManageProjectVersionsMenuComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    component.contextMenuObject = dso;

    projectVersionService.getParentRelationVersionsByItemId.and.returnValue(observableOf([vitem1]));
    projectVersionService.getRelationVersionsByItemId.and.returnValue(observableOf([vitem1, vitem2]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a button', () => {
    const link = fixture.debugElement.query(By.css('button'));
    expect(link).not.toBeNull();
  });

  describe('if no other versions', () => {

    beforeEach(() => {
      projectVersionService.getRelationVersionsByItemId.and.returnValue(observableOf([]));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not show link', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).toBeNull();
    });
  });

  describe('if not founder or coordinator', () => {

    beforeEach(() => {
      (authorizationService.isAuthorized as any).and.returnValue(observableOf(false));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not show link', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).toBeNull();
    });
  });


});
