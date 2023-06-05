import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  BehaviorSubject,
  combineLatest,
  fromEvent,
  Observable,
  of as observableOf,
  OperatorFunction,
  Subscription
} from 'rxjs';
import { delay, filter, map, mergeMap, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import { NgbAccordion, NgbModal, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathway } from '../../core/models/impact-pathway.model';
import { NativeWindowRef, NativeWindowService } from '../../../core/services/window.service';
import { ImpactPathwayLink } from '../../core/impact-pathway.reducer';
import { ImpactPathwayLinksService } from '../../core/impact-pathway-links.service';
import { ImpactPathwayService } from '../../core/impact-pathway.service';
import { ImpactPathwayStep } from '../../core/models/impact-pathway-step.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { Item } from '../../../core/shared/item.model';
import { SubmissionFormModel } from '../../../core/config/models/config-submission-form.model';
import { EditSimpleItemModalComponent } from '../../../shared/edit-simple-item-modal/edit-simple-item-modal.component';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { EditItemDataService } from '../../../core/submission/edititem-data.service';
import { environment } from '../../../../environments/environment';
import { VersionSelectedEvent } from '../../../shared/item-version-list/item-version-list.component';
import { ItemDataService } from '../../../core/data/item-data.service';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { administratorRole, AlertRole, getProgrammeRoles } from '../../../shared/alert/alert-role/alert-role';
import { ProjectAuthorizationService } from '../../../core/project/project-authorization.service';
import { isEqual } from 'lodash';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Component({
  selector: 'ds-impact-path-way',
  styleUrls: ['./impact-path-way.component.scss'],
  templateUrl: './impact-path-way.component.html'
})
export class ImpactPathWayComponent implements AfterContentChecked, OnInit, OnDestroy {
  /**
   * If the current user is a funder Organizational/Project manager
   */
  @Input() hasAnyFunderRole: boolean;

  /**
   * If the current user is a funder project manager
   */
  @Input() isFunderProject: boolean;

  /**
   * The project community's id
   */
  @Input() public projectCommunityId: string;

  /**
   * The project item's id
   */
  @Input() public projectItemId: string;

  @Input() public impactPathway: ImpactPathway;

  /**
   * The impact-pathway item
   */
  @Input() impactPathWayItem: Item;
  @Input() isProcessing: boolean;

  @ViewChild('accordionRef', { static: false }) wrapper: NgbAccordion;

  formConfig$: Observable<SubmissionFormModel>;
  canDeleteImpactPathway$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  canShowRelations: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  loadedArrows: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isPrinting$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  private subs: Subscription[] = [];

  /**
   * The compare item object
   */
  compareItem$: BehaviorSubject<Item> = new BehaviorSubject<Item>(null);

  /**
   * A boolean representing if compare mode is active
   */
  compareMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * A boolean representing if edit/add buttons are active
   */
  canEditButton$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * A boolean representing if item is a version of original item
   */
  public isVersionOfAnItem$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public compareProcessing$: Observable<boolean> = observableOf(false);
  public impactPathwayStepEntityType: string;
  public funderRoles: AlertRole[];
  public dismissRole: AlertRole;
  public isProcessingRemove$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public disableDelete$ = new BehaviorSubject<boolean>(false);
  public disableEdit$ = new BehaviorSubject<boolean>(false);

  /**
   * The flag to indicate if the comment accordion is open
   */
  public isCommentAccordionOpen = false;

  constructor(@Inject(NativeWindowService) protected _window: NativeWindowRef,
              private authorizationService: AuthorizationDataService,
              private projectAuthorizationService: ProjectAuthorizationService,
              private cdr: ChangeDetectorRef,
              private impactPathwayService: ImpactPathwayService,
              private impactPathwayLinksService: ImpactPathwayLinksService,
              private itemService: ItemDataService,
              private modalService: NgbModal,
              protected aroute: ActivatedRoute,
              private router: Router,
              protected editItemDataService: EditItemDataService) {
  }

  ngOnInit() {
    this.compareProcessing$ = this.impactPathwayService.isCompareProcessing();
    this.formConfig$ = this.impactPathwayService.getImpactPathwayFormConfig();
    this.impactPathwayService.retrieveObjectItem(this.impactPathway.id).pipe(
      mergeMap((item: Item) => this.authorizationService.isAuthorized(FeatureID.CanDelete, item.self, undefined)),
      take(1)
    ).subscribe((canDelete) => this.canDeleteImpactPathway$.next(canDelete));

    this.subs.push(
      this.impactPathwayService.isCompareModeActive()
        .subscribe((compareMode: boolean) => this.compareMode.next(compareMode)),
      this.impactPathwayService.getCompareImpactPathwayId().pipe(
        switchMap((id: string) => {
          if (isNotEmpty(id)) {
            return this.itemService.findById(id).pipe(
              getFirstCompletedRemoteData(),
              map((itemRD: RemoteData<Item>) => {
                return itemRD.hasSucceeded ? itemRD.payload : null;
              })
            );
          } else {
            return observableOf(null);
          }
        })
      ).subscribe((item: Item) => {

        this.compareItem$.next(item);
      })
    );
    this.subs.push(
      this.impactPathwayService.isRemoving().subscribe(val => this.isProcessingRemove$.next(val))
    );

    this.subs.push(
      combineLatest([this.isProcessingRemove$, this.compareMode, this.isVersionOfAnItem$])
        .subscribe(([isProcessing, isComparing, isVersion]) =>
          this.disableDelete$.next(isProcessing || isComparing || isVersion)
        )
    );

    this.subs.push(
      combineLatest([this.isProcessingRemove$, this.compareMode, this.isVersionOfAnItem$, this.canEditButton$])
        .subscribe(([isProcessing, isComparing, isVersion, canEdit]) =>
          this.disableEdit$.next(isProcessing || isComparing || isVersion || !canEdit)
        )
    );

    this.editItemDataService.checkEditModeByIdAndType(this.impactPathway.id, environment.impactPathway.impactPathwaysEditMode).pipe(
      take(1)
    ).subscribe((canEdit: boolean) => {
      this.canEditButton$.next(canEdit);
    });

    this.aroute.data.pipe(
      map((data) => data.isVersionOfAnItem),
      filter((isVersionOfAnItem) => isVersionOfAnItem === true),
      take(1)
    ).subscribe((isVersionOfAnItem: boolean) => {
      this.isVersionOfAnItem$.next(isVersionOfAnItem);
    });

    const params$ =
      this.aroute.queryParams
        .pipe(
          filter(params => isNotEmpty(params))
        );

    this.subs.push(
      this.isPrinting$
        .pipe(
          filter(isPrinting => isPrinting === true),
          this.reloadArrows()
        )
        .subscribe(() => this._window.nativeWindow.print())
    );

    this.subs.push(
      fromEvent(this._window.nativeWindow, 'beforeprint')
        .subscribe((event: Event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.onPrint();
        }),
      fromEvent(this._window.nativeWindow, 'afterprint')
        .pipe(
          delay(100),
          withLatestFrom(this.isPrinting$),
          filter(([, isPrinting]) => isPrinting === true),
          switchMap(() => fromPromise(this.router.navigate([], { queryParams: { view: 'default' } }))),
          this.reloadArrows()
        ).subscribe(() => this.isPrinting$.next(false))
    );

    this.subs.push(
      params$
        .pipe(
          map(params => params?.print),
          filter(printParam => isEqual(printParam, 'true') && this._window.nativeWindow)
        )
        .subscribe(() => this.isPrinting$.next(true))
    );

    this.impactPathwayStepEntityType = environment.impactPathway.impactPathwayStepEntity;
    this.funderRoles = getProgrammeRoles(this.impactPathWayItem, this.projectAuthorizationService);
    this.dismissRole = administratorRole(this.projectAuthorizationService);
  }

  ngAfterContentChecked() {
    if (this._window.nativeWindow) {
      this.cdr.detectChanges();
      this.loadedArrows.next(true);
    }

  }

  reloadArrows(): OperatorFunction<any, any> {
    return source =>
      source.pipe(
        tap(() => this.loadedArrows.next(false)),
        delay(1),
        tap(() => this.loadedArrows.next(true)),
        delay(1),
      );
  }

  getRelations(): Observable<ImpactPathwayLink[]> {
    return this.impactPathwayLinksService.getAllLinks();
  }

  isOpen(): boolean {
    return this.wrapper && this.wrapper.activeIds.includes(this.impactPathway.id);
  }

  isProcessingRemove(): Observable<boolean> {
    return this.impactPathwayService.isRemoving();
  }

  /**
   * Dispatch a dispatchRemoveImpactPathwayAction
   */
  public confirmRemove(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.impactPathwayService.dispatchRemoveImpactPathwayAction(this.projectItemId, this.impactPathway.id);
        }
      }
    );
  }

  /**
   * Get the edit item mode
   */
  getEditMode(): string {
    return this.impactPathwayService.getImpactPathwaysEditMode();
  }

  /**
   * Return all impactPathway step ids
   */
  getImpactPathwayStepIds(): string[] {
    return this.impactPathway.steps.map((step: ImpactPathwayStep) => step.id);
  }

  /**
   * Get the path to metadata section to patch
   */
  getSectionName() {
    return this.impactPathwayService.getImpactPathwaysEditFormSection();
  }

  openEditModal() {
    const modalRef = this.modalService.open(EditSimpleItemModalComponent, { size: 'lg' });
    modalRef.componentInstance.editMode = this.impactPathwayService.getImpactPathwaysEditMode();
    modalRef.componentInstance.formSectionName = this.impactPathwayService.getImpactPathwaysEditFormSection();
    modalRef.componentInstance.formConfig = this.impactPathwayService.getImpactPathwayFormConfig();
    modalRef.componentInstance.itemId = this.impactPathway.id;

    modalRef.componentInstance.itemUpdate.subscribe((item: Item) => this.updateImpactPathway(item));
  }

  /**
   * Update impact-pathway object from given item
   * @param item
   */
  updateImpactPathway(item) {
    this.impactPathway = this.impactPathwayService.updateImpactPathway(item, this.impactPathway);
    this.impactPathwayService.dispatchUpdateImpactPathway(
      this.impactPathway.id,
      this.impactPathway
    );
  }

  /**
   * Dispatch initialization of comparing mode
   *
   * @param selected
   */
  onVersionSelected(selected: VersionSelectedEvent) {
    this.impactPathwayService.dispatchInitCompare(selected.base.id, selected.comparing.id, selected.active.id);
  }

  /**
   * Dispatch cleaning of comparing mode
   */
  onVersionDeselected() {
    this.impactPathwayService.dispatchStopCompare(this.impactPathway.id);
  }

  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
  /**
   * Jump Marker to scroll down to the description field (230429 rex)
   */
  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
}

  getCompareItemDescription(item: Item): string {
    return item?.firstMetadataValue('dc.description');
  }

  /**
   * Change the flag isCommentAccordionOpen when the accordion state changes
   * @param event NgbPanelChangeEvent
   */
  changeAccordionState(event: NgbPanelChangeEvent) {
    this.isCommentAccordionOpen = event.nextState;
  }

  /**
   * On print button click
   * add query param to url
   * and reload the page to upload print styles
   */
  onPrint() {
    this.router.navigate([], { queryParams: { view: 'print', print: true } });
  }
}
