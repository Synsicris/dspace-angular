import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProjectDataService } from '../core/project/project-data.service';
import { getFirstSucceededRemoteDataPayload } from '../core/shared/operators';
import { Community } from '../core/shared/community.model';
import { CreateProjectComponent } from '../projects/create-project/create-project.component';
import { FindListOptions } from '../core/data/request.models';
import { PageInfo } from '../core/shared/page-info.model';
import { PaginatedList } from '../core/data/paginated-list.model';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { ProjectAuthorizationService } from '../core/project/project-authorization.service';
import { hasValue } from '../shared/empty.util';
import { getItemPageRoute } from '../item-page/item-page-routing-paths';
import { Item } from '../core/shared/item.model';

@Component({
  selector: 'ds-coordinator-page',
  templateUrl: './coordinator-page.component.html',
  styleUrls: ['./coordinator-page.component.scss']
})
export class CoordinatorPageComponent implements OnInit {

  /**
   * The number of projects to show per page
   */
  elementsPerPage = 5;

  /**
   * A boolean representing if user can create a new project
   */
  canCreateProject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The list of available projects
   */
  projectList: BehaviorSubject<Community[]> = new BehaviorSubject<Community[]>([]);

  /**
   * The PageInfo object for the list of available projects
   */
  projectsPageInfo: BehaviorSubject<PageInfo> = new BehaviorSubject<PageInfo>(null);

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  private subs: Subscription[] = [];

  constructor(
    protected modalService: NgbModal,
    protected nameService: DSONameService,
    protected projectAuthorizationService: ProjectAuthorizationService,
    protected projectService: ProjectDataService) { }

  /**
   * Initialize the component, retrieving project list
   */
  ngOnInit() {
    this.retrieveProjectList();
    this.subs.push(
      this.projectAuthorizationService.canCreateProject().pipe(
        take(1)
      ).subscribe((canCreateProject: boolean) => {
        this.canCreateProject$.next(canCreateProject);
      })
    );
  }

  /**
   * Check if user has permission to create a new project
   */
  canCreateProject(): Observable<boolean> {
    return this.canCreateProject$.asObservable();
  }

  /**
   * Open creation project modal
   */
  createProject() {
    this.modalService.open(CreateProjectComponent);
  }

  /**
   * Return name by given project community id
   * @param projectCommunityId
   */
  getProjectName(projectCommunityId: string): Observable<string> {
    return this.projectService.getProjectItemByProjectCommunityId(projectCommunityId).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((item: Item) => this.nameService.getName(item))
    );
  }

  /**
   * Get link to the item project page by given project community id
   * @param projectCommunityId
   */
  getProjectItemPath(projectCommunityId: string): Observable<string> {
    return this.projectService.getProjectItemByProjectCommunityId(projectCommunityId).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((item: Item) => getItemPageRoute(item))
    );
  }

  /**
   * Retrieve project paginated list
   *
   * @param page The current page of the paginated list to retrieve
   */
  retrieveProjectList(page: number = 0): void {
    const options: FindListOptions = {
      elementsPerPage: this.elementsPerPage,
      currentPage: page
    };
    this.projectService.findAllAuthorizedProjects(options).pipe(
      getFirstSucceededRemoteDataPayload()
    ).subscribe((list: PaginatedList<Community>) => {
      this.projectList.next(list.page);
      this.projectsPageInfo.next(list.pageInfo);
    });
  }

  /**
   * Retrieve previous page of the project paginated list
   */
  retrievePrevProjectList() {
    this.retrieveProjectList(this.projectsPageInfo.value.currentPage - 1);
  }

  /**
   * Retrieve next page of the project paginated list
   */
  retrieveNextProjectList() {
    this.retrieveProjectList(this.projectsPageInfo.value.currentPage + 1);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }
}
