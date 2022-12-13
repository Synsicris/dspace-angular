import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { ItemDataService } from '../../../core/data/item-data.service';
import { Item } from '../../../core/shared/item.model';
import { NotificationsService } from '../../notifications/notifications.service';
import { RequestService } from '../../../core/data/request.service';
import { SearchService } from '../../../core/shared/search/search.service';
import { EditItemMode } from '../../../core/submission/models/edititem-mode.model';
import { EditItemDataService } from '../../../core/submission/edititem-data.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditItemGrantsModalComponent } from '../../edit-item-grants-modal/edit-item-grants-modal.component';
import { isNotEmpty } from '../../empty.util';
import { environment } from '../../../../environments/environment';
import { ProjectVersionService } from '../../../core/project/project-version.service';

/**
 * This component represents mydspace actions related to Item object.
 */
@Component({
  selector: 'ds-item-actions',
  styleUrls: ['./item-actions.component.scss'],
  templateUrl: './item-actions.component.html',
})

export class ItemActionsComponent extends MyDSpaceActionsComponent<Item, ItemDataService> implements OnInit {

  /**
   * The Item object
   */
  @Input() object: Item;

  /**
   * A boolean representing if edit permission button can be shown
   */
  @Input() showEditPermission = false;

  /**
   * A boolean representing if component is redirecting to edit page
   * @type {BehaviorSubject<boolean>}
   */
  public isRedirectingToEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * A boolean representing if editing is available
   * @type {BehaviorSubject<boolean>}
   */
  private canEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * A boolean representing if editing grants is available
   * @type {BehaviorSubject<boolean>}
   */
  private canEditGrants$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The edit mode to use
   */
  private projectsEntityEditMode: string;

  /**
   * Initialize instance variables
   *
   * @param {AuthorizationDataService} authorizationService
   * @param {Injector} injector
   * @param {Router} router
   * @param {NotificationsService} notificationsService
   * @param {TranslateService} translate
   * @param {SearchService} searchService
   * @param {RequestService} requestService
   * @param {EditItemDataService} editItemDataService
   * @param {ProjectVersionService} projectVersionService
   * @param {NgbModal} modalService
   */
  constructor(protected authorizationService: AuthorizationDataService,
              protected injector: Injector,
              protected router: Router,
              protected notificationsService: NotificationsService,
              protected translate: TranslateService,
              protected searchService: SearchService,
              protected requestService: RequestService,
              protected editItemDataService: EditItemDataService,
              protected projectVersionService: ProjectVersionService,
              protected modalService: NgbModal) {
    super(Item.type, injector, router, notificationsService, translate, searchService, requestService);
  }


  ngOnInit(): void {
    if (this.projectVersionService.isVersionOfAnItem(this.object)) {
      this.canEdit$.next(false);
      this.canEditGrants$.next(false);
    } else {
      const adminEdit$ = this.editItemDataService.checkEditModeByIDAndType(this.object.id, environment.projects.projectsEntityAdminEditMode).pipe(
        take(1)
      );
      const userEdit$ = this.editItemDataService.checkEditModeByIDAndType(this.object.id, environment.projects.projectsEntityEditMode).pipe(
        take(1)
      );

      combineLatest([adminEdit$, userEdit$])  .subscribe(([canAdminEdit, canUserEdit]: [boolean, boolean]) => {
        if (canUserEdit) {
          this.projectsEntityEditMode = environment.projects.projectsEntityEditMode;
        } else if (canAdminEdit) {
          this.projectsEntityEditMode = environment.projects.projectsEntityAdminEditMode;
        }

        this.canEdit$.next(canAdminEdit || canUserEdit);
      });

      this.authorizationService.isAuthorized(FeatureID.CanEditItemGrants, this.object.self, undefined).pipe(
        take(1)
      ).subscribe((canEdit: boolean) => {
        this.canEditGrants$.next(canEdit);
      });
    }
  }

  /**
   * Init the target object
   *
   * @param {Item} object
   */
  initObjects(object: Item) {
    this.object = object;
  }

  /**
   * Check if edit modes are available for the item
   */
  canEdit(): Observable<boolean> {
    return this.canEdit$.asObservable();
  }

  /**
   * Check if edit modes are available for the item
   */
  canEditGrants(): Observable<boolean> {
    return this.canEditGrants$.asObservable();
  }

  /**
   * Navigate to edit item page
   */
  public navigateToEditItemPage(): void {
    this.isRedirectingToEdit$.next(true);
    this.editItemDataService.searchEditModesByID(this.object.id).pipe(
      filter((editModes: EditItemMode[]) => editModes && editModes.length > 0),
      map((editModes: EditItemMode[]) => editModes.filter((mode: EditItemMode) => this.isEditModeAllowed(mode))),
      map((editModes: EditItemMode[]) => editModes[0]),
      take(1),
    ).subscribe((editMode: EditItemMode) => {
      this.router.navigate(['edit-items', this.object.id + ':' + editMode.name]);
      this.isRedirectingToEdit$.next(false);
    });
  }

  private isEditModeAllowed(mode: EditItemMode) {
    return mode.name === 'FULL' || mode.name === environment.projects.projectsEntityEditMode
      || mode.name === environment.projects.projectsEntityAdminEditMode || mode.name === 'OWNER';
  }

  /**
   * Open edit grants modal
   */
  openEditGrantsModal() {
    const modRef = this.modalService.open(EditItemGrantsModalComponent);
    modRef.componentInstance.item = this.object;

    modRef.result.then((item: Item) => {
      if (isNotEmpty(item)) {
        this.object = item;
      }
    });

  }
}
