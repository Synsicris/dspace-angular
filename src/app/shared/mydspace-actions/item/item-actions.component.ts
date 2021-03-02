import { Component, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { ItemDataService } from '../../../core/data/item-data.service';
import { Item } from '../../../core/shared/item.model';
import { NotificationsService } from '../../notifications/notifications.service';
import { RequestService } from '../../../core/data/request.service';
import { SearchService } from '../../../core/shared/search/search.service';
import { EditItemMode } from '../../../core/submission/models/edititem-mode.model';
import { EditItemDataService } from '../../../core/submission/edititem-data.service';

/**
 * This component represents mydspace actions related to Item object.
 */
@Component({
  selector: 'ds-item-actions',
  styleUrls: ['./item-actions.component.scss'],
  templateUrl: './item-actions.component.html',
})

export class ItemActionsComponent extends MyDSpaceActionsComponent<Item, ItemDataService> {

  /**
   * The Item object
   */
  @Input() object: Item;

  /**
   * A boolean representing if component is redirecting to edit page
   * @type {BehaviorSubject<boolean>}
   */
  public isRedirectingToEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * Initialize instance variables
   *
   * @param {Injector} injector
   * @param {Router} router
   * @param {NotificationsService} notificationsService
   * @param {TranslateService} translate
   * @param {SearchService} searchService
   * @param {RequestService} requestService
   * @param {EditItemDataService} editItemDataService
   */
  constructor(protected injector: Injector,
              protected router: Router,
              protected notificationsService: NotificationsService,
              protected translate: TranslateService,
              protected searchService: SearchService,
              protected requestService: RequestService,
              protected editItemDataService: EditItemDataService) {
    super(Item.type, injector, router, notificationsService, translate, searchService, requestService);
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
    return this.editItemDataService.searchEditModesByID(this.object.id).pipe(
      map((editModes: EditItemMode[]) => editModes && editModes.length > 0)
    );
  }

  /**
   * Navigate to edit item page
   */
  public navigateToEditItemPage(): void {
    this.isRedirectingToEdit$.next(true);
    this.editItemDataService.searchEditModesByID(this.object.id).pipe(
      filter((editModes: EditItemMode[]) => editModes && editModes.length > 0),
      map((editModes: EditItemMode[]) => editModes[0])
    ).subscribe((editMode: EditItemMode) => {
      this.router.navigate(['edit-items', this.object.id + ':' + editMode.name]);
      this.isRedirectingToEdit$.next(false);
    });
  }
}
