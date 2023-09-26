import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';

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

  initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * If the current user is a funder Organizational/Project manager
   */
  hasAnyFunderRole: boolean;

  /**
   * If the current user is an administrator
   */
  isAdmin: boolean;

  /**
   * If the current user is a funder project manager
   */
  isFunderProject: boolean;

  /**
   * If the current user is a project reader
   */
  isProjectReader: boolean;

  /**
   * The interimReport displayed on this page
   */
  interimReport: Item;

  /**
   * The parent project community uuid which the subproject belong to
   */
  projectCommunityId: string;

  /**
   * The funding community which the exploitation Plan belong to
   */
  fundingCommunity: Community;

  constructor(
    private authService: AuthService,
    private exploitationPlanStateService: QuestionsBoardStateService,
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

    const hasAnyFunderRole$ = this.route.data.pipe(
      map((data) => (data.isFunderOrganizationalManger || data.isFunderProject || data.isFunderReader) as boolean)
    );

    const isAdmin$ = this.route.data.pipe(
      map((data) => data.isAdmin as boolean)
    );

    const isFunderProject$ = this.route.data.pipe(
      map((data) => (data.isFunderProject) as boolean)
    );

    const isProjectReader$ = this.route.data.pipe(
      map((data) => (data.isProjectReader) as boolean)
    );

    const fundingCommunity$ = this.route.data.pipe(
      map((data) => data.fundingCommunity as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload()
    );

    const projectCommunityId$ = this.route.data.pipe(
      map((data) => data.projectCommunity as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload(),
      map((project: Community) => project.id)
    );

    const interimReportRD$ = this.route.data.pipe(
      map((data) => data.questionsBoard as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService),
      mergeMap((itemRD: RemoteData<Item>) => this.exploitationPlanStateService.isQuestionsBoardLoadedById(itemRD.payload.id).pipe(
        map((loaded) => [itemRD, loaded])
      )),
      tap(([itemRD, loaded]: [RemoteData<Item>, boolean]) => {
        if (!loaded) {
          this.store.dispatch(new InitQuestionsBoardAction(itemRD.payload, environment.interimReport));
        }
      }),
      map(([itemRD, loaded]: [RemoteData<Item>, boolean]) => itemRD)
    );

    combineLatest([fundingCommunity$, projectCommunityId$, interimReportRD$, hasAnyFunderRole$, isFunderProject$, isProjectReader$, isAdmin$])
      .pipe(take(1)
      ).subscribe(([projectItemId, projectCommunityId, interimReportRD, hasAnyFunderRole, isFunderProject, isProjectReader, isAdmin]) => {
      this.fundingCommunity = projectItemId;
      this.projectCommunityId = projectCommunityId;
      this.interimReport = interimReportRD.hasSucceeded ? interimReportRD.payload : null;
      this.hasAnyFunderRole = hasAnyFunderRole;
      this.isAdmin = isAdmin;
      this.isFunderProject = isFunderProject;
      this.isProjectReader = isProjectReader;
      this.initialized.next(true);
    });
  }
}
