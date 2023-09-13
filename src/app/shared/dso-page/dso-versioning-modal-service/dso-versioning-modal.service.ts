import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { Version } from '../../../core/shared/version.model';
import { map, startWith, switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VersionDataService } from '../../../core/data/version-data.service';
import { VersionHistoryDataService } from '../../../core/data/version-history-data.service';
import { Router } from '@angular/router';
import { WorkspaceitemDataService } from '../../../core/submission/workspaceitem-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ItemVersionsSharedService } from '../../../item-page/versions/item-versions-shared.service';
import {
  ItemVersionsSummaryModalComponent
} from '../../../item-page/versions/item-versions-summary-modal/item-versions-summary-modal.component';

/**
 * Service to take care of all the functionality related to the version creation modal
 */
@Injectable({
  providedIn: 'root'
})
export class DsoVersioningModalService {


  constructor(
    protected modalService: NgbModal,
    protected versionService: VersionDataService,
    protected versionHistoryService: VersionHistoryDataService,
    protected itemVersionShared: ItemVersionsSharedService,
    protected router: Router,
    protected workspaceItemDataService: WorkspaceitemDataService,
    protected itemService: ItemDataService,
  ) {
  }

  /**
   * Open the create version modal for the provided dso
   */
  openCreateVersionModal(dso): void {

    const item = dso;
    const versionHref = item._links.version.href;

    // Open modal
    const activeModal = this.modalService.open(ItemVersionsSummaryModalComponent);

    // Show current version in modal
    this.versionService.findByHref(versionHref).pipe(getFirstCompletedRemoteData()).subscribe((res: RemoteData<Version>) => {
      // if res.hasNoContent then the item is unversioned
      activeModal.componentInstance.firstVersion = res.hasNoContent;
      activeModal.componentInstance.versionNumber = (res.hasNoContent ? undefined : res.payload.version);
      activeModal.componentInstance.itemId = item.uuid;
      activeModal.componentInstance.url = `entities/project/${item.uuid}/manageversions`;
    });

    // On createVersionEvent emitted create new version and notify
    activeModal.componentInstance.createVersionEvent.subscribe(() => {
      this.itemService.invalidateItemCache(item.uuid);
      this.versionHistoryService.invalidateAllVersionHistoryCache();
      this.modalService.dismissAll();
    });
  }

  /**
   * Checks if the new version button should be disabled for the provided dso
   */
  isNewVersionButtonDisabled(dso): Observable<boolean> {
    return this.versionHistoryService.hasDraftVersion$(dso._links.version.href).pipe(
      // button is disabled if hasDraftVersion = true, and enabled if hasDraftVersion = false or null
      // (hasDraftVersion is null when a version history does not exist)
      map((res) => Boolean(res)),
      startWith(true),
    );
  }

  /**
   * Checks and returns the tooltip that needs to be used for the create version button tooltip
   */
  getVersioningTooltipMessage(dso, tooltipMsgHasDraft, tooltipMsgCreate): Observable<string> {
    return this.isNewVersionButtonDisabled(dso).pipe(
      switchMap((hasDraftVersion) => of(hasDraftVersion ? tooltipMsgHasDraft : tooltipMsgCreate)),
    );
  }
}
