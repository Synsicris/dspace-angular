import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import { getFirstSucceededRemoteDataPayload, redirectToPageNotFoundOn404 } from '../core/shared/operators';

@Component({
  selector: 'ipw-working-plan-page',
  templateUrl: './working-plan-page.component.html'
})
export class WorkingPlanPageComponent implements OnInit {
  /**
   * The project's id
   */
  projectId$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  /**
   * Initialize instance variables
   */
  ngOnInit(): void {
    this.projectId$ = this.route.data.pipe(
      map((data) => data.project as RemoteData<Community>),
      redirectToPageNotFoundOn404(this.router),
      getFirstSucceededRemoteDataPayload(),
      map((project: Community) => project.id)
    );
  }
}
