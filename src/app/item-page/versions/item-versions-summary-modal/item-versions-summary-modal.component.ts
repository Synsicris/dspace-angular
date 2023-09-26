import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { isNotEmpty } from '../../../shared/empty.util';
import { ModalBeforeDismiss } from '../../../shared/interfaces/modal-before-dismiss.interface';
import { getFirstCompletedRemoteData } from 'src/app/core/shared/operators';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { Process } from '../../../process-page/processes/process.model';
import { RemoteData } from '../../../core/data/remote-data';
import { ScriptDataService } from '../../../core/data/processes/script-data.service';

@Component({
  selector: 'ds-item-versions-summary-modal',
  templateUrl: './item-versions-summary-modal.component.html',
  styleUrls: ['./item-versions-summary-modal.component.scss']
})
export class ItemVersionsSummaryModalComponent implements OnInit, ModalBeforeDismiss {

  versionNumber: number;
  newVersionSummary: string;
  firstVersion = true;
  submitted$: BehaviorSubject<boolean>;
  itemId: string;
  /**
   * The url is used to redirect to the manage versions page.
   * If the url is not set, the button to redirect to the manage versions page will not be shown.
   * The url is passed to the routerLink directive.
   */
  url: string;

  processing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Output() createVersionEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    protected activeModal: NgbActiveModal,
    private scriptDataService: ScriptDataService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.submitted$ = new BehaviorSubject<boolean>(false);
  }

  onModalClose() {
    this.activeModal.dismiss();
  }

  beforeDismiss(): boolean | Promise<boolean> {
    // prevent the modal from being dismissed after version creation is initiated
    return !this.submitted$.getValue();
  }

  onModalSubmit() {
    this.processing$.next(true);
    this.createVersionEvent.emit(this.newVersionSummary);
    this.submitted$.next(true);
    this.launchScript();
    this.activeModal.close();
  }

  /**
   * Launch the script to create a new version
   * params: -i <itemId> & -s <summary>
   */
  private launchScript() {
    const parameters = [];
    if (isNotEmpty(this.newVersionSummary)) {
      parameters.push({name: '-s', value: this.newVersionSummary});
    }
    if (isNotEmpty(this.itemId)) {
      parameters.push({name: '-i', value: this.itemId});
    }

    this.scriptDataService.invoke('version', parameters, []).pipe(
      getFirstCompletedRemoteData()
    ).subscribe((rd: RemoteData<Process>) => {
      if (rd.hasSucceeded) {
        const title = this.translateService.get('process.new.notification.process.create-version');
        this.notificationsService.process(rd.payload.processId, 5000, title, null, false, this.url);
      } else {
        this.notificationsService.error(this.translateService.get('process.new.notification.process.create-failed'));
      }
    });
  }
}
