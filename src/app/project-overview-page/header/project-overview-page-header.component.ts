import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Community } from '../../core/shared/community.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { ProjectDataService } from '../../core/project/project-data.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteData } from '../../core/data/remote-data';
import { NoContent } from '../../core/shared/NoContent.model';

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

  private processing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private modalService: NgbModal,
              private nameService: DSONameService,
              private notificationsService: NotificationsService,
              private projectService: ProjectDataService,
              private router: Router,
              private translate: TranslateService) {
  }

  /**
   * Return project name
   */
  getProjectName(): string {
    return this.nameService.getName(this.project);
  }

  /**
   * Show a confirmation dialog for delete and perform delete action
   */
  public confirmDelete(content) {
    this.modalService.open(content).result.then((result) => {
      if (result === 'ok') {
        this.processing$.next(true);
        this.projectService.delete(this.projectUUID).pipe(take(1))
          .subscribe((response: RemoteData<NoContent>) => {
            this.processing$.next(false);
            if (response.isSuccess) {
              this.navigateToMainPage();
              this.notificationsService.success(null, this.translate.instant('project-overview.page.header.delete.success'));
            } else {
              this.notificationsService.error(null, this.translate.instant('project-overview.page.header.delete.error'));
            }
        });
      }
    });
  }

  /**
   * Navigate to impact pathway edit page
   */
  navigateToMainPage(): void {
    this.router.navigate(['/']);

  }

  isProcessing() {
    return this.processing$.asObservable();
  }
}
