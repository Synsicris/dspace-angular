import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EditSimpleItemModalComponent } from '../../../shared/edit-simple-item-modal/edit-simple-item-modal.component';
import { Item } from '../../../core/shared/item.model';
import { SubmissionFormModel } from '../../../core/config/models/config-submission-form.model';
import { CompareItemComponent } from '../../../shared/compare-item/compare-item.component';

@Component({
  selector: 'ds-editable-textarea',
  styleUrls: ['./editable-textarea.component.scss'],
  templateUrl: './editable-textarea.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditableTextareaComponent {

  /**
   * A boolean representing if compare mode is enabled
   */
  @Input() compareMode: boolean;

  /**
   * The item edit mode
   */
  @Input() editMode: string;

  /**
   * The label to use as edit button's title
   */
  @Input() public editTitle: string;

  /**
   * The form config
   * @type {Observable<SubmissionFormModel>}
   */
  @Input() public formConfig: Observable<SubmissionFormModel>;

  /**
   * The path to metadata section to patch
   */
  @Input() formSectionName: string;

  /**
   * The item's id related to the edit form
   */
  @Input() public itemId: string;

  /**
   * The item's id to compare to
   */
  @Input() public compareItemId: string;

  /**
   * The label to use as field title
   */
  @Input() public fieldTitle: string;

  /**
   * The current value of the field
   */
  @Input() public content: string;

  /**
   * The textarea rows number
   */
  @Input() public rows = 5;

  /**
   * The textarea disabled
   */
  @Input() public disabled = false;

  /**
   * Emits the edited item when the form is submitted
   */
  @Output() contentChange: EventEmitter<Item> = new EventEmitter<Item>();
  @ViewChild('textarea', { static: false }) textarea: ElementRef;

  constructor(private modalService: NgbModal) {
  }

  /**
   * Open a modal for item metadata comparison
   */
  openCompareModal() {
    const modalRef = this.modalService.open(CompareItemComponent, { size: 'xl' });
    (modalRef.componentInstance as CompareItemComponent).baseItemId = this.itemId;
    (modalRef.componentInstance as CompareItemComponent).versionedItemId = this.compareItemId;
  }

  /**
   * Open the modal with edit form
   */
  openEditModal() {
    const modalRef = this.modalService.open(EditSimpleItemModalComponent, { size: 'lg' });
    modalRef.componentInstance.editMode = this.editMode;
    modalRef.componentInstance.formConfig = this.formConfig;
    modalRef.componentInstance.formSectionName = this.formSectionName;
    modalRef.componentInstance.itemId = this.itemId;
    modalRef.componentInstance.itemUpdate.pipe(
      take(1)
    ).subscribe((item: Item) => this.contentChange.emit(item));
  }
}
