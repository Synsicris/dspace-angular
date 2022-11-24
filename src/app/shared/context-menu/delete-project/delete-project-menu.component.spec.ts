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
import { DeleteProjectMenuComponent } from './delete-project-menu.component';
import { of as observableOf } from 'rxjs';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { ProjectDataService } from '../../../core/project/project-data.service';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';

describe('DeleteProjectMenuComponent', () => {
  let component: DeleteProjectMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<DeleteProjectMenuComponent>;
  let scheduler: TestScheduler;
  let authorizationService: AuthorizationDataService;

  let dso: DSpaceObject;

  const projectService = jasmine.createSpyObj('ProjectDataService', {
    getProjectCommunityByItemId: jasmine.createSpy('getProjectCommunityByItemId')
  });

  beforeEach(async(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      entityType: 'Project',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });

    projectService.getProjectCommunityByItemId.and.returnValue(createSuccessfulRemoteDataObject$(dso));

    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true)
    });

    TestBed.configureTestingModule({
      declarations: [DeleteProjectMenuComponent],
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
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: ProjectDataService, useValue: projectService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(DeleteProjectMenuComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    component.contextMenuObject = dso;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a button', () => {
    const link = fixture.debugElement.query(By.css('button'));
    expect(link).not.toBeNull();
  });

  describe('when is version of an item', () => {

    beforeEach(() => {
      spyOn(component, 'isVersionOfAnItem');
      (component.isVersionOfAnItem as jasmine.Spy).and.returnValue(observableOf(true));
      fixture.detectChanges();
    });

    it('should not render a button', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).toBeNull();
    });

  });
});
