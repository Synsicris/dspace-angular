import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Item } from '../core/shared/item.model';
import { ProjectAuthorizationService } from '../core/project/project-authorization.service';

@Component({
  selector: 'ds-project-manage-version',
  templateUrl: './project-manage-version.component.html',
  styleUrls: ['./project-manage-version.component.scss']
})
/**
 * Component that displays the version list information as a coordinator or founder of the project
 */
export class ProjectManageVersionComponent implements OnInit {

  /**
   * A boolean representing the item version of the project entity being managed
   */
  item$: BehaviorSubject<Item> = new BehaviorSubject<Item>(null);

  /**
   * A boolean representing if user is coordinator or founder for the current project
   */
  public isCoordinatorOfProject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  /**
   * A boolean representing if user is coordinator or founder for the current project
   */
  public isFounderOfProject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(
    protected authorizationService: ProjectAuthorizationService,
    protected router: ActivatedRoute) {

  }

  ngOnInit(): void {
    const item$ = this.router.data.pipe(
      map((data: Params) => data.item.payload)
    );
    const isCoordinator$ = item$.pipe(
      switchMap((item: Item) => this.authorizationService.isCoordinator(item))
    );
    const isFunderOfProject$ = item$.pipe(
      switchMap((item: Item) => this.authorizationService.isFunderProjectManager(item))
    );

    combineLatest([item$, isCoordinator$, isFunderOfProject$])
      .subscribe(([item, isCoordinator, isFunderOfProject]) => {
        console.log(item, isCoordinator, isFunderOfProject);
        this.item$.next(item);
        this.isCoordinatorOfProject$.next(isCoordinator);
        this.isFounderOfProject$.next(isFunderOfProject);
      });
  }

}
