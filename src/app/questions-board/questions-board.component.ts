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
   * The exploitation-plan/interim-report item
   */
  @Input() questionsBoardObject: Item;

  /**
   * The project community id which the subproject belong to
   */
  @Input() public projectCommunityId: string;

  /**
   * The funding community which the exploitation Plan belong to
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
   * A boolean representing if item is a version of original item
   */
  public isVersionOfAnItem$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    protected exploitationPlanStateService: QuestionsBoardStateService,
    protected aroute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.questionsBoardObjectId = this.questionsBoardObject?.id;

    this.subs.push(
      this.exploitationPlanStateService.isCompareModeActive()
        .subscribe((compareMode: boolean) => this.compareMode.next(compareMode))
    );

    this.aroute.data.pipe(
      map((data) => data.isVersionOfAnItem),
      filter((isVersionOfAnItem) => isVersionOfAnItem === true),
      take(1)
    ).subscribe((isVersionOfAnItem: boolean) => {
      this.isVersionOfAnItem$.next(isVersionOfAnItem);
    });

  }

  getExploitationPlanStep(): Observable<QuestionsBoardStep[]> {
    return this.exploitationPlanStateService.getExploitationPlanStep(this.questionsBoardObjectId);
  }

  isLoading(): Observable<boolean> {
    return this.exploitationPlanStateService.isExploitationPlanLoaded().pipe(
      map((loaded: boolean) => !loaded)
    );
  }

  /**
   * Dispatch initialization of comparing mode
   *
   * @param version
   */
  onVersionSelected(version: Item) {
    this.exploitationPlanStateService.dispatchInitCompare(this.questionsBoardObject?.id, version.id, this.isVersionOfAnItem$.value);
  }

  /**
   * Dispatch cleaning of comparing mode
   */
  onVersionDeselected() {
    this.exploitationPlanStateService.dispatchStopCompare(this.questionsBoardObject?.id);
  }

  /**
   * When destroy component clear all collapsed values.
   */
  ngOnDestroy() {
    this.exploitationPlanStateService.dispatchClearCollapsable();

    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
