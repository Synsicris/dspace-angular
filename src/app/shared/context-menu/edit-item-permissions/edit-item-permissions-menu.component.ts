import { Component, Inject, OnInit } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Item } from '../../../core/shared/item.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { EditItemGrantsModalComponent } from '../../edit-item-grants-modal/edit-item-grants-modal.component';
import { isNotEmpty } from '../../empty.util';
import { PROJECT_ENTITY } from '../../../core/project/project-data.service';


/**
 * This component renders a context menu option that provides the links to edit item page.
 */
@Component({
  selector: 'ds-context-menu-edit-item-permissions',
  templateUrl: './edit-item-permissions-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM, true)
export class EditItemPermissionsMenuComponent extends ContextMenuEntryComponent implements OnInit {

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
   * A boolean representing if user can edit grants
   */
  private canEditGrants$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   * @param {NgbModal} modalService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected authorizationService: AuthorizationDataService,
    protected modalService: NgbModal,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.EditSubmission);
  }

  ngOnInit(): void {
    this.authorizationService.isAuthorized(FeatureID.CanEditItemGrants, this.contextMenuObject.self, undefined)
      .subscribe((canEdit) => {
        this.canEditGrants$.next(canEdit);
      });
  }

  /**
   * Check if current Item is a not Project
   */
  canShow() {
    return (this.contextMenuObject as Item).entityType !== PROJECT_ENTITY;
  }

  /**
   * Check if edit grants is available
   */
  isEditPermissionAvailable(): Observable<boolean> {
    return this.canEditGrants$.asObservable();
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
