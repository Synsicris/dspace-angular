import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AUTOCOMPLETE_OFF, DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { of as observableOf, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NgbDropdown, NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

import { VocabularyService } from '../../core/submission/vocabularies/vocabulary.service';
import { VocabularyOptions } from '../../core/submission/vocabularies/models/vocabulary-options.model';
import { VocabularyEntry } from '../../core/submission/vocabularies/models/vocabulary-entry.model';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { buildPaginatedList, PaginatedList } from '../../core/data/paginated-list.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { DsDynamicVocabularyComponent } from '../form/builder/ds-dynamic-form-ui/models/dynamic-vocabulary.component';
import { FormBuilderService } from '../form/builder/form-builder.service';
import { SubmissionService } from '../../submission/submission.service';
import { DsDynamicInputModel } from '../form/builder/ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { isEmpty } from '../empty.util';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'ds-authority-dropdown',
  styleUrls: ['./authority-dropdown.component.scss', '../form/builder/ds-dynamic-form-ui/models/scrollable-dropdown/dynamic-scrollable-dropdown.component.scss'],
  templateUrl: './authority-dropdown.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AuthorityDropdownComponent extends DsDynamicVocabularyComponent implements OnInit, OnDestroy {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() model: DsDynamicInputModel;
  @Input() fieldId: string;
  @Input() fieldName: string;
  @Input() vocabularyOptions: VocabularyOptions;
  @Input() initValue: any;
  @Input() readOnly = false;
  @Input() minChars = 3;
  @Input() placeholder = '';
  @Input() elementsPerPage = 10;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('instance', { static: false }) instance: NgbTypeahead;

  autocomplete = AUTOCOMPLETE_OFF;
  searching = false;
  currentValue: any;
  inputValue: any;
  preloadLevel: number;
  pageInfo: PageInfo = new PageInfo();
  optionsList: any;
  loading = false;

  /**
   * The text that is being searched
   */
  searchText: string = null;

  /**
   * The subject that is being subscribed to understand when the change happens to implement debounce
   */
  filterTextChanged: Subject<string> = new Subject<string>();

  /**
   * The subscription to be utilized on destroy to remove filterTextChange subscription
   */
  subSearch: Subscription;

  constructor(private cdr: ChangeDetectorRef,
              protected vocabularyService: VocabularyService,
              protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              protected formBuilderService: FormBuilderService,
              protected modalService: NgbModal,
              protected submissionService: SubmissionService
  ) {
    super(vocabularyService, layoutService, validationService, formBuilderService, modalService, submissionService);
  }

  /**
   * Initialize the component, setting up the init form value
   */
  ngOnInit() {
    this.updatePageInfo(this.elementsPerPage, 1);
    this.vocabularyService.getVocabularyEntries(this.vocabularyOptions, this.pageInfo).pipe(
      getFirstSucceededRemoteDataPayload(),
      catchError(() => observableOf(buildPaginatedList(
          new PageInfo(),
          []
        ))
      ))
      .subscribe((list: PaginatedList<VocabularyEntry>) => {
        this.optionsList = list.page;
        if (this.initValue) {
          this.setCurrentValue(this.initValue, true);
        }

        this.updatePageInfo(
          list.pageInfo.elementsPerPage,
          list.pageInfo.currentPage,
          list.pageInfo.totalElements,
          list.pageInfo.totalPages
        );
        this.cdr.detectChanges();
      });

    if (this.group) {
      this.group.get(this.fieldId).valueChanges.pipe(distinctUntilChanged())
        .subscribe((value) => {
          this.setCurrentValue(value);
        });
    }
    this.initFilterSubscriber();
  }


  /**
   * Start subscribtion for filterTextChange to detect change and implement debounce
   */
  initFilterSubscriber(): void {
    this.subSearch = this.filterTextChanged.pipe(
      debounceTime(700),
      distinctUntilChanged()
    )
      .subscribe(text => {
        this.searchText = text;

        this.updatePageInfo(this.elementsPerPage, 1);
        this.vocabularyService.getVocabularyEntries(this.vocabularyOptions, this.pageInfo, this.searchText).pipe(
          getFirstSucceededRemoteDataPayload(),
          catchError(() => observableOf(buildPaginatedList(
              new PageInfo(),
              []
            ))
          ))
          .subscribe((list: PaginatedList<VocabularyEntry>) => {
            this.optionsList = list.page;
            if (this.initValue) {
              this.setCurrentValue(this.initValue, true);
            }

            this.updatePageInfo(
              list.pageInfo.elementsPerPage,
              list.pageInfo.currentPage,
              list.pageInfo.totalElements,
              list.pageInfo.totalPages
            );
            this.cdr.detectChanges();
          });
      });
  }

  /**
   * On input change value we set the change to filterTextChanged subject
   */
  filter(filterText: string) {
    this.filterTextChanged.next(filterText);
  }


  /**
   * Converts an item from the result list to a `string` to display in the `<input>` field.
   */
  inputFormatter = (x: VocabularyEntry): string => x.display || x.value;

  /**
   * Emits a blur event containing a given value.
   * @param event The value to emit.
   */
  onBlur(event: Event) {
    this.blur.emit(event);
  }

  /**
   * Emits a focus event containing a given value.
   * @param event The value to emit.
   */
  onFocus(event) {
    this.focus.emit(event);
  }

  /**
   * Opens dropdown menu
   * @param sdRef The reference of the NgbDropdown.
   */
  openDropdown(sdRef: NgbDropdown) {
    if (!this.readOnly) {
      if (this.group) {
        this.group.markAsUntouched();
      }
      sdRef.open();
    }
  }

  /**
   * Loads any new entries
   */
  onScroll() {
    if (!this.loading && this.pageInfo.currentPage <= this.pageInfo.totalPages) {
      this.loading = true;
      this.updatePageInfo(
        this.pageInfo.elementsPerPage,
        this.pageInfo.currentPage + 1,
        this.pageInfo.totalElements,
        this.pageInfo.totalPages
      );
      this.vocabularyService.getVocabularyEntries(this.vocabularyOptions, this.pageInfo, this.searchText).pipe(
        getFirstSucceededRemoteDataPayload(),
        catchError(() => observableOf(buildPaginatedList(
            new PageInfo(),
            []
          ))
        ),
        tap(() => this.loading = false))
        .subscribe((list: PaginatedList<VocabularyEntry>) => {
          this.optionsList = this.optionsList.concat(list.page);
          this.updatePageInfo(
            list.pageInfo.elementsPerPage,
            list.pageInfo.currentPage,
            list.pageInfo.totalElements,
            list.pageInfo.totalPages
          );
          this.cdr.detectChanges();
        });
    }
  }

  /**
   * Emits a change event and set the current value with the given value.
   * @param event The value to emit.
   */
  onSelect(event) {
    if (this.group) {
      this.group.markAsDirty();
    }
    this.inputValue = null;
    this.change.emit(event);
    this.setCurrentValue(event);
  }

  /**
   * Sets the current value with the given value.
   * @param value The value to set.
   * @param init Representing if is init value or not.
   */
  setCurrentValue(value: any, init = false): void {
    let result: Observable<string>;

    if (isEmpty(value)) {
      result = observableOf('');
    } else if (typeof value === 'string') {
      result = observableOf(value);
    } else {
      result = observableOf(value.display);
    }

    this.currentValue = result;
  }

  ngOnDestroy() {
    this.subSearch.unsubscribe();
  }

  /**
   * Update the page info object
   * @param elementsPerPage
   * @param currentPage
   * @param totalElements
   * @param totalPages
   */
  protected updatePageInfo(elementsPerPage: number, currentPage: number, totalElements?: number, totalPages?: number) {
    this.pageInfo = Object.assign(new PageInfo(), {
      elementsPerPage: elementsPerPage,
      currentPage: currentPage,
      totalElements: totalElements,
      totalPages: totalPages
    });
  }
}
