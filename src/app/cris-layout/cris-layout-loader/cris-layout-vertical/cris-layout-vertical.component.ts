import { Component, Input } from '@angular/core';
import { RenderCrisLayoutPageFor } from '../../decorators/cris-layout-page.decorator';
import { LayoutPage } from '../../enums/layout-page.enum';
import { CrisLayoutTab } from '../../../core/layout/models/tab.model';
import { Item } from '../../../core/shared/item.model';
import { BehaviorSubject } from 'rxjs';
import { HostWindowService } from '../../../shared/host-window.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-cris-layout-vertical',
  templateUrl: './cris-layout-vertical.component.html',
  styleUrls: ['./cris-layout-vertical.component.scss']
})
@RenderCrisLayoutPageFor(LayoutPage.VERTICAL)
export class CrisLayoutVerticalComponent {

  /**
   * DSpace Item to render
   */
  @Input() item: Item;

  /**
   * Tabs to render
   */
  @Input() tabs: CrisLayoutTab[];

  /**
   * A boolean representing if to show context menu or not
   */
  @Input() showContextMenu: boolean;

  /**
   * leadingTabs to understand if to show navbar
   */
  @Input() leadingTabs: CrisLayoutTab[];

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;


  selectedTab$: BehaviorSubject<CrisLayoutTab> = new BehaviorSubject<CrisLayoutTab>(null);

  constructor(public windowService: HostWindowService, private modalService: NgbModal) {
  }

  selectedTabChanged(tab: CrisLayoutTab) {
    this.selectedTab$.next(tab);
  }


  /**
   * Open modal
   *
   * @param content
   */
  public openModal(modal: any) {
    this.modalRef = this.modalService.open(modal, { size: 'xl' });
  }

}
