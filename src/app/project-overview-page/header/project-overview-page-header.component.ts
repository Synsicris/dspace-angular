import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Community } from '../../core/shared/community.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';

@Component({
  selector: 'ds-project-overview-page-header',
  templateUrl: './project-overview-page-header.component.html',
  styleUrls: ['./project-overview-page-header.component.scss']
})
export class ProjectOverviewPageHeaderComponent {

  /**
   * The project displayed on this page
   */
  @Input() project: Community;

  /**
   * The project displayed on this page
   */
  @Input() projectUUID: string;

  constructor(private modalService: NgbModal,
              private nameService: DSONameService) {
  }

  /**
   * Return project name
   */
  getProjectName(): string {
    return this.nameService.getName(this.project);
  }

}
