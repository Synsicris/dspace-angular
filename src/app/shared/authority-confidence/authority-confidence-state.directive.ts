import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

import { findIndex } from 'lodash';

import { VocabularyEntry } from '../../core/submission/vocabularies/models/vocabulary-entry.model';
import { FormFieldMetadataValueObject } from '../form/builder/models/form-field-metadata-value.model';
import { ConfidenceType } from '../../core/shared/confidence-type';
import { isNotEmpty, isNull } from '../empty.util';
import { ConfidenceIconConfig } from '../../../config/submission-config.interface';
import { environment } from '../../../environments/environment';
import { VocabularyEntryDetail } from '../../core/submission/vocabularies/models/vocabulary-entry-detail.model';
import { TranslateService } from '@ngx-translate/core';

/**
 * Directive to add to the element a bootstrap utility class based on metadata confidence value
 */
@Directive({
  selector: '[dsAuthorityConfidenceState]'
})
export class AuthorityConfidenceStateDirective implements OnChanges, AfterViewInit {

  /**
   * The metadata value
   */
  @Input() authorityValue: VocabularyEntry | FormFieldMetadataValueObject | string;

  /**
   * A boolean representing if to show html icon if authority value is empty
   */
  @Input() visibleWhenAuthorityEmpty = true;

  /**
   * The css class applied before directive changes
   */
  private previousClass: string = null;

  /**
   * The css class applied after directive changes
   */
  private newClass: string;

  /**
   * An event fired when click on element that has a confidence value empty or different from CF_ACCEPTED
   */
  @Output() whenClickOnConfidenceNotAccepted: EventEmitter<ConfidenceType> = new EventEmitter<ConfidenceType>();

  /**
   * Listener to click event
   */
  @HostListener('click') onClick() {
    if (isNotEmpty(this.authorityValue)) {
      this.whenClickOnConfidenceNotAccepted.emit(this.getConfidenceByValue(this.authorityValue));
    }
  }

  /**
   * Initialize instance variables
   *
   * @param {ElementRef} elem
   * @param {Renderer2} renderer
   * @param {TranslateService} translate
   */
  constructor(
    private elem: ElementRef,
    private renderer: Renderer2,
    private translate: TranslateService
  ) {
    // show the cursor pointer on hover
    this.elem.nativeElement.classList.add('authority-confidence-clickable');
  }

  /**
   * Listener to hover event
   */
  @HostListener('mouseover') onHover() {
    this.renderer.setAttribute(
      this.elem.nativeElement,
      'title',
      this.translate.instant('authority-confidence.search-label')
    );
  }

  /**
   * Apply css class to element whenever authority value change
   *
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.authorityValue.firstChange) {
      this.previousClass = this.getClassByConfidence(this.getConfidenceByValue(changes.authorityValue.previousValue));
    }
    this.newClass = this.getClassByConfidence(this.getConfidenceByValue(changes.authorityValue.currentValue));

    if (isNull(this.previousClass)) {
      this.renderer.addClass(this.elem.nativeElement, this.newClass);
    } else if (this.previousClass !== this.newClass) {
      this.renderer.removeClass(this.elem.nativeElement, this.previousClass);
      this.renderer.addClass(this.elem.nativeElement, this.newClass);
    }
  }

  /**
   * Apply css class to element after view init
   */
  ngAfterViewInit() {
    if (isNull(this.previousClass)) {
      this.renderer.addClass(this.elem.nativeElement, this.newClass);
    } else if (this.previousClass !== this.newClass) {
      this.renderer.removeClass(this.elem.nativeElement, this.previousClass);
      this.renderer.addClass(this.elem.nativeElement, this.newClass);
    }
  }

  /**
   * Return confidence value as ConfidenceType
   *
   * @param value
   */
  private getConfidenceByValue(value: any): ConfidenceType {
    let confidence: ConfidenceType = ConfidenceType.CF_UNSET;

    if (isNotEmpty(value) && (value instanceof VocabularyEntry || value instanceof VocabularyEntryDetail)
      && value.hasAuthority()) {
      confidence = ConfidenceType.CF_ACCEPTED;
    }

    if (isNotEmpty(value) && value instanceof FormFieldMetadataValueObject) {
      confidence = value.confidence;
    }

    return confidence;
  }

  /**
   * Return the properly css class based on confidence value
   *
   * @param confidence
   */
  private getClassByConfidence(confidence: any): string {
    if (!this.visibleWhenAuthorityEmpty && confidence === ConfidenceType.CF_UNSET) {
      return 'd-none';
    }

    const confidenceIcons: ConfidenceIconConfig[] = environment.submission.icons.authority.confidence;

    const confidenceIndex: number = findIndex(confidenceIcons, {value: confidence});

    const defaultConfidenceIndex: number = findIndex(confidenceIcons, {value: 'default' as any});
    const defaultClass: string = (defaultConfidenceIndex !== -1) ? confidenceIcons[defaultConfidenceIndex].style : '';

    return (confidenceIndex !== -1) ? confidenceIcons[confidenceIndex].style : defaultClass;
  }

}
