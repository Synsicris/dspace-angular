import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { of } from 'rxjs';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ProjectMembersPageComponent } from './project-members-page.component';
import { ActivatedRouteStub } from '../shared/testing/active-router.stub';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { Item } from '../core/shared/item.model';
import { GroupDataService } from '../core/eperson/group-data.service';
import { AuthService } from '../core/auth/auth.service';
import { AuthServiceMock } from '../shared/mocks/auth.service.mock';
import { ProjectGroupService } from '../core/project/project-group.service';
import { Group } from '../core/eperson/models/group.model';
import { TranslateLoaderMock } from '../shared/testing/translate-loader.mock';
import { Community } from '../core/shared/community.model';
import { ProjectAuthorizationService } from '../core/project/project-authorization.service';

describe('ProjectMembersPageComponent', () => {
  let component: ProjectMembersPageComponent;
  let fixture: ComponentFixture<ProjectMembersPageComponent>;

  const authService = new AuthServiceMock();
  const projectAuthServiceMock = jasmine.createSpyObj('ProjectAuthorizationService', {
    isAdmin: jasmine.createSpy('isAdmin'),
    isFunderOrganizationalManager: jasmine.createSpy('isFunderOrganizationalManager'),
    isFunderProjectManager: jasmine.createSpy('isFunderProjectManager')
  });
  const groupServiceMock = jasmine.createSpyObj('GroupDataService', {
    findById: jasmine.createSpy('findById'),
    cancelEditGroup: jasmine.createSpy('cancelEditGroup')
  });
  const projectGroupServiceMock = jasmine.createSpyObj('ProjectGroupService', {
    getProjectFundersGroupUUIDByCommunity: jasmine.createSpy('getProjectFundersGroupUUIDByCommunity'),
    getProjectCoordinatorsGroupUUIDByCommunity: jasmine.createSpy('getProjectCoordinatorsGroupUUIDByCommunity'),
    getInvitationFundingCoordinatorsAndMembersGroupsByCommunity: jasmine.createSpy('getInvitationFundingCoordinatorsAndMembersGroupsByCommunity'),
    getInvitationFundingMembersGroupsByCommunity: jasmine.createSpy('getInvitationFundingMembersGroupsByCommunity'),
    getInvitationProjectMembersGroupsByCommunity: jasmine.createSpy('getInvitationProjectMembersGroupsByCommunity')
  });

  const mockProjectItem = Object.assign(new Item(), {
    id: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018',
    entityType: 'Project',
    metadata: {
      'dc.title': [
        {
          language: null,
          value: 'test project'
        }
      ],
      'dspace.entity.type': [
        {
          language: null,
          value: 'Project'
        }
      ]
    }
  });

  const mockFundingItem = Object.assign(new Item(), {
    id: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018',
    entityType: 'Funding',
    metadata: {
      'dc.title': [
        {
          language: null,
          value: 'test project'
        }
      ],
      'dspace.entity.type': [
        {
          language: null,
          value: 'Funding'
        }
      ]
    }
  });
  const mockCommunity = Object.assign(new Community(), {
    id: 'fake-id',
    metadata: {
      'dc.title': [
        {
          language: null,
          value: 'test project'
        }
      ]
    }
  });
  const mockProjectRD = createSuccessfulRemoteDataObject(mockProjectItem);
  const mockFundingRD = createSuccessfulRemoteDataObject(mockFundingItem);
  const mockCommunityRD = createSuccessfulRemoteDataObject(mockCommunity);
  const routeData = {
    projectItem: mockProjectRD,
    projectCommunity: mockCommunityRD
  };
  const routeFundingData = {
    projectItem: mockFundingRD,
    projectCommunity: mockCommunityRD
  };
  const mockRoute = new ActivatedRouteStub(null, routeData);

  const mockGroupFunders = Object.assign(new Group(), {
    name: 'project_fake-id_funders_group',
    uuid: 'gruop1uuid',
  });
  const mockGroupCoordinators = Object.assign(new Group(), {
    name: 'project_fake-id_coordinators_group',
    uuid: 'gruop2uuid',
  });
  const mockGroupMembers = Object.assign(new Group(), {
    name: 'project_fake-id_members_group',
    uuid: 'gruop3uuid',
  });

  const mockGroupFundersRD$ = createSuccessfulRemoteDataObject$(mockGroupFunders);
  const mockGroupCoordinatorsRD$ = createSuccessfulRemoteDataObject$(mockGroupCoordinators);
  const mockGroupMembersRD$ = createSuccessfulRemoteDataObject$(mockGroupMembers);

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
      declarations: [ProjectMembersPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: ProjectAuthorizationService, useValue: projectAuthServiceMock },
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

  describe('when item is a Project', () => {

    beforeEach(() => {
      mockRoute.testData = routeData;
      fixture = TestBed.createComponent(ProjectMembersPageComponent);
      component = fixture.componentInstance;
    });

    describe('and user is admin', () => {

      beforeEach(() => {
        projectAuthServiceMock.isAdmin.and.returnValue(of(true));
        projectAuthServiceMock.isFunderOrganizationalManager.and.returnValue(of(false));
        projectGroupServiceMock.getProjectFundersGroupUUIDByCommunity.and.returnValue(of(['gruop1uuid']));
        projectGroupServiceMock.getProjectCoordinatorsGroupUUIDByCommunity.and.returnValue(of(['gruop2uuid']));
        projectGroupServiceMock.getInvitationProjectMembersGroupsByCommunity.and.returnValue(of(['gruop3uuid']));
        groupServiceMock.findById.and.returnValues(mockGroupFundersRD$, mockGroupCoordinatorsRD$, mockGroupMembersRD$);
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });


      it('should show funders and members nav tabs', fakeAsync(() => {
        flush();
        const fundersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="funders"]'));
        const coordinatorsTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="coordinators"]'));
        const membersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="members"]'));
        expect(fundersTab).toBeTruthy();
        expect(coordinatorsTab).toBeTruthy();
        expect(membersTab).toBeFalsy();
      }));

    });


    describe('and user is Funder Organizational Manager', () => {

      beforeEach(() => {
        projectAuthServiceMock.isAdmin.and.returnValue(of(false));
        projectAuthServiceMock.isFunderOrganizationalManager.and.returnValue(of(true));
        projectGroupServiceMock.getProjectFundersGroupUUIDByCommunity.and.returnValue(of(['gruop1uuid']));
        projectGroupServiceMock.getProjectCoordinatorsGroupUUIDByCommunity.and.returnValue(of(['gruop2uuid']));
        projectGroupServiceMock.getInvitationProjectMembersGroupsByCommunity.and.returnValue(of(['gruop3uuid']));
        groupServiceMock.findById.and.returnValues(mockGroupFundersRD$, mockGroupCoordinatorsRD$, mockGroupMembersRD$);
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });


      it('should show funders and members nav tabs', fakeAsync(() => {
        flush();
        const fundersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="funders"]'));
        const coordinatorsTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="coordinators"]'));
        const membersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="members"]'));
        expect(fundersTab).toBeTruthy();
        expect(coordinatorsTab).toBeTruthy();
        expect(membersTab).toBeFalsy();
      }));

    });

    describe('and user is coordinator', () => {

      beforeEach(() => {
        projectAuthServiceMock.isAdmin.and.returnValue(of(false));
        projectAuthServiceMock.isFunderOrganizationalManager.and.returnValue(of(false));
        projectGroupServiceMock.getProjectFundersGroupUUIDByCommunity.and.returnValue(of(['gruop1uuid']));
        projectGroupServiceMock.getProjectCoordinatorsGroupUUIDByCommunity.and.returnValue(of(['gruop2uuid']));
        projectGroupServiceMock.getInvitationProjectMembersGroupsByCommunity.and.returnValue(of(['gruop3uuid']));
        groupServiceMock.findById.and.returnValues(mockGroupFundersRD$, mockGroupCoordinatorsRD$, mockGroupMembersRD$);
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });


      it('should show funders and members nav tabs', fakeAsync(() => {
        flush();
        const fundersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="funders"]'));
        const coordinatorsTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="coordinators"]'));
        const membersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="members"]'));
        expect(fundersTab).toBeFalsy();
        expect(coordinatorsTab).toBeTruthy();
        expect(membersTab).toBeFalsy();
      }));

    });
  });

  describe('when item is a Funding', () => {

    beforeEach(() => {
      mockRoute.testData = routeFundingData;
      fixture = TestBed.createComponent(ProjectMembersPageComponent);
      component = fixture.componentInstance;
    });

    describe('and user is admin', () => {

      beforeEach(() => {
        projectAuthServiceMock.isAdmin.and.returnValue(of(true));
        projectAuthServiceMock.isFunderOrganizationalManager.and.returnValue(of(false));
        projectGroupServiceMock.getProjectFundersGroupUUIDByCommunity.and.returnValue(of(['gruop1uuid']));
        projectGroupServiceMock.getInvitationFundingCoordinatorsAndMembersGroupsByCommunity.and.returnValue(of(['gruop2uuid']));
        projectGroupServiceMock.getInvitationFundingMembersGroupsByCommunity.and.returnValue(of(['gruop3uuid']));
        groupServiceMock.findById.and.returnValues(mockGroupCoordinatorsRD$, mockGroupMembersRD$);
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });


      it('should show funders and members nav tabs', fakeAsync(() => {
        flush();
        const fundersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="funders"]'));
        const coordinatorsTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="coordinators"]'));
        const membersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="members"]'));
        expect(fundersTab).toBeFalsy();
        expect(coordinatorsTab).toBeTruthy();
        expect(membersTab).toBeTruthy();
      }));

    });


    describe('and user is Funder Organizational Manager', () => {

      beforeEach(() => {
        projectAuthServiceMock.isAdmin.and.returnValue(of(false));
        projectAuthServiceMock.isFunderOrganizationalManager.and.returnValue(of(true));
        projectGroupServiceMock.getProjectFundersGroupUUIDByCommunity.and.returnValue(of(['gruop1uuid']));
        projectGroupServiceMock.getInvitationFundingCoordinatorsAndMembersGroupsByCommunity.and.returnValue(of(['gruop2uuid']));
        projectGroupServiceMock.getInvitationFundingMembersGroupsByCommunity.and.returnValue(of(['gruop3uuid']));
        groupServiceMock.findById.and.returnValues(mockGroupCoordinatorsRD$, mockGroupMembersRD$);
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });


      it('should show funders and members nav tabs', fakeAsync(() => {
        flush();
        const fundersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="funders"]'));
        const coordinatorsTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="coordinators"]'));
        const membersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="members"]'));
        expect(fundersTab).toBeFalsy();
        expect(coordinatorsTab).toBeTruthy();
        expect(membersTab).toBeTruthy();
      }));

    });

    describe('and user is coordinator', () => {

      beforeEach(() => {
        projectAuthServiceMock.isAdmin.and.returnValue(of(false));
        projectAuthServiceMock.isFunderOrganizationalManager.and.returnValue(of(false));
        projectGroupServiceMock.getProjectFundersGroupUUIDByCommunity.and.returnValue(of(['gruop1uuid']));
        projectGroupServiceMock.getInvitationFundingCoordinatorsAndMembersGroupsByCommunity.and.returnValue(of(['gruop2uuid']));
        projectGroupServiceMock.getInvitationFundingMembersGroupsByCommunity.and.returnValue(of(['gruop3uuid']));
        groupServiceMock.findById.and.returnValues(mockGroupCoordinatorsRD$, mockGroupMembersRD$);
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });


      it('should show funders and members nav tabs', fakeAsync(() => {
        flush();
        const fundersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="funders"]'));
        const coordinatorsTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="coordinators"]'));
        const membersTab: DebugElement = fixture.debugElement.query(By.css('a[data-test="members"]'));
        expect(fundersTab).toBeFalsy();
        expect(coordinatorsTab).toBeTruthy();
        expect(membersTab).toBeTruthy();
      }));

    });
  });

});
