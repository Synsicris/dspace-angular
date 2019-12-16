import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../core/shared/item.model';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CoreState } from '../../core/core.reducers';
import { isAuthenticated } from '../../core/auth/selectors';

/**
 * This component renders the parent collections section of the item
 * inside a 'ds-metadata-field-wrapper' component.
 */

@Component({
  selector: 'ds-item-page-context-menu',
  templateUrl: './context-menu.component.html'
})
export class ContextMenuComponent implements OnInit {

  /**
   * The related item
   */
  @Input() item: Item;

  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;

  /**
   * Initialize instance variables
   *
   * @param {Store<CoreState>} store
   */
  constructor(
    private store: Store<CoreState>
  ) {
  }

  ngOnInit(): void {
    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));
  }
}
