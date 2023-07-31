import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { trigger } from '@angular/animations';

import uniqueId from 'lodash/uniqueId';

import { AlertType } from './aletr-type';
import { fadeOutLeave, fadeOutState } from '../animations/fade';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';

/**
 * This component allow to create div that uses the Bootstrap's Alerts component.
 */
@Component({
  selector: 'ds-alert',
  animations: [
    trigger('enterLeave', [
      fadeOutLeave, fadeOutState,
    ])
  ],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  /**
   * The alert content
   */
  content$ = new BehaviorSubject<string>(null);

  @Input()
  set content(content: string) {
    this.content$.next(content);
  }

  get content(): string | null {
    return this.content$.value;
  }

  /**
   * A boolean representing if alert is collapsible
   */
  @Input() collapsible = true;

  /**
   * A boolean representing if alert is rendered already collapsed
   */
  @Input() collapsed = true;

  /**
   * A boolean representing if alert is dismissible
   */
  @Input() dismissible = false;

  /**
   * The alert type
   */
  @Input() type: AlertType|string = 'alert-info';

  /**
   * A string used as id for trunctable-part
   */
  @Input() truncatableId: string;

  /**
   * An event fired when alert is dismissed.
   */
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  /**
   * The initial animation name
   */
  public animate$ = new BehaviorSubject<string>('fadeIn');

  /**
   * A boolean representing if alert is dismissed or not
   */
  public isDismissed$ = new BehaviorSubject<boolean>(false);

  /**
   * A boolean representing if alert is collapsed or not
   */
  public isCollapsed = false;

  /**
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} cdr
   */
  constructor(private cdr: ChangeDetectorRef) {
  }

  /**
   * Initialize the component
   */
  ngOnInit() {
    this.isCollapsed = this.collapsed;
    if (this.truncatableId == null) {
      this.truncatableId = uniqueId('alert-trunc-id-');
    }
  }

  /**
   * Dismiss div with animation
   */
  dismiss() {
    if (this.dismissible) {
      this.animate$
        .pipe(
          debounceTime(200),
          take(1)
        ).subscribe(() => {
        this.isDismissed$.next(true);
        this.close.emit();
      });
      this.animate$.next('fadeOut');
    }
  }

  /**
   * Toggle collapsible text
   */
  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }
}
