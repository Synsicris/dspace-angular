import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Item } from '../../../core/shared/item.model';
import { hasValue } from '../../../shared/empty.util';
import { Subscription } from 'rxjs/internal/Subscription';

/**
 * This component renders a context menu option that provides the request a correction functionality.
 */
@Component({
  selector: 'ds-item-page-context-menu-edit-impact-pathway',
  templateUrl: './edit-impact-pathway.component.html'
})
export class ContextMenuEditImpactPathwayComponent implements OnDestroy {

  /**
   * The related item
   */
  @Input() item: Item;

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
   * Variable to track subscription and unsubscribe it onDestroy
   */
  private sub: Subscription;

  /**
   * Initialize instance variables
   *
   * @param {Router} router
   * @param {TranslateService} translate
   */
  constructor(
    private router: Router,
    private translate: TranslateService
  ) {
  }

  /**
   * Redirect to impact pathway edit page
   */
  public redirectTo() {
    this.router.navigate(['impactpathway', this.item.id, 'edit']);
  }

  /**
   * Make sure the subscription is unsubscribed from when this component is destroyed
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
