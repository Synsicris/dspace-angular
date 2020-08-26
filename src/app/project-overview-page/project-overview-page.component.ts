import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { flatMap, map, take, tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { SearchService } from '../core/shared/search/search.service';
import { getFirstSucceededRemoteDataPayload, redirectToPageNotFoundOn404 } from '../core/shared/operators';
import { LinkService } from '../core/cache/builders/link.service';
import { DsoRedirectDataService } from '../core/data/dso-redirect-data.service';
import { IdentifierType } from '../core/data/request.models';
import { CreateImpactPathwayComponent } from '../impact-pathway-board/create-impact-pathway/create-impact-pathway.component';
import { Community } from '../core/shared/community.model';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { ImpactPathwayService } from '../core/impact-pathway/impact-pathway.service';
import { PageInfo } from '../core/shared/page-info.model';

@Component({
  selector: 'ds-project-overview-page',
  templateUrl: './project-overview-page.component.html',
  styleUrls: ['./project-overview-page.component.scss']
})
export class ProjectOverviewPageComponent implements OnInit {

  /**
   * The number of projects to show per page
   */
  elementsPerPage = 5;

  /**
   * The project displayed on this page
   */
  projectRD$: Observable<RemoteData<Community>>;

  /**
   * The project displayed on this page
   */
  projectUUID$: Observable<string>;

  /**
   * The list of available projects
   */
  impactPathwayList: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

  /**
   * The PageInfo object for the list of available projects
   */
  impactPathwayListPageInfo: BehaviorSubject<PageInfo> = new BehaviorSubject<PageInfo>(null);

  constructor(
    protected dsoService: DsoRedirectDataService,
    protected impactPathwayService: ImpactPathwayService,
    protected linkService: LinkService,
    protected modalService: NgbModal,
    protected nameService: DSONameService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected searchService: SearchService) {
  }

  ngOnInit(): void {
    this.projectRD$ = this.route.data.pipe(
      map((data) => data.project as RemoteData<Community>),
      tap((p) => console.log(p)),
      redirectToPageNotFoundOn404(this.router)
    );

    this.projectUUID$ = this.projectRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((project: Community) => project.id)
    );

    this.retrieveImpactPathwayList();
  }

  /**
   * Open creation ImpactPathway modal
   */
  createImpactPathway() {
    return this.projectUUID$.subscribe((projectId) => {
      const modalRef = this.modalService.open(CreateImpactPathwayComponent);
      modalRef.componentInstance.projectId = projectId;
    })
  }

  /**
   * Return project name
   */
  getProjectName(): Observable<string> {
    return this.projectRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((project: Community) => this.nameService.getName(project))
    )
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
   * Retrieve ImpactPathway paginated list
   *
   * @param page The current page of the paginated list to retrieve
   */
  retrieveImpactPathwayList(page: number = 0): void {
    const pageInfo = Object.assign(new PageInfo(), this.impactPathwayListPageInfo, {
      currentPage: page,
      elementsPerPage: this.elementsPerPage
    });
    this.projectRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((project: Community) => project.id),
      flatMap((projectId) => this.impactPathwayService.retrieveImpactPathwaysByProject(projectId, pageInfo)),
    ).subscribe((list: PaginatedList<Item>) => {
      this.impactPathwayList.next(list.page);
      this.impactPathwayListPageInfo.next(list.pageInfo)
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
   * Navigate to impact pathway edit page
   *
   * @param impactPathway
   */
  navigateToImpactPathway(impactPathway: Item): void {
    this.projectUUID$
      .subscribe((projectUUID) => {
        const url = `project-overview/${projectUUID}/impactpathway/${impactPathway.id}/edit`;
        this.router.navigateByUrl(url)
      });

  }

  navigateToMydspaceByScope(handle: string): void {
    this.dsoService.findByIdAndIDType(handle, IdentifierType.HANDLE).pipe(
      getFirstSucceededRemoteDataPayload(),
      take(1))
      .subscribe((dso) => {
        const url = `/mydspace?configuration=workspace&scope=${(dso as any).uuid}`
        this.router.navigateByUrl(url)
      });
  }
}
