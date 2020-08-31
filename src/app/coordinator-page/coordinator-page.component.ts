import { Component, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProjectDataService } from '../core/project/project-data.service';
import { getFirstSucceededRemoteDataPayload } from '../core/shared/operators';
import { Community } from '../core/shared/community.model';
import { CreateProjectComponent } from '../projects/create-project/create-project.component';
import { FindListOptions } from '../core/data/request.models';
import { PageInfo } from '../core/shared/page-info.model';
import { PaginatedList } from '../core/data/paginated-list';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';

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
   * The list of available projects
   */
  projectList: BehaviorSubject<Community[]> = new BehaviorSubject<Community[]>([]);

  /**
   * The PageInfo object for the list of available projects
   */
  projectsPageInfo: BehaviorSubject<PageInfo> = new BehaviorSubject<PageInfo>(null);

  constructor(
    protected modalService: NgbModal,
    protected nameService: DSONameService,
    protected projectService: ProjectDataService) { }

  /**
   * Initialize the component, retrieving project list
   */
  ngOnInit() {
    this.retrieveProjectList();
  }

  /**
   * Open creation project modal
   */
  createProject() {
    this.modalService.open(CreateProjectComponent);
  }

  /**
   * Return name by given project
   *
   * @param project
   */
  getProjectName(project: Community): string {
    return this.nameService.getName(project);
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
    }
    this.projectService.findAllAuthorizedProjects(options).pipe(
      getFirstSucceededRemoteDataPayload()
    ).subscribe((list: PaginatedList<Community>) => {
      this.projectList.next(list.page);
      this.projectsPageInfo.next(list.pageInfo)
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
}
