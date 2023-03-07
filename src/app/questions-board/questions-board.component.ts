import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { Item } from '../core/shared/item.model';
import { Community } from '../core/shared/community.model';
import { QuestionsBoardStateService } from './core/questions-board-state.service';
import { QuestionsBoardStep } from './core/models/questions-board-step.model';
import { hasValue } from '../shared/empty.util';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ds-questions-board',
  templateUrl: './questions-board.component.html',
  styleUrls: ['./questions-board.component.scss']
})
export class QuestionsBoardComponent implements OnInit, OnDestroy {
  /**
   * If the current user is a funder Organizational/Project manager
   */
  @Input() isFunder: boolean;

  /**
   * The prefix to use for the i19n keys
   */
  @Input() messagePrefix: string;

  /**
   * The questions board object item
   */
  @Input() questionsBoardObject: Item;

  /**
   * The project community id which the subproject belong to
   */
  @Input() public projectCommunityId: string;

  /**
   * The funding community which the questions board belong to
   */
  @Input() fundingCommunity: Community;

  public questionsBoardObjectId: string;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  private subs: Subscription[] = [];

  /**
   * A boolean representing if compare mode is active
   */
  compareMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The list of questions board steps
   */
  questionsBoardStep$: BehaviorSubject<QuestionsBoardStep[]> = new BehaviorSubject<[]>([]);

  /**
   * A boolean representing if item is a version of original item
   */
  public isVersionOfAnItem$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    protected questionsBoardStateService: QuestionsBoardStateService,
    protected aroute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.questionsBoardObjectId = this.questionsBoardObject?.id;

    this.subs.push(
      this.questionsBoardStateService.isCompareModeActive()
        .subscribe((compareMode: boolean) => this.compareMode.next(compareMode)),
      this.questionsBoardStateService.getQuestionsBoardStep(this.questionsBoardObjectId).pipe(
        filter((steps: QuestionsBoardStep[]) => steps?.length > 0)
      ).subscribe((steps: QuestionsBoardStep[]) => {
        this.questionsBoardStep$.next(steps);
      })
    );

    this.aroute.data.pipe(
      map((data) => data.isVersionOfAnItem),
      filter((isVersionOfAnItem) => isVersionOfAnItem === true),
      take(1)
    ).subscribe((isVersionOfAnItem: boolean) => {
      this.isVersionOfAnItem$.next(isVersionOfAnItem);
    });

  }

  getQuestionsBoardStep(): Observable<QuestionsBoardStep[]> {
    return this.questionsBoardStep$.asObservable();
  }

  isLoading(): Observable<boolean> {
    return this.questionsBoardStateService.isQuestionsBoardLoaded().pipe(
      map((loaded: boolean) => !loaded)
    );
  }

  /**
   * Dispatch initialization of comparing mode
   *
   * @param selected
   */
  onVersionSelected(selected: { base: Item, comparing: Item }) {
    this.questionsBoardStateService.dispatchInitCompare(selected.base?.id, selected.comparing.id);
  }

  /**
   * Dispatch cleaning of comparing mode
   */
  onVersionDeselected() {
    this.questionsBoardStateService.dispatchStopCompare(this.questionsBoardObject?.id);
  }

  /**
   * When destroy component clear all collapsed values.
   */
  ngOnDestroy() {
    this.questionsBoardStateService.dispatchClearClearQuestionBoard();

    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
