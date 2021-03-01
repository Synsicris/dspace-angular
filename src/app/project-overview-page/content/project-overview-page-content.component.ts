import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PaginatedList } from '../../core/data/paginated-list.model';
import { Community } from '../../core/shared/community.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { PageInfo } from '../../core/shared/page-info.model';
import { PROJECT_PAGE } from '../project-overview-page.component';
import { AuthService } from '../../core/auth/auth.service';
import { ProjectAuthorizationService } from '../../core/project/project-authorization.service';
import { ProjectDataService } from '../../core/project/project-data.service';
import { CreateProjectComponent } from '../../projects/create-project/create-project.component';

@Component({
  selector: 'ds-project-overview-page-content',
  templateUrl: './project-overview-page-content.component.html',
  styleUrls: ['./project-overview-page-content.component.scss']
})
export class ProjectOverviewPageContentComponent implements OnInit {

  /**
   * The project displayed on this page
   */
  @Input() project: Community;

  /**
   * The project displayed on this page
   */
  @Input() projectUUID: string;

  /**
   * A boolean representing if user can create a new sub-project
   */
  canCreateSubproject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The number of subprojects to show per page
   */
  elementsPerPage = 5;

  /**
   * A boolean representing if subproject list is loading
   */
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**
   * The list of user's sub-project belonging to the current project
   */
  subprojectList$: BehaviorSubject<Community[]> = new BehaviorSubject<Community[]>([]);

  /**
   * The PageInfo object for the list of user's sub-project
   */
  subprojectListPageInfo$: BehaviorSubject<PageInfo> = new BehaviorSubject<PageInfo>(null);

  constructor(
    protected authService: AuthService,
    protected modalService: NgbModal,
    protected nameService: DSONameService,
    protected projectAuthorizationService: ProjectAuthorizationService,
    protected projectService: ProjectDataService,
    protected route: ActivatedRoute,
    protected router: Router) {
  }

  ngOnInit(): void {
    this.retrieveSubprojectList();
    this.projectAuthorizationService.canCreateSubproject(this.projectUUID)
      .subscribe((canCreateProject: boolean) => {
        this.canCreateSubproject$.next(canCreateProject);
      });
  }

  /**
   * Check if user has permission to create a new project
   */
  canCreateSubproject(): Observable<boolean> {
    return this.canCreateSubproject$.asObservable();
  }

  /**
   * Return name by given subproject
   *
   * @param subproject
   */
  getSubprojectName(subproject: Community): string {
    return this.nameService.getName(subproject);
  }

  /**
   * Retrieve subproject paginated list
   *
   * @param page The current page of the paginated list to retrieve
   */
  retrieveSubprojectList(page: number = 0): void {
    const pageInfo = Object.assign(new PageInfo(), this.subprojectListPageInfo$.value, {
      currentPage: page,
      elementsPerPage: this.elementsPerPage
    });

    this.projectService.retrieveSubprojectsByParentProjectUUID(this.projectUUID, pageInfo)
      .subscribe((subprojects: PaginatedList<Community>) => {
      this.loading$.next(false);
      this.subprojectList$.next(subprojects.page);
      this.subprojectListPageInfo$.next(subprojects.pageInfo);
    });
  }

  /**
   * Navigate to sub-project page
   *
   * @param subproject
   */
  navigateToSubProject(subproject: Community) {
    const url = `${PROJECT_PAGE}/${this.projectUUID}/subproject/${subproject.id}`;
    this.router.navigateByUrl(url);
  }

  /**
   * Open creation sub-project modal
   */
  createSubproject() {
    const modalRef = this.modalService.open(CreateProjectComponent);
    modalRef.componentInstance.isSubproject = true;
    modalRef.componentInstance.parentProjectUUID = this.projectUUID;
  }
}
