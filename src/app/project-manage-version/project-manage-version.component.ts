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
   * A boolean representing if user is founder for the current project
   */
  public isFounderOfProject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  /**
   * A boolean representing if user is funder organizational manager or reader for the current project
   */
  public isFounderManagerOrReaderOfProject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  /**
   * A boolean representing if user is reader of the current project
   */
  public isProjectReader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

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

    const isFunderManagerOfProject$ = item$.pipe(
      switchMap((item: Item) => this.authorizationService.isFunderOrganizationalManagerOfProgramme(item))
    );

    const isFunderReaderOfProject$ = item$.pipe(
      switchMap((item: Item) => this.authorizationService.isFunderReaderOfProgramme(item))
    );

    const isProjectReader$ = item$.pipe(
      switchMap((item: Item) => this.authorizationService.isProjectReader(item))
    );

    combineLatest([item$, isCoordinator$, isFunderOfProject$, isFunderManagerOfProject$, isFunderReaderOfProject$, isProjectReader$])
      .subscribe(([item, isCoordinator, isFunderOfProject, isFunderManagerOfProject, isFunderReaderOfProject, isProjectReader]) => {
        this.item$.next(item);
        this.isCoordinatorOfProject$.next(isCoordinator);
        this.isFounderOfProject$.next(isFunderOfProject);
        this.isFounderManagerOrReaderOfProject$.next(isFunderManagerOfProject || isFunderReaderOfProject);
        this.isProjectReader$.next(isProjectReader);
      });
  }

}
