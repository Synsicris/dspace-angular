import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteData } from '../core/data/remote-data';
import { getFirstSucceededRemoteDataPayload, redirectOn4xx } from '../core/shared/operators';
import { Community } from '../core/shared/community.model';
import { AuthService } from '../core/auth/auth.service';

export const PROJECT_PAGE = 'project-overview';
export const PROJECT_ROUTE = '/' + PROJECT_PAGE;

@Component({
  selector: 'ds-project-overview-page',
  templateUrl: './project-overview-page.component.html',
  styleUrls: ['./project-overview-page.component.scss']
})
export class ProjectOverviewPageComponent implements OnInit {

  /**
   * The project displayed on this page
   */
  projectRD$: Observable<RemoteData<Community>>;

  /**
   * The project displayed on this page
   */
  projectUUID$: Observable<string>;

  constructor(protected route: ActivatedRoute, protected authService: AuthService, protected router: Router) {
  }

  ngOnInit(): void {
    this.projectRD$ = this.route.data.pipe(
      map((data) => data.project as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService)
    );

    this.projectUUID$ = this.projectRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((project: Community) => project.id)
    );
  }
}
