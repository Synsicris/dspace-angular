import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ipw-editable-textarea',
  styleUrls: ['./editable-textarea.component.scss'],
  templateUrl: './editable-textarea.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditableTextareaComponent implements OnInit {

  @Input() public placeholder: string;
  @Input() public initContent: string;

  editContent: string;

  savedContent: string;

  /**
   * Emits whether or not this field is currently editable
   */
  editable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Output() contentChange: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {
    this.editContent = this.initContent;
    this.savedContent = this.initContent;
  }

  /**
   * Check if a user should be allowed to edit this field
   * @return an observable that emits true when the user should be able to edit this field and false when they should not
   */
  canSetEditable() {
    return this.isEditable().pipe(
      map((editable) => !editable)
    )
  }

  /**
   * Check if a user should be allowed to undo changes to this field
   * @return an observable that emits true when the user should be able to undo changes to this field and false when they should not
   */
  canUndo(): Observable<boolean> {
    return this.isEditable().pipe(
      map((editable: boolean) => this.editContent !== this.savedContent || editable)
    );
  }

  isEditable(): Observable<boolean> {
    return this.editable$.asObservable()
  }

  /**
   * Revert changes
   */
  removeChangesFromField() {
    this.editContent = this.savedContent;
  }

  save(): void {
    this.setEditable(false);
    this.savedContent = this.editContent;
    this.contentChange.emit(this.savedContent);
  }

  /**
   * Change editable state for this field
   * @param editable The new editable state for this field
   */
  setEditable(editable: boolean) {
    this.editable$.next(editable);
  }
}
