import { Community } from '../../core/shared/community.model';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { TranslateLoaderMock } from '../../shared/testing/translate-loader.mock';
import { GroupMock, GroupMock2 } from '../../shared/testing/group-mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMembersComponent } from './project-members.component';
import { of } from 'rxjs';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { createNoContentRemoteDataObject$, createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { ProjectGroupService } from '../../core/project/project-group.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { getTestScheduler } from 'jasmine-marbles';

describe('ProjectMembersComponent', () => {
  let component: ProjectMembersComponent;
  let fixture: ComponentFixture<ProjectMembersComponent>;
  let mockGroups;
  let notificationService: NotificationsServiceStub = new NotificationsServiceStub();
  let spyGetGroups;
  let modalService;
  let scheduler;


  const projectGroupService = jasmine.createSpyObj('ProjectGroupService', {
    getInvitationProjectAllGroupsByCommunity: jasmine.createSpy('getInvitationProjectAllGroupsByCommunity'),
    getInvitationProjectMembersGroupsByCommunity: jasmine.createSpy('getInvitationProjectMembersGroupsByCommunity'),
    getInvitationSubprojectAdminsGroupsByCommunity: jasmine.createSpy('getInvitationSubprojectAdminsGroupsByCommunity'),
    getInvitationSubprojectMembersGroupsByCommunity: jasmine.createSpy('getInvitationSubprojectMembersGroupsByCommunity'),
  });

  const mockCommunity = Object.assign(new Community(), {
    id: 'test-uuid',
    metadata: [
      {
        key: 'dc.title',
        value: 'test community'
      }
    ]
  });

  const mockEpersonDataService = jasmine.createSpyObj('EPersonDataService', {
    clearLinkRequests: jasmine.createSpy('clearLinkRequests')
  });

  const mockGroupDataService = jasmine.createSpyObj('GroupDataService', {
    addMemberToGroup: jasmine.createSpy('addMemberToGroup'),
    deleteMemberFromGroup: jasmine.createSpy('deleteMemberFromGroup'),
    cancelEditGroup: jasmine.createSpy('cancelEditGroup'),
    editGroup: jasmine.createSpy('editGroup'),
    findById: jasmine.createSpy('findById'),
    getActiveGroup: jasmine.createSpy('getActiveGroup')
  });

  const mockEperson: EPerson = new EPerson();

  beforeEach(async () => {
    notificationService = new NotificationsServiceStub();
    mockGroups = [GroupMock, GroupMock2];

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [ProjectMembersComponent],
      providers: [
        { provide: GroupDataService, useValue: mockGroupDataService },
        { provide: ProjectGroupService, useValue: projectGroupService },
        { provide: NotificationsService, useValue: notificationService },
        { provide: EPersonDataService, useValue: mockEpersonDataService },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(ProjectMembersComponent);
    component = fixture.componentInstance;
    component.targetGroup = GroupMock;
    component.relatedCommunity = mockCommunity;
    mockGroupDataService.getActiveGroup.and.returnValue(of(GroupMock));

    spyGetGroups = spyOn((component as any), 'getGroups');
    spyGetGroups.and.returnValue(of([GroupMock.id, GroupMock2.id]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('when sendInvitation is called should call getGroups and modal open', () => {
    modalService = (component as any).modalService;
    spyOn(modalService, 'open').and.returnValue(Object.assign({ componentInstance: Object.assign({ response: of(true) }) }));
    component.sendInvitation('test@test.com');
    fixture.detectChanges();
    expect(spyGetGroups).toHaveBeenCalled();
    expect(modalService.open).toHaveBeenCalled();
  });

  it('when addMemberToMultipleGroups is called should call getGroupEntity and addMemberToGroup', () => {
    spyOn((component as any), 'getGroupEntity').and.returnValues(
      createSuccessfulRemoteDataObject$(mockGroups[0]), createSuccessfulRemoteDataObject$(mockGroups[1]));
    spyOn((component as any), 'refreshGroupsMembers');
    mockGroupDataService.addMemberToGroup.and.returnValues(createNoContentRemoteDataObject$(), createNoContentRemoteDataObject$());
    scheduler.schedule(() => component.addMemberToMultipleGroups(mockEperson));
    scheduler.flush();

    expect((component as any).getGroupEntity).toHaveBeenCalledTimes(2);
    expect(mockGroupDataService.addMemberToGroup).toHaveBeenCalledTimes(2);
    expect((component as any).refreshGroupsMembers).toHaveBeenCalled();
    expect(notificationService.success).toHaveBeenCalled();
  });


  it('when deleteMemberToMultipleGroups is called should call getGroupEntity and deleteMemberFromGroup', () => {
    spyOn((component as any), 'getGroupEntity').and.returnValues(
      createSuccessfulRemoteDataObject$(mockGroups[0]), createSuccessfulRemoteDataObject$(mockGroups[1]));
    spyOn((component as any), 'refreshGroupsMembers');
    mockGroupDataService.deleteMemberFromGroup.and.returnValues(createNoContentRemoteDataObject$(), createNoContentRemoteDataObject$());
    scheduler.schedule(() => component.deleteMemberToMultipleGroups(mockEperson));
    scheduler.flush();

    expect((component as any).getGroupEntity).toHaveBeenCalledTimes(2);
    expect(mockGroupDataService.deleteMemberFromGroup).toHaveBeenCalledTimes(2);
    expect((component as any).refreshGroupsMembers).toHaveBeenCalled();
    expect(notificationService.success).toHaveBeenCalled();
  });



});
