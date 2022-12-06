import { AuthorizationDataService } from './../../../core/data/feature-authorization/authorization-data.service';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { Item } from '../../../core/shared/item.model';
import { ManageProjectMembersMenuComponent } from './manage-project-members-menu.component';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs';

describe('ManageProjectMembersMenuComponent', () => {
  let component: ManageProjectMembersMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<ManageProjectMembersMenuComponent>;
  let scheduler: TestScheduler;

  let dso: DSpaceObject;
  let authorizationService: AuthorizationDataService;
  let aroute;

  beforeEach(async(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      entityType: 'Funding',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });


    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true)
    });

    aroute = {
      data: observableOf({ isVersionOfAnItem: observableOf(false) }),
    };


    TestBed.configureTestingModule({
      declarations: [ManageProjectMembersMenuComponent],
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
        { provide: ActivatedRoute, useValue: aroute },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(ManageProjectMembersMenuComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    component.contextMenuObject = dso;

    component.ngOnInit();
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
