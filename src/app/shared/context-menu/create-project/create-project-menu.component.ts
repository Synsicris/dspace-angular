import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { PERSON_ENTITY } from '../../../core/project/project-data.service';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { Item } from '../../../core/shared/item.model';
import { CreateProjectComponent } from '../../../projects/create-project/create-project.component';
import { ProjectAuthorizationService } from '../../../core/project/project-authorization.service';
import { hasValue } from '../../empty.util';

/**
 * This component renders a context menu option that provides to export an item.
 */
@Component({
  selector: 'ds-context-menu-audit-item',
  templateUrl: './create-project-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
export class CreateProjectMenuComponent extends ContextMenuEntryComponent implements OnInit, OnDestroy {

  /**
   * A boolean representing if user can create a new project
   */
  canCreateProject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Representing if deletion is processing
   */
  public processing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  private subs: Subscription[] = [];

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {NgbModal} modalService
   * @param {ProjectAuthorizationService} projectAuthorizationService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected modalService: NgbModal,
    protected projectAuthorizationService: ProjectAuthorizationService,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.CreateProject);
  }

  ngOnInit(): void {
    this.subs.push(
      this.projectAuthorizationService.canCreateProject().pipe(
        take(1)
      ).subscribe((canCreateProject: boolean) => {
        this.canCreateProject$.next(canCreateProject);
      })
    );
  }

  /**
   * Open creation project modal
   */
  openCreateProjectModal() {
    this.modalService.open(CreateProjectComponent);
  }

  /**
   * Check if user has permission to create a new project
   */
  canCreateProject(): Observable<boolean> {
    return this.canCreateProject$.asObservable();
  }

  /**
   * Check if current Item is a Person
   */
  canShow() {
    return (this.contextMenuObject as Item).entityType === PERSON_ENTITY;
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

}
