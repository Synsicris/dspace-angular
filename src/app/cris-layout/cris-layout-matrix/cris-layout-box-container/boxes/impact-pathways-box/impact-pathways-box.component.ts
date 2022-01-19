import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { CrisLayoutBox } from '../../../../../core/layout/models/box.model';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { PageInfo } from '../../../../../core/shared/page-info.model';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';
import { Item } from '../../../../../core/shared/item.model';
import { ImpactPathwayService } from '../../../../../impact-pathway-board/core/impact-pathway.service';
import { ProjectDataService } from '../../../../../core/project/project-data.service';
import { Community } from '../../../../../core/shared/community.model';
import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { getFirstSucceededRemoteDataPayload } from '../../../../../core/shared/operators';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { CreateImpactPathwayComponent } from '../../../../../impact-pathway-board/create-impact-pathway/create-impact-pathway.component';
import { PROJECT_PAGE } from '../../../../../project-overview-page/project-overview-page.component';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';

@Component({
  selector: 'ds-impact-pathways-box',
  templateUrl: './impact-pathways-box.component.html',
  styleUrls: ['./impact-pathways-box.component.scss']
})
@RenderCrisLayoutBoxFor(LayoutBox.IMPACTPATHWAYS)
export class ImpactPathwaysBoxComponent extends CrisLayoutBoxModelComponent implements OnInit {

  /**
   * The number of impact pathway to show per page
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
   * A boolean representing if subproject list is loading
   */
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**
   * The project community which the impact-pathways belong to
   */
  projectCommunityUUID: string;

  constructor(
    protected impactPathwayService: ImpactPathwayService,
    protected modalService: NgbModal,
    protected nameService: DSONameService,
    protected projectService: ProjectDataService,
    protected router: Router,
    protected translateService: TranslateService,
    @Inject('boxProvider') public boxProvider: CrisLayoutBox,
    @Inject('itemProvider') public itemProvider: Item
  ) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.projectService.getProjectCommunityByItemId(this.item.uuid).pipe(
      getFirstSucceededRemoteDataPayload()
    ).subscribe((projectCommunity: Community) => {
      this.projectCommunityUUID = projectCommunity.uuid;
      this.retrieveImpactPathwayList(0);
    });

  }

  /**
   * Open creation ImpactPathway modal
   */
  createImpactPathway() {
    const modalRef = this.modalService.open(CreateImpactPathwayComponent);
    modalRef.componentInstance.projectId = this.projectCommunityUUID;
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
    this.loading$.next(true);
    const pageInfo = Object.assign(new PageInfo(), this.impactPathwayListPageInfo, {
      currentPage: page,
      elementsPerPage: this.elementsPerPage
    });
    this.impactPathwayService.retrieveImpactPathwaysByProject(this.projectCommunityUUID, pageInfo)
      .subscribe((list: PaginatedList<Item>) => {
        this.impactPathwayList.next(list.page);
        this.impactPathwayListPageInfo.next(list.pageInfo);
        this.loading$.next(false);
      });
  }

  /**
   * Retrieve previous page of the ImpactPathway paginated list
   */
  retrievePrevPage() {
    this.retrieveImpactPathwayList(this.impactPathwayListPageInfo.value.currentPage - 1);
  }

  /**
   * Retrieve next page of the ImpactPathway paginated list
   */
  retrieveNextPage() {
    this.retrieveImpactPathwayList(this.impactPathwayListPageInfo.value.currentPage + 1);
  }

  /**
   * Navigate to impact pathway edit page
   *
   * @param impactPathway
   */
  navigateToImpactPathway(impactPathway: Item): void {
    const url = `${PROJECT_PAGE}/${this.projectCommunityUUID}/impactpathway/${impactPathway.id}/edit`;
    this.router.navigateByUrl(url);
  }

}
