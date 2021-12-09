import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { EntityTypeService } from '../../../core/data/entity-type.service';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';
import { FindListOptions } from '../../../core/data/request.models';
import { hasValue } from '../../../shared/empty.util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateItemParentSelectorComponent } from '../../../shared/dso-selector/modal-wrappers/create-item-parent-selector/create-item-parent-selector.component';
import { map, mergeMap, take } from 'rxjs/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RequestParam } from '../../../core/cache/models/request-param.model';

/**
 * This component represents the new submission dropdown
 */
@Component({
  selector: 'ds-my-dspace-new-submission-dropdown',
  styleUrls: ['./my-dspace-new-submission-dropdown.component.scss'],
  templateUrl: './my-dspace-new-submission-dropdown.component.html'
})
export class MyDSpaceNewSubmissionDropdownComponent implements OnInit, OnDestroy {

  /**
   * It's used to limit the search within the scope
   */
  @Input() scope: string;

  /**
   * Used to verify if there are one or more entities available
   */
  public moreThanOne$: Observable<boolean>;

  /**
   * The entity observble (only if there is only one entity available)
   */
  public singleEntity$: Observable<ItemType>;

  /**
   * The entity object (only if there is only one entity available)
   */
  public singleEntity: ItemType;

  /**
   * TRUE if the page is initialized
   */
  public initialized$: Observable<boolean>;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  public subs: Subscription[] = [];

  /**
   * Initialize instance variables
   *
   * @param {EntityTypeService} entityTypeService
   * @param {NgbModal} modalService
   */
  constructor(private entityTypeService: EntityTypeService,
              private modalService: NgbModal) { }

  /**
   * Initialize entity type list
   */
  ngOnInit() {
    this.initialized$ = observableOf(false);
    this.moreThanOne$ = this.entityTypeService.hasMoreThanOneAuthorized();
    this.singleEntity$ = this.moreThanOne$.pipe(
      mergeMap((response: boolean) => {
        if (!response) {
          const findListOptions: FindListOptions = {
            elementsPerPage: 1,
            currentPage: 1,
            searchParams: [new RequestParam('scope', this.scope)]
          };
          return this.entityTypeService.getAllAuthorizedRelationshipType(findListOptions).pipe(
            map((entities: RemoteData<PaginatedList<ItemType>>) => {
              this.initialized$ = observableOf(true);
              return entities.payload.page[0];
            }),
            take(1)
          );
        } else {
          this.initialized$ = observableOf(true);
          return observableOf(null);
        }
      }),
      take(1)
    );
    this.subs.push(
      this.singleEntity$.subscribe((result) => this.singleEntity = result )
    );
  }

  /**
   * Method called on clicking the button "New Submition", It opens a dialog for
   * select a collection.
   */
  openDialog(entity: ItemType) {
    const modalRef = this.modalService.open(CreateItemParentSelectorComponent);
    modalRef.componentInstance.entityType = entity.label;
    modalRef.componentInstance.scope = this.scope;
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
