import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from '../../core/shared/search/search.service';
import { LinkService } from '../../core/cache/builders/link.service';
import { DsoRedirectDataService } from '../../core/data/dso-redirect-data.service';
import { Community } from '../../core/shared/community.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { ImpactPathwayService } from '../../core/impact-pathway/impact-pathway.service';
import { PROJECT_ROUTE } from '../sub-project-page.component';

@Component({
  selector: 'ds-sub-project-page-content',
  templateUrl: './sub-project-page-content.component.html',
  styleUrls: ['./sub-project-page-content.component.scss']
})
export class SubProjectPageContentComponent {

  /**
   * The project displayed on this page
   */
  @Input() project: Community;

  /**
   * The project displayed on this page
   */
  @Input() projectUUID: string;

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

}
