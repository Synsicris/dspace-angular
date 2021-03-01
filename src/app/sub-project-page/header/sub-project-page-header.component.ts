import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Community } from '../../core/shared/community.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';

@Component({
  selector: 'ds-sub-project-page-header',
  templateUrl: './sub-project-page-header.component.html',
  styleUrls: ['./sub-project-page-header.component.scss']
})
export class SubProjectPageHeaderComponent {

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
    console.log('getProjectName', this.project);
    return this.nameService.getName(this.project);
  }

}
