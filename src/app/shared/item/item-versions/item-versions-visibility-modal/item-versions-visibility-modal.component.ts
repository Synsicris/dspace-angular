import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Version } from '../../../../core/shared/version.model';

@Component({
  selector: 'ds-item-versions-visibility-modal',
  templateUrl: './item-versions-visibility-modal.component.html',
  styleUrls: ['./item-versions-visibility-modal.component.scss']
})
export class ItemVersionsVisibilityModalComponent {

  version: Version;

  official = false;

  constructor(
    protected activeModal: NgbActiveModal,) {
  }

  onModalClose() {
    this.activeModal.dismiss();
  }

  onModalSubmit() {
    this.activeModal.close({ official: this.official });
  }

}
