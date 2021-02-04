import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PaginatedList } from '../../core/data/paginated-list.model';
import { Item } from '../../core/shared/item.model';
import { SearchService } from '../../core/shared/search/search.service';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { LinkService } from '../../core/cache/builders/link.service';
import { DsoRedirectDataService } from '../../core/data/dso-redirect-data.service';
import { IdentifierType } from '../../core/data/request.models';
import { CreateImpactPathwayComponent } from '../../impact-pathway-board/create-impact-pathway/create-impact-pathway.component';
import { Community } from '../../core/shared/community.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { ImpactPathwayService } from '../../core/impact-pathway/impact-pathway.service';
import { PageInfo } from '../../core/shared/page-info.model';
import { MYDSPACE_PAGE, MYDSPACE_ROUTE } from '../../+my-dspace-page/my-dspace-page.component';
import { PROJECT_PAGE, PROJECT_ROUTE } from '../project-overview-page.component';

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
   * The number of projects to show per page
   */
  elementsPerPage = 5;

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
  public mydspacePage = MYDSPACE_PAGE;

  /**
   * The mydspace page name.
   * @type {string}
   */
  public projectRoute = PROJECT_ROUTE;

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
    this.retrieveImpactPathwayList();
  }

  /**
   * Open creation ImpactPathway modal
   */
  createImpactPathway() {
    const modalRef = this.modalService.open(CreateImpactPathwayComponent);
    modalRef.componentInstance.projectId = this.projectUUID;
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
}
