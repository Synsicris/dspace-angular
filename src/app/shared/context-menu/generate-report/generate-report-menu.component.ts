import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ProcessParameter } from '../../../process-page/processes/process-parameter.model';
import { ScriptDataService } from '../../../core/data/processes/script-data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { RequestService } from '../../../core/data/request.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { Process } from '../../../process-page/processes/process.model';
import { ContextMenuEntryType } from '../context-menu-entry-type';

/**
 * This component renders a context menu option that provides to export an item.
 */
@Component({
  selector: 'ds-context-menu-generate-report',
  templateUrl: './generate-report-menu.component.html'
})
@rendersContextMenuEntriesForType('SUBPROJECT')
export class GenerateReportMenuComponent extends ContextMenuEntryComponent {

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {NotificationsService} notificationService
   * @param {RequestService} requestService
   * @param {Router} router
   * @param {ScriptDataService} scriptService
   * @param {TranslateService} translationService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    private authorizationService: AuthorizationDataService,
    private notificationService: NotificationsService,
    private requestService: RequestService,
    private router: Router,
    private scriptService: ScriptDataService,
    private translationService: TranslateService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.Report);
  }

  /**
   * Launch a process to generate jasper report
   */
  generateReport() {
    const stringParameters: ProcessParameter[] = [
      { name: '-s', value: 'jasper' },
      { name: '-i', value: this.contextMenuObject.id },
      { name: '-f', value: 'pdf' }
    ];

    this.scriptService.invoke('download-report', stringParameters, [])
      .pipe(getFirstCompletedRemoteData())
      .subscribe((rd: RemoteData<Process>) => {
        if (rd.isSuccess) {
          this.notificationService.success(this.translationService.get('context-menu.actions.generate-report.success'));
          this.navigateToProcesses(rd.payload.processId);
        } else {
          this.notificationService.error(this.translationService.get('context-menu.actions.generate-report.error'));
        }
      });
  }

  /**
   * Redirect to process list page
   */
  private navigateToProcesses(processId) {
    this.requestService.removeByHrefSubstring('/processes');
    this.router.navigate(['/processes', processId]);
  }
}
