import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { Community } from '../core/shared/community.model';
import { AuthService } from '../core/auth/auth.service';
import { QuestionsBoardStateService } from '../questions-board/core/questions-board-state.service';
import { ProjectDataService } from '../core/project/project-data.service';
import { AppState } from '../app.reducer';
import { redirectOn4xx } from '../core/shared/authorized.operators';
import { getFirstSucceededRemoteDataPayload } from '../core/shared/operators';
import { InitQuestionsBoardAction } from '../questions-board/core/questions-board.actions';
import { environment } from '../../environments/environment';

@Component({
  selector: 'ds-interim-report-page',
  templateUrl: './interim-report-page.component.html',
  styleUrls: ['./interim-report-page.component.scss']
})
export class InterimReportPageComponent implements OnInit {

  /**
   * If the current user is a funder Organizational/Project manager
   */
  hasAnyFunderRole$: Observable<boolean>;

  /**
   * If the current user is a funder project manager
   */
  isFunderProject$: Observable<boolean>;

  /**
   * The project displayed on this page
   */
  interimReportRD$: Observable<RemoteData<Item>>;

  /**
   * The parent project community uuid which the subproject belong to
   */
  projectCommunityId$: Observable<string>;

  /**
   * The funding community which the exploitation Plan belong to
   */
  fundingCommunity$: Observable<Community>;

  constructor(
    private authService: AuthService,
    private questionsBoardStateService: QuestionsBoardStateService,
    private projectService: ProjectDataService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
  }

  /**
   * Initialize instance variables
   */
  ngOnInit(): void {

    this.hasAnyFunderRole$ = this.route.data.pipe(
      map((data) => (data.isFunderOrganizationalManger || data.isFunderProject || data.isFunderReader) as boolean)
    );

    this.isFunderProject$ = this.route.data.pipe(
      map((data) => (data.isFunderProject) as boolean)
    );

    this.fundingCommunity$ = this.route.data.pipe(
      map((data) => data.fundingCommunity as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload()
    );

    this.projectCommunityId$ = this.route.data.pipe(
      map((data) => data.projectCommunity as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload(),
      map((project: Community) => project.id)
    );

    this.interimReportRD$ = this.route.data.pipe(
      map((data) => data.questionsBoard as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService),
      mergeMap((itemRD: RemoteData<Item>) => this.questionsBoardStateService.isQuestionsBoardLoadedById(itemRD.payload.id).pipe(
        map((loaded) => [itemRD, loaded])
      )),
      tap(([itemRD, loaded]: [RemoteData<Item>, boolean]) => {
        if (!loaded) {
          this.store.dispatch(new InitQuestionsBoardAction(itemRD.payload, environment.interimReport));
        }
      }),
      map(([itemRD, loaded]: [RemoteData<Item>, boolean]) => itemRD)
    );
  }
}
