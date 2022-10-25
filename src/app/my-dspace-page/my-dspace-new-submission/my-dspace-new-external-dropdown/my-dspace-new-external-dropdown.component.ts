import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of as observableOf, Subscription } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

import { EntityTypeService } from '../../../core/data/entity-type.service';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';
import { FindListOptions } from '../../../core/data/request.models';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RequestParam } from '../../../core/cache/models/request-param.model';

/**
 * This component represents the 'Import metadata from external source' dropdown menu
 */
@Component({
  selector: 'ds-my-dspace-new-external-dropdown',
  styleUrls: ['./my-dspace-new-external-dropdown.component.scss'],
  templateUrl: './my-dspace-new-external-dropdown.component.html'
})
export class MyDSpaceNewExternalDropdownComponent implements OnInit, OnDestroy {

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
   * @param {Router} router
   */
  constructor(private entityTypeService: EntityTypeService,
              private router: Router) { }

  /**
   * Initialize entity type list
   */
  ngOnInit() {
    this.initialized$ = observableOf(false);
    this.moreThanOne$ = this.entityTypeService.hasMoreThanOneAuthorizedImport(this.scope);
    this.singleEntity$ = this.moreThanOne$.pipe(
      mergeMap((response: boolean) => {
        if (!response) {
          const findListOptions: FindListOptions = {
            elementsPerPage: 1,
            currentPage: 1
          };
          if (isNotEmpty(this.scope)) {
            findListOptions.searchParams = [new RequestParam('scope', this.scope)];
          }

          return this.entityTypeService.getAllAuthorizedRelationshipTypeImport(findListOptions).pipe(
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
   * Method called on clicking the button 'Import metadata from external source'. It opens the page of the external import.
   */
  openPage(entity: ItemType) {
    const params = Object.create({});
    if (entity) {
      params.entity = entity.label;
    }
    if (this.scope) {
      params.scope = this.scope;
    }
    this.router.navigate(['/import-external'], { queryParams: params });
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
