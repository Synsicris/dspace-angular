import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PaginatedList } from '../../core/data/paginated-list.model';
import { Item } from '../../core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { LinkService } from '../../core/cache/builders/link.service';
import { DsoRedirectDataService } from '../../core/data/dso-redirect-data.service';
import { IdentifierType } from '../../core/data/request.models';
import { Community } from '../../core/shared/community.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { ImpactPathwayService } from '../../impact-pathway-board/core/impact-pathway.service';
import { PageInfo } from '../../core/shared/page-info.model';
import { MYDSPACE_PAGE, MYDSPACE_ROUTE } from '../../+my-dspace-page/my-dspace-page.component';
import { PROJECT_PAGE, PROJECT_ROUTE } from '../project-overview-page.component';
import { AuthService } from '../../core/auth/auth.service';
import { ProjectAuthorizationService } from '../../core/project/project-authorization.service';
import { ProjectDataService } from '../../core/project/project-data.service';
import { CreateProjectComponent } from '../../projects/create-project/create-project.component';
import { CreateImpactPathwayComponent } from '../../impact-pathway-board/create-impact-pathway/create-impact-pathway.component';

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
   * The list of available projects
   */
  impactPathwayList: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

  /**
   * The PageInfo object for the list of available projects
   */
  impactPathwayListPageInfo: BehaviorSubject<PageInfo> = new BehaviorSubject<PageInfo>(null);

  /**
   * The mydspace page name.
   * @type {string}
   */
  mydspacePage = MYDSPACE_PAGE;

  /**
   * The mydspace page name.
   * @type {string}
   */
  projectRoute = PROJECT_ROUTE;

  /**
   * The list of user's sub-project belonging to the current project
   */
  subprojectList$: BehaviorSubject<Community[]> = new BehaviorSubject<Community[]>([]);

  /**
   * The PageInfo object for the list of user's sub-project
   */
  subprojectListPageInfo$: BehaviorSubject<PageInfo> = new BehaviorSubject<PageInfo>(null);

  constructor(
    protected dsoService: DsoRedirectDataService,
    protected impactPathwayService: ImpactPathwayService,
    protected linkService: LinkService,
    protected authService: AuthService,
    protected modalService: NgbModal,
    protected nameService: DSONameService,
    protected projectAuthorizationService: ProjectAuthorizationService,
    protected projectService: ProjectDataService,
    protected route: ActivatedRoute,
    protected router: Router) {
  }

  ngOnInit(): void {
    this.retrieveImpactPathwayList();
    this.retrieveSubprojectList();
    this.projectAuthorizationService.canCreateSubproject(this.projectUUID)
      .subscribe((canCreateProject: boolean) => {
        this.canCreateSubproject$.next(canCreateProject);
      });
  }

  /**
   * Open creation ImpactPathway modal
   */
  createImpactPathway() {
    const modalRef = this.modalService.open(CreateImpactPathwayComponent);
    modalRef.componentInstance.projectId = this.projectUUID;
  }

  /**
   * Check if user has permission to create a new project
   */
  canCreateSubproject(): Observable<boolean> {
    return this.canCreateSubproject$.asObservable();
  }

  /**
   * Return name by given ImpactPathway
   *
   * @param impactPathway
   */
  getImpactPathwayName(impactPathway: Item): string {
    return this.nameService.getName(impactPathway);
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
   * Retrieve ImpactPathway paginated list
   *
   * @param page The current page of the paginated list to retrieve
   */
  retrieveImpactPathwayList(page: number = 0): void {
    const pageInfo = Object.assign(new PageInfo(), this.impactPathwayListPageInfo, {
      currentPage: page,
      elementsPerPage: this.elementsPerPage
    });
    this.impactPathwayService.retrieveImpactPathwaysByProject(this.projectUUID, pageInfo)
      .subscribe((list: PaginatedList<Item>) => {
        this.impactPathwayList.next(list.page);
        this.impactPathwayListPageInfo.next(list.pageInfo);
      });
  }

  /**
   * Retrieve previous page of the ImpactPathway paginated list
   */
  retrievePrevProjectList() {
    this.retrieveImpactPathwayList(this.impactPathwayListPageInfo.value.currentPage - 1);
  }

  /**
   * Retrieve next page of the ImpactPathway paginated list
   */
  retrieveNextProjectList() {
    this.retrieveImpactPathwayList(this.impactPathwayListPageInfo.value.currentPage + 1);
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
   * Navigate to impact pathway edit page
   *
   * @param impactPathway
   */
  navigateToImpactPathway(impactPathway: Item): void {
    const url = `${PROJECT_PAGE}/${this.projectUUID}/impactpathway/${impactPathway.id}/edit`;
    this.router.navigateByUrl(url);

  }

  navigateToMydspaceByScope(handle: string): void {
    this.dsoService.findByIdAndIDType(handle, IdentifierType.HANDLE).pipe(
      getFirstSucceededRemoteDataPayload(),
      take(1))
      .subscribe((dso) => {
        const url = `${MYDSPACE_ROUTE}?configuration=workspace&scope=${(dso as any).uuid}`;
        this.router.navigateByUrl(url);
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
