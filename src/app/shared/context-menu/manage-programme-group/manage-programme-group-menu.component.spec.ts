import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { Item } from '../../../core/shared/item.model';
import { ManageProgrammeGroupMenuComponent } from './manage-programme-group-menu.component';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { mockGroup } from '../../mocks/submission.mock';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { buildPaginatedList } from '../../../core/data/paginated-list.model';
import { PageInfo } from '../../../core/shared/page-info.model';
import { ProjectGroupService } from '../../../core/project/project-group.service';

describe('ManageProgrammeGroupMenuComponent', () => {
  let component: ManageProgrammeGroupMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<ManageProgrammeGroupMenuComponent>;
  let authorizationService: AuthorizationDataService;

  const groupDataService = jasmine.createSpyObj('groupDataService', {
    searchGroups: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo({
      elementsPerPage: 2,
      totalElements: 1,
      totalPages: 1,
      currentPage: 1
    }), [mockGroup])),
    getGroupName: 'programme_test-item_group'
  });

  const projectGroupService = jasmine.createSpyObj('ProjectGroupService', {
    getProgrammeGroupNameByItem: 'programme_test-item_group'
  });

  let dso: DSpaceObject;

  beforeEach(async(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      entityType: 'programme',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });

    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true),
    });


    TestBed.configureTestingModule({
      declarations: [ManageProgrammeGroupMenuComponent],
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
        { provide: GroupDataService, useValue: groupDataService },
        { provide: ProjectGroupService, useValue: projectGroupService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProgrammeGroupMenuComponent);
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

});
