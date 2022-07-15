import { Community } from './../../core/shared/community.model';
import { NotificationsServiceStub } from './../../shared/testing/notifications-service.stub';
import { TranslateLoaderMock } from './../../shared/testing/translate-loader.mock';
import { Group } from './../../core/eperson/models/group.model';
import { buildPaginatedList, PaginatedList } from './../../core/data/paginated-list.model';
import { RemoteData } from './../../core/data/remote-data';
import { GroupMock, GroupMock2 } from './../../shared/testing/group-mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMembersComponent } from './project-members.component';
import { Observable, of } from 'rxjs';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { PageInfo } from '../../core/shared/page-info.model';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { ProjectGroupService } from '../../core/project/project-group.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';

describe('ProjectMembersComponent', () => {
  let component: ProjectMembersComponent;
  let fixture: ComponentFixture<ProjectMembersComponent>;
  let groupsDataServiceStub: any;
  let mockGroups;
  let notificationService: NotificationsServiceStub;
  let spyGetGroups;
  let modalService;


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

  beforeEach(async () => {
    notificationService = new NotificationsServiceStub();
    mockGroups = [GroupMock, GroupMock2];
    groupsDataServiceStub = {
      allGroups: mockGroups,
      findAllByHref(href: string): Observable<RemoteData<PaginatedList<Group>>> {
        switch (href) {
          case 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid2/groups':
            return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo({
              elementsPerPage: 1,
              totalElements: 0,
              totalPages: 0,
              currentPage: 1
            }), []));
          case 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid/groups':
            return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo({
              elementsPerPage: 1,
              totalElements: 1,
              totalPages: 1,
              currentPage: 1
            }), [GroupMock2]));
          default:
            return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo({
              elementsPerPage: 1,
              totalElements: 0,
              totalPages: 0,
              currentPage: 1
            }), []));
        }
      },
      getGroupEditPageRouterLink(group: Group): string {
        return '/access-control/groups/' + group.id;
      },
      getGroupRegistryRouterLink(): string {
        return '/access-control/groups';
      },
      searchGroups(query: string): Observable<RemoteData<PaginatedList<Group>>> {
        if (query === '') {
          return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo({
            elementsPerPage: this.allGroups.length,
            totalElements: this.allGroups.length,
            totalPages: 1,
            currentPage: 1
          }), this.allGroups));
        }
        const result = this.allGroups.find((group: Group) => {
          return (group.id.includes(query));
        });
        return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo({
          elementsPerPage: [result].length,
          totalElements: [result].length,
          totalPages: 1,
          currentPage: 1
        }), [result]));
      },
      // tslint:disable-next-line:no-empty
      editGroup(): void { },
      getActiveGroup() {
        return of(GroupMock);
      },
      addMemberToGroup: jasmine.createSpy('addMemberToGroup'),
      deleteMemberFromGroup: jasmine.createSpy('deleteMemberFromGroup'),
    };
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
        { provide: GroupDataService, useValue: groupsDataServiceStub },
        { provide: ProjectGroupService, useValue: projectGroupService },
        { provide: NotificationsService, useValue: notificationService },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMembersComponent);
    component = fixture.componentInstance;
    component.targetGroup = GroupMock;
    component.relatedCommunity = mockCommunity;

    spyGetGroups = spyOn(component, 'getGroups');
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

  it('when addMemberToMultipleGroups is called should call getGroupsEntity and addMemberToGroup', () => {
    spyOn(component, 'getGroupsEntity').and.returnValue(of(mockGroups));
    groupsDataServiceStub.addMemberToGroup.and.returnValue({});
    component.addMemberToMultipleGroups({});
    fixture.detectChanges();
    expect(component.getGroupsEntity).toHaveBeenCalled();
    expect(groupsDataServiceStub.addMemberToGroup).toHaveBeenCalled();
  });


  it('when deleteMemberToMultipleGroups is called should call getGroupsEntity and deleteMemberFromGroup', () => {
    spyOn(component, 'getGroupsEntity').and.returnValue(of(mockGroups));
    groupsDataServiceStub.deleteMemberFromGroup.and.returnValue({});
    component.deleteMemberToMultipleGroups({});
    fixture.detectChanges();
    expect(component.getGroupsEntity).toHaveBeenCalled();
    expect(groupsDataServiceStub.deleteMemberFromGroup).toHaveBeenCalled();
  });



});
