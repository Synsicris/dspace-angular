import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { getTestScheduler } from 'jasmine-marbles';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { Item } from '../../../core/shared/item.model';
import { CreateProjectMenuComponent } from './create-project-menu.component';
import { ProjectAuthorizationService } from '../../../core/project/project-authorization.service';

describe('AuditItemMenuComponent', () => {
  let component: CreateProjectMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<CreateProjectMenuComponent>;
  let scheduler: TestScheduler;

  let dso: DSpaceObject;

  const projectAuthorizationService = jasmine.createSpyObj('projectAuthorizationService', {
    canCreateProject: jasmine.createSpy('canCreateProject')
  });

  beforeEach(async(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' }
      },
      entityType: 'Person'
    });

    TestBed.configureTestingModule({
      declarations: [ CreateProjectMenuComponent ],
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
        { provide: ProjectAuthorizationService, useValue: projectAuthorizationService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(CreateProjectMenuComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    component.contextMenuObject = dso;
    projectAuthorizationService.canCreateProject.and.returnValue(of(true));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a button', () => {
    const link = fixture.debugElement.query(By.css('button.dropdown-item'));
    expect(link).not.toBeNull();
  });

});
