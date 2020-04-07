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

import { AUTOCOMPLETE_OFF, isObject } from '@ng-dynamic-forms/core';
import { Observable, of as observableOf, Subject, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  find,
  map,
  merge,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { NgbModal, NgbModalRef, NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

import { AuthorityService } from '../../core/integration/authority.service';

import { IntegrationSearchOptions } from '../../core/integration/models/integration-options.model';
import { hasValue, isEmpty, isNotEmpty, isNotNull } from '../empty.util';
import { FormFieldMetadataValueObject } from '../form/builder/models/form-field-metadata-value.model'
import { ConfidenceType } from '../../core/integration/models/confidence-type';
import { RemoteData } from '../../core/data/remote-data';
import { Authority } from '../../core/integration/models/authority.model';
import { AuthorityTreeviewComponent } from '../authority-treeview/authority-treeview.component';
import { AuthorityEntry } from '../../core/integration/models/authority-entry.model';
import { AuthorityOptions } from '../../core/integration/models/authority-options.model';

@Component({
  selector: 'ds-authority-typeahead',
  styleUrls: ['./authority-typeahead.component.scss'],
  templateUrl: './authority-typeahead.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AuthorityTypeaheadComponent implements OnInit, OnDestroy {
  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() fieldId: string;
  @Input() fieldName: string;
  @Input() authorityOptions: AuthorityOptions;
  @Input() initValue: any;
  @Input() readOnly = false;
  @Input() minChars = 3;
  @Input() placeholder = '';
  @Input() showErrorMessages = false;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('instance', {static: false}) instance: NgbTypeahead;

  autocomplete = AUTOCOMPLETE_OFF;
  searching = false;
  searchOptions: IntegrationSearchOptions;
  searchFailed = false;
  hideSearchingWhenUnsubscribed$ = new Observable(() => () => this.changeSearchingStatus(false));
  click$ = new Subject<string>();
  currentValue: any;
  inputValue: any;
  authority$: Observable<Authority>;
  isHierarchical$: Observable<boolean>;
  preloadLevel: number;

  private subs: Subscription[] = [];

  formatter = (x: { display: string }) => {
    return (typeof x === 'object') ? x.display : x
  };

  search = (text$: Observable<string>) => {
    return text$.pipe(
      merge(this.click$),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.changeSearchingStatus(true)),
      switchMap((term) => {
        if (term === '' || term.length < this.minChars) {
          return observableOf({list: []});
        } else {
          this.searchOptions.query = term;
          return this.authorityService.getEntriesByName(this.searchOptions).pipe(
            map((authorities) => {
              // @TODO Pagination for authority is not working, to refactor when it will be fixed
              return {
                list: authorities.payload,
                pageInfo: authorities.pageInfo
              };
            }),
            tap(() => this.searchFailed = false),
            catchError(() => {
              this.searchFailed = true;
              return observableOf({list: []});
            }));
        }
      }),
      map((results) => results.list),
      tap(() => this.changeSearchingStatus(false)),
      merge(this.hideSearchingWhenUnsubscribed$)
    )
  };

  constructor(private authorityService: AuthorityService,
              private cdr: ChangeDetectorRef,
              private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.currentValue = this.initValue;
    this.searchOptions = new IntegrationSearchOptions(
      this.authorityOptions.scope,
      this.authorityOptions.name,
      this.authorityOptions.metadata);

    this.authority$ = this.authorityService.findById(this.authorityOptions.name).pipe(
      find((result: RemoteData<Authority>) => result.hasSucceeded && !result.isResponsePending),
      map((result: RemoteData<Authority>) => result.payload as Authority)
    );

    this.isHierarchical$ = this.authority$.pipe(
      map((result: Authority) => result.hierarchical)
    );

    this.isHierarchical$.subscribe();
    if (this.group) {
      this.group.get(this.fieldId).valueChanges.pipe(
        filter((value) => this.currentValue !== value))
        .subscribe((value) => {
          this.currentValue = value;
        });
    }
  }

  changeSearchingStatus(status: boolean) {
    this.searching = status;
    this.cdr.detectChanges();
  }

  onInput(event) {
    if (!this.authorityOptions.closed && isNotEmpty(event.target.value)) {
      this.inputValue = new FormFieldMetadataValueObject(event.target.value);
    }
  }

  onBlur(event: Event) {
    if (!this.instance.isPopupOpen()) {
      if (!this.authorityOptions.closed && isNotEmpty(this.inputValue)) {
        if (isNotNull(this.inputValue) && ((isObject(this.inputValue) && this.initValue !== (this.inputValue as any).value)
          || (!isObject(this.inputValue) && this.initValue !== this.inputValue))) {
          this.change.emit(this.inputValue);
        }
        this.inputValue = null;
      }
      this.blur.emit(event);
    } else {
      // prevent on blur propagation if typeahed suggestions are showed
      event.preventDefault();
      event.stopImmediatePropagation();
      // set focus on input again, this is to avoid to lose changes when no suggestion is selected
      (event.target as HTMLInputElement).focus();
    }
  }

  onChange(event: Event) {
    event.stopPropagation();
    if (isEmpty(this.currentValue)) {
      this.change.emit(null);
    }
  }

  onFocus(event) {
    this.focus.emit(event);
  }

  onSelectItem(event: NgbTypeaheadSelectItemEvent) {
    this.inputValue = null;
    this.currentValue = event.item;
    this.change.emit(event.item);
  }

  openTree(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.subs.push(this.authority$.pipe(
      map((authority: Authority) => authority.preloadLevel),
      take(1)
    ).subscribe((preloadLevel) => {
      const modalRef: NgbModalRef = this.modalService.open(AuthorityTreeviewComponent, { size: 'lg', windowClass: 'treeview' });
      modalRef.componentInstance.searchOptions = this.searchOptions;
      modalRef.componentInstance.preloadLevel = preloadLevel;
      modalRef.componentInstance.selectedItem = this.currentValue ? this.currentValue : '';
      modalRef.result.then((result: AuthorityEntry) => {
        if (result) {
          this.currentValue = result;
          this.change.emit(result);
        }
      }, () => {
        return;
      });
    }))
  }

  public whenClickOnConfidenceNotAccepted(confidence: ConfidenceType) {
    if (!this.readOnly) {
      this.click$.next(this.formatter(this.currentValue));
    }
  }

  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

}
