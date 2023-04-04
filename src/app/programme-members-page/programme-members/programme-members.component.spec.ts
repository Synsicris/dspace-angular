import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { ProgrammeMembersComponent } from './programme-members.component';
import { AuthServiceMock } from '../../shared/mocks/auth.service.mock';
import { Item } from '../../core/shared/item.model';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { Group } from '../../core/eperson/models/group.model';
import { TranslateLoaderMock } from '../../shared/testing/translate-loader.mock';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { AuthService } from '../../core/auth/auth.service';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { ProjectGroupService } from '../../core/project/project-group.service';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';

fdescribe('ProgrammeMembersComponent', () => {
  let component: ProgrammeMembersComponent;
  let fixture: ComponentFixture<ProgrammeMembersComponent>;

  const authService = new AuthServiceMock();
  const authorizationServiceMock = jasmine.createSpyObj('AuthorizationDataService', {
    isAuthorized: jasmine.createSpy('isAuthorized')
  });
  const groupServiceMock = jasmine.createSpyObj('GroupDataService', {
    findById: jasmine.createSpy('findById'),
    editGroup: jasmine.createSpy('editGroup'),
    getActiveGroup: jasmine.createSpy('getActiveGroup')
  });
  const epersonServiceMock = jasmine.createSpyObj('EPersonDataService', {
    findById: jasmine.createSpy('findById')
  });
  const projectGroupServiceMock = jasmine.createSpyObj('ProjectGroupService', {
    getProgrammeManagersGroupUUIDByItem: jasmine.createSpy('getProgrammeManagersGroupUUIDByItem'),
    getProgrammeMembersGroupUUIDByItem: jasmine.createSpy('getProgrammeReadersGroupUUIDByItem'),
    getInvitationProgrammeFunderOrganizationalManagersGroupByItem: jasmine.createSpy('getInvitationProgrammeFunderOrganizationalManagersGroupByItem'),
    getInvitationProgrammeProjectFundersGroupByItem: jasmine.createSpy('getInvitationProgrammeProjectFundersGroupByItem'),
    getInvitationProgrammeReadersGroupByItem: jasmine.createSpy('getInvitationProgrammeReadersGroupByItem')
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
  const mockGroupMembers = Object.assign(new Group(), {
    name: 'programme_fake-id_members_group',
    uuid: 'gruop2uuid',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgbModalModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [ProgrammeMembersComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: AuthorizationDataService, useValue: authorizationServiceMock },
        { provide: AuthService, useValue: authService },
        { provide: GroupDataService, useValue: groupServiceMock },
        { provide: EPersonDataService, useValue: epersonServiceMock },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: ProjectGroupService, useValue: projectGroupServiceMock }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammeMembersComponent);
    component = fixture.componentInstance;
    component.relatedItem = mockItem;
  });

  describe('when is manager group', () => {

    beforeEach(() => {
      component.isFundersGroup = false;
      component.isManagersGroup = true;
      component.targetGroup = mockGroupManagers;
      groupServiceMock.getActiveGroup.and.returnValue(of(mockGroupManagers));
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
      expect(component.helpMessageLabel).toBe('programme.manage.members.managers-group-help');
    });
  });

  describe('when is funder group', () => {

    beforeEach(() => {
      component.isFundersGroup = true;
      component.isManagersGroup = false;
      component.targetGroup = mockGroupManagers;
      groupServiceMock.getActiveGroup.and.returnValue(of(mockGroupManagers));
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
      expect(component.helpMessageLabel).toBe('programme.manage.members.funders-group-help');
    });
  });

  describe('when is memeber group', () => {

    beforeEach(() => {
      component.isFundersGroup = false;
      component.targetGroup = mockGroupMembers;
      groupServiceMock.getActiveGroup.and.returnValue(of(mockGroupMembers));
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
      expect(component.helpMessageLabel).toBe('programme.manage.members.members-group-help');
    });
  });

});
