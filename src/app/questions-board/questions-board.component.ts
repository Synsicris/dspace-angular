import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { isEqual } from 'lodash';

import { Item } from '../core/shared/item.model';
import { Community } from '../core/shared/community.model';
import { QuestionsBoardStateService } from './core/questions-board-state.service';
import { QuestionsBoardStep } from './core/models/questions-board-step.model';
import { hasValue } from '../shared/empty.util';
import { ActivatedRoute } from '@angular/router';
import { VersionSelectedEvent } from '../shared/item-version-list/item-version-list.component';
import { AlertRole, getProgrammeRoles } from '../shared/alert/alert-role/alert-role';
import { ProjectAuthorizationService } from '../core/project/project-authorization.service';

@Component({
  selector: 'ds-questions-board',
  templateUrl: './questions-board.component.html',
  styleUrls: ['./questions-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionsBoardComponent implements OnInit, OnDestroy {
  /**
   * If the current user is a funder Organizational/Project manager
   */
  @Input() hasAnyFunderRole: boolean;

  /**
   * If the current user is a funder project manager
   */
  @Input() isFunderProject: boolean;

  /**
   * The prefix to use for the i18n keys
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

  /**
   * Flag to check the display of upload step
   */
  @Input() showUploadStep = false;

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
  questionsBoardStep$: Observable<QuestionsBoardStep[]>;

  /**
   * A boolean representing if item is a version of original item
   */
  public isVersionOfAnItem$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public funderRoles: AlertRole[];

  constructor(
    protected questionsBoardStateService: QuestionsBoardStateService,
    protected aroute: ActivatedRoute,
    private projectAuthorizationService: ProjectAuthorizationService
  ) {
  }

  ngOnInit(): void {
    this.questionsBoardObjectId = this.questionsBoardObject?.id;
    this.questionsBoardStep$ = this.questionsBoardStateService.getQuestionsBoardStep(this.questionsBoardObjectId);
    this.subs.push(
      this.questionsBoardStateService.isCompareModeActive()
        .subscribe((compareMode: boolean) => this.compareMode.next(compareMode))
    );

    this.aroute.data.pipe(
      map((data) => data.isVersionOfAnItem),
      filter((isVersionOfAnItem) => isVersionOfAnItem === true),
      take(1)
    ).subscribe((isVersionOfAnItem: boolean) => {
      this.isVersionOfAnItem$.next(isVersionOfAnItem);
    });

    this.funderRoles = getProgrammeRoles(this.questionsBoardObject, this.projectAuthorizationService);
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
  onVersionSelected(selected: VersionSelectedEvent) {
    this.questionsBoardStateService.dispatchInitCompare(selected.base?.id, selected.comparing.id, selected.active.id);
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
