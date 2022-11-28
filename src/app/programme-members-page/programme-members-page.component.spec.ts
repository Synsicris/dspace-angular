import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { of } from 'rxjs';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ProgrammeMembersPageComponent } from './programme-members-page.component';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { Item } from '../core/shared/item.model';
import { GroupDataService } from '../core/eperson/group-data.service';
import { AuthService } from '../core/auth/auth.service';
import { AuthServiceMock } from '../shared/mocks/auth.service.mock';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { ProjectGroupService } from '../core/project/project-group.service';
import { Group } from '../core/eperson/models/group.model';
import { TranslateLoaderMock } from '../shared/testing/translate-loader.mock';

describe('ProgrammeMembersPageComponent', () => {
  let component: ProgrammeMembersPageComponent;
  let fixture: ComponentFixture<ProgrammeMembersPageComponent>;

  const authService = new AuthServiceMock();
  const authorizationServiceMock = jasmine.createSpyObj('AuthorizationDataService', {
    isAuthorized: jasmine.createSpy('isAuthorized')
  });
  const groupServiceMock = jasmine.createSpyObj('GroupDataService', {
    findById: jasmine.createSpy('findById')
  });
  const projectGroupServiceMock = jasmine.createSpyObj('ProjectGroupService', {
    getProgrammeManagersGroupUUIDByItem: jasmine.createSpy('getProgrammeManagersGroupUUIDByItem'),
    getProgrammeProjectFundersGroupUUIDByItem: jasmine.createSpy('getProgrammeProjectFundersGroupUUIDByItem'),
    getProgrammeMembersGroupUUIDByItem: jasmine.createSpy('getProgrammeMembersGroupUUIDByItem')
  });

  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018',
    metadata: {
      'dc.title': [
        {
          language: null,
          value: 'test'
        }
      ],
      'dspace.entity.type': [
        {
          language: null,
          value: 'programme'
        }
      ]
    }
  });
  const mockItemRD = createSuccessfulRemoteDataObject(mockItem);
  const routeData = { programmeItem: mockItemRD };
  const mockRoute = new ActivatedRouteStub(null, routeData);

  const mockGroupManagers = Object.assign(new Group(), {
    name: 'programme_fake-id_managers_group',
    uuid: 'gruop1uuid',
  });
  const mockGroupFunders = Object.assign(new Group(), {
    name: 'programme_fake-id_funders_group',
    uuid: 'gruop2uuid',
  });
  const mockGroupMembers = Object.assign(new Group(), {
    name: 'programme_fake-id_members_group',
    uuid: 'gruop3uuid',
  });

  const mockGroupManagersRD = createSuccessfulRemoteDataObject$(mockGroupManagers);
  const mockGroupFundersRD = createSuccessfulRemoteDataObject$(mockGroupFunders);
  const mockGroupMembersRD = createSuccessfulRemoteDataObject$(mockGroupMembers);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgbNavModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [ProgrammeMembersPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: AuthorizationDataService, useValue: authorizationServiceMock },
        { provide: AuthService, useValue: authService },
        { provide: GroupDataService, useValue: groupServiceMock },
        { provide: ProjectGroupService, useValue: projectGroupServiceMock }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
      .compileComponents();
  });

  describe('when user is admin', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ProgrammeMembersPageComponent);
      component = fixture.componentInstance;
      authorizationServiceMock.isAuthorized.and.returnValue(of(true));
      projectGroupServiceMock.getProgrammeManagersGroupUUIDByItem.and.returnValue(of(['gruop1uuid']));
      projectGroupServiceMock.getProgrammeProjectFundersGroupUUIDByItem.and.returnValue(of(['gruop2uuid']));
      projectGroupServiceMock.getProgrammeMembersGroupUUIDByItem.and.returnValue(of(['gruop3uuid']));
      groupServiceMock.findById.and.returnValues(mockGroupManagersRD, mockGroupFundersRD, mockGroupMembersRD);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });


    it('should show all nav tabs', fakeAsync(() => {
      flush();
      const managersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="managers"]'));
      const fundersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="funders"]'));
      const membersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="members"]'));
      expect(managersTab).toBeTruthy();
      expect(fundersTab).toBeTruthy();
      expect(membersTab).toBeTruthy();
    }));
  });

  describe('when user is funder organizational', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ProgrammeMembersPageComponent);
      component = fixture.componentInstance;
      authorizationServiceMock.isAuthorized.and.returnValue(of(false));
      projectGroupServiceMock.getProgrammeManagersGroupUUIDByItem.and.returnValue(of(['gruop1uuid']));
      projectGroupServiceMock.getProgrammeProjectFundersGroupUUIDByItem.and.returnValue(of(['gruop2uuid']));
      projectGroupServiceMock.getProgrammeMembersGroupUUIDByItem.and.returnValue(of(['gruop3uuid']));
      groupServiceMock.findById.and.returnValues(mockGroupFundersRD, mockGroupMembersRD);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });


    it('should show only funders and members nav tabs', fakeAsync(() => {
      flush();
      const managersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="managers"]'));
      const fundersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="funders"]'));
      const membersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="members"]'));
      expect(managersTab).toBeFalsy();
      expect(fundersTab).toBeTruthy();
      expect(membersTab).toBeTruthy();
    }));
  });

});
