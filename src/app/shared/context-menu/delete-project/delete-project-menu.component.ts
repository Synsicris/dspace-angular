import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { RemoteData } from '../../../core/data/remote-data';
import { NoContent } from '../../../core/shared/NoContent.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { ProjectDataService } from '../../../core/project/project-data.service';
import { Community } from '../../../core/shared/community.model';
import { NotificationsService } from '../../notifications/notifications.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { ContextMenuEntryType } from '../context-menu-entry-type';

/**
 * This component renders a context menu option that provides to export an item.
 */
@Component({
  selector: 'ds-context-menu-audit-item',
  templateUrl: './delete-project-menu.component.html'
})
@rendersContextMenuEntriesForType('PROJECT')
export class DeleteProjectMenuComponent extends ContextMenuEntryComponent {

  /**
   * Representing if deletion is processing
   */
  public processing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Modal reference
   */
  private modalRef: NgbModalRef;

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {NgbModal} modalService
   * @param {NotificationsService} notificationsService
   * @param {ProjectDataService} projectService
   * @param {Router} router
   * @param {TranslateService} translate
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected authorizationService: AuthorizationDataService,
    protected modalService: NgbModal,
    protected notificationsService: NotificationsService,
    protected projectService: ProjectDataService,
    protected router: Router,
    protected translate: TranslateService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.DeleteProject);
  }

  /**
   * Show a confirmation dialog for delete and perform delete action
   */
  public confirmDelete() {
    this.processing$.next(true);
    this.projectService.delete((this.contextMenuObject as Community).id).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((response: RemoteData<NoContent>) => {
      this.processing$.next(false);
      if (response.isSuccess) {
        this.navigateToMainPage();
        this.notificationsService.success(null, this.translate.instant('project-overview.page.header.delete.success'));
      } else {
        this.notificationsService.error(null, this.translate.instant('project-overview.page.header.delete.error'));
      }
      this.modalRef.close();
    });
  }

  public openConfirmationModal(content) {
    this.modalRef = this.modalService.open(content);
  }
  /**
   * Navigate to impact pathway edit page
   */
  navigateToMainPage(): void {
    this.router.navigate(['/']);

  }

  /**
   * Check if user is administrator for this project
   */
  canDeleteProject(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanDelete, this.contextMenuObject.self, undefined);
  }

  isProcessing() {
    return this.processing$.asObservable();
  }

}
