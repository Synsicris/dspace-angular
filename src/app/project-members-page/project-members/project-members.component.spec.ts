import { Group } from './../../core/eperson/models/group.model';
import { buildPaginatedList, PaginatedList } from './../../core/data/paginated-list.model';
import { RemoteData } from './../../core/data/remote-data';
import { GroupMock, GroupMock2 } from './../../shared/testing/group-mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMembersComponent } from './project-members.component';
import { Observable } from 'rxjs';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { PageInfo } from '../../core/shared/page-info.model';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { ProjectGroupService } from '../../core/project/project-group.service';

describe('ProjectMembersComponent', () => {
  let component: ProjectMembersComponent;
  let fixture: ComponentFixture<ProjectMembersComponent>;
  let groupsDataServiceStub: any;
  let mockGroups;

  const projectGroupService = jasmine.createSpyObj('ProjectGroupService', {
    getInvitationProjectAllGroupsByCommunity: jasmine.createSpy('getInvitationProjectAllGroupsByCommunity'),
    getInvitationProjectMembersGroupsByCommunity: jasmine.createSpy('getInvitationProjectMembersGroupsByCommunity'),
    getInvitationSubprojectAdminsGroupsByCommunity: jasmine.createSpy('getInvitationSubprojectAdminsGroupsByCommunity'),
    getInvitationSubprojectMembersGroupsByCommunity: jasmine.createSpy('getInvitationSubprojectMembersGroupsByCommunity'),
  });


  beforeEach(async () => {
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
      }
    };
    await TestBed.configureTestingModule({
      declarations: [ProjectMembersComponent],
      providers: [
        { provide: GroupDataService, useValue: groupsDataServiceStub },
        { provide: ProjectGroupService, useValue: projectGroupService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
