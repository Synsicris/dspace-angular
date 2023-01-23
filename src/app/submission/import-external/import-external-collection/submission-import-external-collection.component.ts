import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CollectionListEntry } from '../../../shared/collection-dropdown/collection-dropdown.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';

/**
 * Wrap component for 'ds-collection-dropdown'.
 */
@Component({
  selector: 'ds-submission-import-external-collection',
  styleUrls: ['./submission-import-external-collection.component.scss'],
  templateUrl: './submission-import-external-collection.component.html'
})
export class SubmissionImportExternalCollectionComponent {

  /**
   * If present this value is used to filter collection list by community
   */
  @Input() scope: string;

  /**
   * The event passed by 'ds-collection-dropdown'.
   */
  @Output() public selectedEvent = new EventEmitter<CollectionListEntry>();

  /**
   * If present this value is used to filter collection list by entity type
   */
  public entityType: string;

  /**
   * If collection searching is pending or not
   */
  public get loading() {
    return this._loading$.value;
  }

  public set loading(value: boolean) {
    this._loading$.next(value);
  }

  private _loading$ = new BehaviorSubject<boolean>(false);

  /**
   * Initialize the component variables.
   * @param {NgbActiveModal} activeModal
   */
  constructor(
    private activeModal: NgbActiveModal
  ) {
  }

  /**
   * This method populates the 'selectedEvent' variable.
   */
  public selectObject(event): void {
    this.selectedEvent.emit(event);
  }

  /**
   * This method closes the modal.
   */
  public closeCollectionModal(): void {
    this.activeModal.dismiss(false);
  }

  /**
   * Propagate the onlySelectable collection
   * @param theOnlySelectable
   */
  public theOnlySelectable(theOnlySelectable: CollectionListEntry) {
    this.selectedEvent.emit(theOnlySelectable);
  }

  /**
   * Marks the status to **not loading**
   */
  public searchComplete() {
    this.loading = false;
  }

  /**
   * If the component is in loading state.
   */
  public isLoading(): boolean {
    return !!this.loading;
  }

}
