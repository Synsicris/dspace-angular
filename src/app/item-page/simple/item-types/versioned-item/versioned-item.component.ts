import { Component } from '@angular/core';
import { ItemComponent } from '../shared/item.component';
import {
  ItemVersionsSummaryModalComponent
} from '../../../../shared/item/item-versions/item-versions-summary-modal/item-versions-summary-modal.component';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { RemoteData } from '../../../../core/data/remote-data';
import { Version } from '../../../../core/shared/version.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VersionHistoryDataService } from '../../../../core/data/version-history-data.service';
import { VersionDataService } from '../../../../core/data/version-data.service';
import { ActivatedRoute } from '@angular/router';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { RouteService } from '../../../../core/services/route.service';

@Component({
  selector: 'ds-versioned-item',
  templateUrl: './versioned-item.component.html',
  styleUrls: ['./versioned-item.component.scss']
})
export class VersionedItemComponent extends ItemComponent {

  constructor(
    private modalService: NgbModal,
    private versionHistoryService: VersionHistoryDataService,
    private versionService: VersionDataService,
    private itemService: ItemDataService,
    protected activatedRoute: ActivatedRoute,
    protected routeService: RouteService
  ) {
    super(routeService);
  }

  /**
   * Open a modal that allows to create a new version starting from the specified item, with optional summary
   */
  onCreateNewVersion(): void {

    const item = this.object;
    const versionHref = item._links.version.href;

    // Open modal
    const activeModal = this.modalService.open(ItemVersionsSummaryModalComponent, { keyboard: false, backdrop: 'static' });

    // Show current version in modal
    this.versionService.findByHref(versionHref).pipe(getFirstCompletedRemoteData()).subscribe((res: RemoteData<Version>) => {
      // if res.hasNoContent then the item is unversioned
      activeModal.componentInstance.firstVersion = res.hasNoContent;
      activeModal.componentInstance.versionNumber = (res.hasNoContent ? undefined : res.payload.version);
      activeModal.componentInstance.itemId = this.object.uuid;
      activeModal.componentInstance.url = `entities/project/${this.activatedRoute.snapshot.params.id}/manageversions`;
    });

    // On createVersionEvent emitted create new version and notify
    activeModal.componentInstance.createVersionEvent.subscribe(() => {
      this.itemService.invalidateItemCache(item.uuid);
      this.versionHistoryService.invalidateAllVersionHistoryCache();
      this.modalService.dismissAll();
    });

  }
}
