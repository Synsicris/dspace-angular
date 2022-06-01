import { Item } from './../../../core/shared/item.model';
import { AuthorizationDataService } from './../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from './../../../core/data/feature-authorization/feature-id';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { EditItemGrantsModalComponent } from '../../edit-item-grants-modal/edit-item-grants-modal.component';
import { isNotEmpty } from '../../empty.util';

/**
 * This component renders a context menu option that provides the links to edit item page.
 */
@Component({
  selector: 'ds-context-menu-edit-item-permissions',
  templateUrl: './edit-item-permissions-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM, true)
export class EditItemPermissionsMenuComponent extends ContextMenuEntryComponent {

  /**
   * The menu entry type
   */
  public static menuEntryType: ContextMenuEntryType = ContextMenuEntryType.EditSubmission;

  /**
   * A boolean representing if a request operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public processing$ = new BehaviorSubject<boolean>(false);

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;


  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {EditItemDataService} editItemService
   * @param notificationService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected authorizationService: AuthorizationDataService,
    protected modalService: NgbModal,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.EditSubmission);
  }

  /**
   * Check if edit grants is available
   */
  isEditPermissionAvailable(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanEditItemGrants, this.contextMenuObject.self, undefined);
  }

  /**
   * Open edit grants modal
   */
  openEditGrantsModal() {
    const modRef = this.modalService.open(EditItemGrantsModalComponent);
    modRef.componentInstance.item = this.contextMenuObject;

    modRef.result.then((item: Item) => {
      if (isNotEmpty(item)) {
        this.contextMenuObject = item;
      }
    });

  }
}
