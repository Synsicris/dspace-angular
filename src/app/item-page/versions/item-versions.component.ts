import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Item } from '../../core/shared/item.model';
import { Version } from '../../core/shared/version.model';
import { RemoteData } from '../../core/data/remote-data';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of, shareReplay, Subscription, } from 'rxjs';
import { VersionHistory } from '../../core/shared/version-history.model';
import {
  getAllSucceededRemoteData,
  getAllSucceededRemoteDataPayload,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload
} from '../../core/shared/operators';
import { map, mergeMap, startWith, switchMap, take, tap } from 'rxjs/operators';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { VersionHistoryDataService } from '../../core/data/version-history-data.service';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { AlertType } from '../../shared/alert/aletr-type';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { hasValue, hasValueOperator, isEmpty, isNull, isUndefined } from '../../shared/empty.util';
import { PaginationService } from '../../core/pagination/pagination.service';
import { getItemEditVersionhistoryRoute, getItemPageRoute, getItemVersionRoute } from '../item-page-routing-paths';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemVersionsSummaryModalComponent } from './item-versions-summary-modal/item-versions-summary-modal.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { ItemVersionsDeleteModalComponent } from './item-versions-delete-modal/item-versions-delete-modal.component';
import { VersionDataService } from '../../core/data/version-data.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { Router } from '@angular/router';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { ItemVersionsSharedService } from './item-versions-shared.service';
import { WorkspaceItem } from '../../core/submission/models/workspaceitem.model';
import { WorkspaceitemDataService } from '../../core/submission/workspaceitem-data.service';
import { WorkflowItemDataService } from '../../core/submission/workflowitem-data.service';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import {
  ItemVersionsVisibilityModalComponent
} from '../../shared/item/item-versions/item-versions-visibility-modal/item-versions-visibility-modal.component';
import { MetadataMap, MetadataValue } from '../../core/shared/metadata.models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ds-item-versions',
  templateUrl: './item-versions.component.html',
  styleUrls: ['./item-versions.component.scss']
})

/**
 * Component listing all available versions of the history the provided item is a part of
 */
export class ItemVersionsComponent implements OnInit {

  /**
   * The item to display a version history for
   */
  @Input() item: Item;
  /**
   * Whether or not to display the alert box
   */
  @Input() displayAlert = true;

  /**
   * An option to display the list of versions, even when there aren't any.
   * Instead of the table, an alert will be displayed, notifying the user there are no other versions present
   * for the current item.
   */
  @Input() displayWhenEmpty = false;

  /**
   * Whether or not to display the title
   */
  @Input() displayTitle = true;

  /**
   * Whether or not to display the action buttons (delete/create/edit version)
   */
  @Input() displayActions: boolean;

  /**
   * Whether user is coordinator
   */
  @Input() isCoordinator = false;

  /**
   * Whether user is funder organizational manager or reader
   */
  @Input() isFunderManagerOrReader = false;

  /**
   * Whether user is funder
   */
  @Input() isProjectFunder = false;

  /**
   * Whether user is project reaer
   */
  @Input() isProjectReader = false;

  /**
   * Whether user is founder
   */
  @Input() canShowCreateVersion = false;

  /**
   * Array of active subscriptions
   */
  subs: Subscription[] = [];

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  AlertTypeEnum = AlertType;

  /**
   * The item's version
   */
  versionRD$: Observable<RemoteData<Version>>;

  /**
   * The item's full version history (remote data)
   */
  versionHistoryRD$: Observable<RemoteData<VersionHistory>>;

  /**
   * The item's full version history
   */
  versionHistory$: Observable<VersionHistory>;

  /**
   * The version history's list of versions
   */
  versionsRD$: BehaviorSubject<RemoteData<PaginatedList<Version>>> = new BehaviorSubject<RemoteData<PaginatedList<Version>>>(null);

  /**
   * Verify if the list of versions has at least one e-person to display
   * Used to hide the "Editor" column when no e-persons are present to display
   */
  hasEpersons$: Observable<boolean>;

  /**
   * Verify if there is an inprogress submission in the version history
   * Used to disable the "Create version" button
   */
  hasDraftVersion$: Observable<boolean>;

  /**
   * The amount of versions to display per page
   */
  pageSize = 10;

  /**
   * The page options to use for fetching the versions
   * Start at page 1 and always use the set page size
   */
  options = Object.assign(new PaginationComponentOptions(), {
    id: 'ivo',
    currentPage: 1,
    pageSize: this.pageSize
  });

  /**
   * The routes to the versions their item pages
   * Key: Item ID
   * Value: Route to item page
   */
  itemPageRoutes$: Observable<{
    [itemId: string]: string
  }>;

  /**
   * The number of the version whose summary is currently being edited
   */
  versionBeingEditedNumber: number;

  /**
   * The id of the version whose summary is currently being edited
   */
  versionBeingEditedId: string;

  /**
   * The summary currently being edited
   */
  versionBeingEditedSummary: string;


  /**
   * The note currently being edited
   */
  versionBeingEditedNote: string;

  canCreateVersion$: Observable<boolean>;
  createVersionTitle$: Observable<string>;

  processingEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  processingDelete$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  isAdmin$: Observable<boolean>;

  /**
   * Get version edit mode from envoirment
   */
  versioningEditMode = environment.projects.versioningEditMode;
  /**
   * Get version edit form section from envoirment
   */
  versioningEditFormSection = environment.projects.versioningEditFormSection;

  constructor(protected versionHistoryService: VersionHistoryDataService,
    protected versionService: VersionDataService,
    protected itemService: ItemDataService,
    protected paginationService: PaginationService,
    protected formBuilder: FormBuilder,
    protected modalService: NgbModal,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
    protected router: Router,
    protected itemVersionShared: ItemVersionsSharedService,
    protected authorizationService: AuthorizationDataService,
    protected workspaceItemDataService: WorkspaceitemDataService,
    protected workflowItemDataService: WorkflowItemDataService,
    protected configurationService: ConfigurationDataService,
    protected cdr: ChangeDetectorRef,
  ) {
  }

  /**
   * True when a version is being edited
   * (used to disable buttons for other versions)
   */
  isAnyBeingEdited(): boolean {
    return this.versionBeingEditedNumber != null;
  }

  /**
   * True if the specified version is being edited
   * (used to show input field and to change buttons for specified version)
   */
  isThisBeingEdited(version: Version): boolean {
    return version?.version === this.versionBeingEditedNumber;
  }

  /**
   * Enables editing for the specified version
   */
  enableVersionEditing(version: Version): void {
    this.versionBeingEditedSummary = version?.summary;
    this.versionBeingEditedNumber = version?.version;
    this.versionBeingEditedId = version?.id;
  }

  /**
   * Disables editing for the specified version and discards all pending changes
   */
  disableVersionEditing(): void {
    this.versionBeingEditedSummary = undefined;
    this.versionBeingEditedNumber = undefined;
    this.versionBeingEditedId = undefined;
  }

  /**
   * Get the route to the specified version
   * @param versionId the ID of the version for which the route will be retrieved
   */
  getVersionRoute(versionId: string) {
    return getItemVersionRoute(versionId);
  }

  /**
   * Applies changes to version currently being edited
   */
  onSummarySubmit() {

    const successMessageKey = 'item.version.edit.notification.success';
    const failureMessageKey = 'item.version.edit.notification.failure';

    this.versionService.findById(this.versionBeingEditedId).pipe(
      getFirstSucceededRemoteData(),
      switchMap((findRes: RemoteData<Version>) => {
        const payload = findRes.payload;
        const summary = { summary: this.versionBeingEditedSummary, };
        const updatedVersion = Object.assign({}, payload, summary);
        return this.versionService.update(updatedVersion).pipe(getFirstCompletedRemoteData<Version>());
      }),
    ).subscribe((updatedVersionRD: RemoteData<Version>) => {
      if (updatedVersionRD.hasSucceeded) {
        this.notificationsService.success(null, this.translateService.get(successMessageKey, { 'version': this.versionBeingEditedNumber }));
        this.getAllVersions(this.versionHistory$);
      } else {
        this.notificationsService.warning(null, this.translateService.get(failureMessageKey, { 'version': this.versionBeingEditedNumber }));
      }
      this.disableVersionEditing();
    }
    );
  }

  /**
   * Delete the item and get the result of the operation
   * @param item
   */
  deleteItemAndGetResult$(item: Item): Observable<boolean> {
    return this.itemService.delete(item.id).pipe(
      getFirstCompletedRemoteData(),
      map((deleteItemRes) => deleteItemRes.hasSucceeded),
      take(1),
    );
  }

  /**
   * Deletes the specified version, notify the success/failure and redirect to latest version
   * @param version the version to be deleted
   * @param redirectToLatest force the redirect to the latest version in the history
   */
  deleteVersion(version, redirectToLatest: boolean): void {
    this.processingDelete$.next(true);
    const successMessageKey = 'item.version.delete.notification.success';
    const failureMessageKey = 'item.version.delete.notification.failure';
    const versionNumber = version.version;
    const versionItem$ = version.item;

    // Open modal
    const activeModal = this.modalService.open(ItemVersionsDeleteModalComponent);
    activeModal.componentInstance.versionNumber = version.version;
    activeModal.componentInstance.firstVersion = false;

    // On modal submit/dismiss
    activeModal.componentInstance.response.pipe(take(1)).subscribe((ok) => {
      if (ok) {
        version.isLoadingDelete = true;
        this.cdr.detectChanges();
        versionItem$.pipe(
          getFirstSucceededRemoteDataPayload<Item>(),
          // Retrieve version history
          mergeMap((item: Item) => combineLatest([
            of(item),
            this.versionHistoryService.getVersionHistoryFromVersion$(version)
          ])),
          // Delete item
          mergeMap(([item, versionHistory]: [Item, VersionHistory]) => combineLatest([
            this.deleteItemAndGetResult$(item),
            of(versionHistory)
          ])),
          // Retrieve new latest version
          mergeMap(([deleteItemResult, versionHistory]: [boolean, VersionHistory]) => combineLatest([
            of(deleteItemResult),
            this.versionHistoryService.getLatestVersionItemFromHistory$(versionHistory).pipe(
              tap(() => {
                this.getAllVersions(of(versionHistory));
                version.isLoadingDelete = false;
                this.cdr.detectChanges();
            }),
          )
        ])),
      ).subscribe(([deleteHasSucceeded, newLatestVersionItem]: [boolean, Item]) => {
        // Notify operation result and redirect to latest item
        if (deleteHasSucceeded) {
          this.notificationsService.success(null, this.translateService.get(successMessageKey, { 'version': versionNumber }));
        } else {
          this.notificationsService.error(null, this.translateService.get(failureMessageKey, { 'version': versionNumber }));
        }
        this.processingDelete$.next(false);
          if (redirectToLatest) {
            const path = getItemEditVersionhistoryRoute(newLatestVersionItem);
            this.router.navigateByUrl(path);
          }
        });
      }
    });
  }

  /**
   * Creates a new version starting from the specified one
   * @param version the version from which a new one will be created
   */
  createNewVersion(version: Version) {
    const versionNumber = version.version;

    // Open modal and set current version number
    const activeModal = this.modalService.open(ItemVersionsSummaryModalComponent);
    activeModal.componentInstance.versionNumber = versionNumber;

    // On createVersionEvent emitted create new version and notify
    activeModal.componentInstance.createVersionEvent.pipe(
      mergeMap((summary: string) => combineLatest([
        of(summary),
        version.item.pipe(getFirstSucceededRemoteDataPayload())
      ])),
      mergeMap(([summary, item]: [string, Item]) => this.versionHistoryService.createVersion(item._links.self.href, summary)),
      getFirstCompletedRemoteData(),
      // close model (should be displaying loading/waiting indicator) when version creation failed/succeeded
      tap(() => activeModal.close()),
      // show success/failure notification
      tap((newVersionRD: RemoteData<Version>) => {
        this.itemVersionShared.notifyCreateNewVersion(newVersionRD);
        if (newVersionRD.hasSucceeded) {
          const versionHistory$ = this.versionService.getHistoryFromVersion(version).pipe(
            tap((versionHistory: VersionHistory) => {
              this.itemService.invalidateItemCache(this.item.uuid);
              this.versionHistoryService.invalidateVersionHistoryCache(versionHistory.id);
            }),
          );
          this.getAllVersions(versionHistory$);
        }
      }),
      // get workspace item
      getFirstSucceededRemoteDataPayload<Version>(),
      switchMap((newVersion: Version) => this.itemService.findByHref(newVersion._links.item.href)),
      getFirstSucceededRemoteDataPayload<Item>(),
      switchMap((newVersionItem: Item) => this.workspaceItemDataService.findByItem(newVersionItem.uuid, true, false)),
      getFirstSucceededRemoteDataPayload<WorkspaceItem>(),
    ).subscribe((wsItem) => {
      const wsiId = wsItem.id;
      const route = 'workspaceitems/' + wsiId + '/edit';
      this.router.navigateByUrl(route);
    });
  }

  /**
   * Check is the current user can edit the version summary
   * @param version
   */
  canEditVersion$(version: Version): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanEditVersion, version.self);
  }

  /**
   * Show submitter in version history table
   */
  showSubmitter() {

    const includeSubmitter$ = this.configurationService.findByPropertyName('versioning.item.history.include.submitter').pipe(
      getFirstSucceededRemoteDataPayload(),
      map((configurationProperty) => configurationProperty.values[0]),
      startWith(false),
    );

    return combineLatest([includeSubmitter$, this.isAdmin$]).pipe(
      map(([includeSubmitter, isAdmin]) => {
        return includeSubmitter && isAdmin;
      })
    );

  }

  /**
   * Check if the current user can delete the version
   * @param version
   */
  canDeleteVersion$(version: Version): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanDeleteVersion, version.self);
  }

  /**
   * Get all versions for the given version history and store them in versionRD$
   * @param versionHistory$
   */
  getAllVersions(versionHistory$: Observable<VersionHistory>): void {
    const currentPagination = this.paginationService.getCurrentPagination(this.options.id, this.options);
    combineLatest([versionHistory$, currentPagination]).pipe(
      switchMap(([versionHistory, options]: [VersionHistory, PaginationComponentOptions]) => {
        return this.versionHistoryService.getVersions(versionHistory.id,
          new PaginatedSearchOptions({ pagination: Object.assign({}, options, { currentPage: options.currentPage }) }),
          false, true, followLink('item'), followLink('eperson'));
      }),
      getFirstCompletedRemoteData(),
    ).subscribe((res: RemoteData<PaginatedList<Version>>) => {
      this.versionsRD$.next(res);
    });
  }

  /**
   * Updates the page
   */
  onPageChange() {
    this.getAllVersions(this.versionHistory$);
  }

  /**
   * Get the ID of the workspace item, if present, otherwise return undefined
   * @param versionItem the item for which retrieve the workspace item id
   */
  getWorkspaceId(versionItem): Observable<string> {
    return versionItem.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((item: Item) => item.uuid),
      switchMap((itemUuid: string) => this.workspaceItemDataService.findByItem(itemUuid, true)),
      getFirstCompletedRemoteData<WorkspaceItem>(),
      map((res: RemoteData<WorkspaceItem>) => res?.payload?.id),
    );
  }

  /**
   * Get the ID of the workflow item, if present, otherwise return undefined
   * @param versionItem the item for which retrieve the workspace item id
   */
  getWorkflowId(versionItem): Observable<string> {
    return versionItem.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((item: Item) => item.uuid),
      switchMap((itemUuid: string) => this.workflowItemDataService.findByItem(itemUuid, true)),
      getFirstCompletedRemoteData<WorkspaceItem>(),
      map((res: RemoteData<WorkspaceItem>) => res?.payload?.id),
    );
  }

  /**
   * redirect to the edit page of the workspace item
   * @param id$ the id of the workspace item
   */
  editWorkspaceItem(id$: Observable<string>) {
    id$.subscribe((id) => {
      this.router.navigateByUrl('workspaceitems/' + id + '/edit');
    });
  }

  /**
   * Initialize all observables
   */
  ngOnInit(): void {
    if (hasValue(this.item.version)) {
      this.versionRD$ = this.item.version;
      this.versionHistoryRD$ = this.versionRD$.pipe(
        getAllSucceededRemoteData(),
        getRemoteDataPayload(),
        hasValueOperator(),
        switchMap((version: Version) => version.versionhistory),
      );
      this.versionHistory$ = this.versionHistoryRD$.pipe(
        getFirstSucceededRemoteDataPayload(),
        hasValueOperator(),
      );

      this.canCreateVersion$ = this.authorizationService.isAuthorized(FeatureID.CanCreateVersion, this.item.self);

      // If there is a draft item in the version history the 'Create version' button is disabled and a different tooltip message is shown
      this.hasDraftVersion$ = this.versionHistoryRD$.pipe(
        getFirstSucceededRemoteDataPayload(),
        map((res) => Boolean(res?.draftVersion)),
      );

      this.createVersionTitle$ = this.hasDraftVersion$.pipe(
        take(1),
        switchMap((res) => of(res ? 'item.version.history.table.action.hasDraft' : 'item.version.history.table.action.newVersion'))
      );

      this.getAllVersions(this.versionHistory$);
      this.hasEpersons$ = this.versionsRD$.pipe(
        getAllSucceededRemoteData(),
        getRemoteDataPayload(),
        hasValueOperator(),
        map((versions: PaginatedList<Version>) => versions.page.filter((version: Version) => version.eperson !== undefined).length > 0),
        startWith(false)
      );
      this.itemPageRoutes$ = this.versionsRD$.pipe(
        getAllSucceededRemoteDataPayload(),
        switchMap((versions) => combineLatest(versions.page.map((version) => version.item.pipe(getAllSucceededRemoteDataPayload())))),
        map((versions) => {
          const itemPageRoutes = {};
          versions.forEach((item) => itemPageRoutes[item.uuid] = getItemPageRoute(item));
          return itemPageRoutes;
        })
      );
      this.isAdmin$ = forkJoin([
        this.authorizationService.isAuthorized(FeatureID.IsCollectionAdmin).pipe(take(1)),
        this.authorizationService.isAuthorized(FeatureID.IsCommunityAdmin).pipe(take(1)),
        this.authorizationService.isAuthorized(FeatureID.AdministratorOf).pipe(take(1)),
      ]).pipe(
          map(
              ([isCollectionAdmin, isCommunityAdmin, isSiteAdmin]) =>
                  isCollectionAdmin || isCommunityAdmin || isSiteAdmin
          ),
          shareReplay(1)
      );
    }
  }

  ngOnDestroy(): void {
    this.cleanupSubscribes();
    this.paginationService.clearPagination(this.options.id);
  }

  /**
   * Unsub all subscriptions
   */
  cleanupSubscribes() {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  /**
   * Toggles the versionItem metadata
   * @param versionItem the version item which metadata belongs to
   * @param metadata the metadata being toggled
   */
  updateItemByMetadata(versionItem: Item, version, metadata: MetadataMap) {
    this.itemService.updateMultipleItemMetadata(
      versionItem.id,
      this.versioningEditMode,
      this.getVersionPath(),
      metadata
    ).subscribe((itemRD: RemoteData<Item>) => {
      if (itemRD.hasSucceeded) {
        this.notificationsService.success(null, this.translateService.get('item.version.history.table.success'));
      } else {
        this.notificationsService.error(null, this.translateService.get('item.version.history.table.error'));
      }
      version.isLoadingVisible = false;
      version.isLoadingOfficial = false;
      this.cdr.detectChanges();

    });
  }

  /**
   * Get the path of version to send section information
   */
  getVersionPath(): string {
    return ['sections', this.versioningEditFormSection].join('/');
  }

  /**
   * Check if any operation is processing on the given version
   *
   * @param version
   */
  isOperationPending(version): boolean {
    return this.processingDelete$.value || version.isLoadingDelete || version.isLoadingVisible || version.isLoadingOfficial;
  }

  /**
   * Button shown only when the versionItem official metadata is true for funder so he can set NonOfficial
   * @param versionItem the version item which metadata belongs to
   */
  setVisible(versionItem: Item, version): void {
    const modalRef = this.modalService.open(ItemVersionsVisibilityModalComponent);
    modalRef.componentInstance.version = version;
    modalRef.result.then((result) => {
      if (result) {
        version.isLoadingVisible = true;
        this.cdr.detectChanges();
        const metadataMap = Object.create({});
        metadataMap['synsicris.version.visible'] = [
          Object.assign(new MetadataValue(), { value: true })
        ];

        if (result.official) {
          metadataMap['synsicris.version.official'] = [
            Object.assign(new MetadataValue(), { value: true })
          ];
        }
        this.updateItemByMetadata(versionItem, version, metadataMap);
      }
    }, () => {
      version.isLoadingVisible = false;
      this.cdr.detectChanges();
    });
  }

  /**
   * Check if the version Item is visible
   * @param versionItem the version item which metadata belongs to
   */
  isVersionVisible(versionItem: Item): boolean {
    return versionItem?.firstMetadataValue('synsicris.version.visible') === 'true';
  }

  /**
   * Check if the version Item is not visible
   * @param versionItem the version item which metadata belongs to
   */
  isVersionNotVisible(versionItem: Item): boolean {
    return isEmpty(versionItem?.firstMetadataValue('synsicris.version.visible')) || versionItem?.firstMetadataValue('synsicris.version.visible') === 'false';
  }

  /**
   * Check if the version Item is official
   * @param versionItem the version item which metadata belongs to
   */
  isVersionOfficial(versionItem: Item): boolean {
    return versionItem?.firstMetadataValue('synsicris.version.official') === 'true';
  }

  /**
   * Check if the version Item is the last official one
   * @param versionItem the version item which metadata belongs to
   */
  isLastVersionVisible(versionItem: Item): boolean {
    return versionItem?.firstMetadataValue('synsicris.isLastVersion.visible') === 'true';
  }

  /**
   * Check if the official metadata is not already set
   * @param versionItem the version item which metadata belongs to
   */
  hasNoOfficialMetadata(versionItem: Item): boolean {
    return isUndefined(versionItem?.firstMetadataValue('synsicris.version.official'))
      || isNull(versionItem?.firstMetadataValue('synsicris.version.official'));
  }

  /**
   * Button shown only when the versionItem official metadata is true for funder so he can set NonOfficial
   * @param versionItem the version item which metadata belongs to
   */
  toggleOfficial(versionItem: Item, version) {

    const value = versionItem.firstMetadataValue('synsicris.version.official') !== 'true';
    const info = versionItem.firstMetadataValue('synsicris.version.official') === 'true' ? 'not-official' : 'official';

    if (this.isProjectFunder) {
      const modalRef = this.modalService.open(ConfirmationModalComponent);
      modalRef.componentInstance.dso = versionItem;
      modalRef.componentInstance.headerLabel = 'confirmation-modal.version.official.header';
      modalRef.componentInstance.infoLabel = 'confirmation-modal.version.official.info.' + info;
      modalRef.componentInstance.cancelLabel = 'confirmation-modal.version.official.cancel';
      modalRef.componentInstance.confirmLabel = 'confirmation-modal.version.official.confirm';
      modalRef.componentInstance.confirmIcon = 'fas fa-check';
      modalRef.componentInstance.brandColor = 'warning';
      const resp$ = modalRef.componentInstance.response.pipe(map((confirm: boolean) => {
        if (confirm) {
          version.isLoadingOfficial = true;
          this.cdr.detectChanges();
          const metadataMap = Object.create({});
          metadataMap['synsicris.version.official'] = [
            Object.assign(new MetadataValue(), { value: value })
          ];
          return this.updateItemByMetadata(versionItem, version, metadataMap);
        } else {
          version.isLoadingOfficial = false;
          this.cdr.detectChanges();
          return null;
        }
      }));
      resp$.subscribe();
      this.subs.push(resp$);
    }
  }

  /**
   * Applies changes to note currently being edited
   */
  onNoteSubmit(versionItem, version) {
    const metadataMap = Object.create({});
    metadataMap['synsicris.version.notes'] = [
      Object.assign(new MetadataValue(), { value: this.versionBeingEditedNote })
    ];
    this.updateItemByMetadata(versionItem, version, metadataMap);
    this.disableNoteEditing();
  }

  /**
   * True if the specified note is being edited
   * (used to show input field and to change buttons for specified note)
   */
  isNoteBeingEdited(versionItem: Item, version: Version): boolean {
    return this.versionBeingEditedNote !== undefined && this.versionBeingEditedNumber === version.version;
  }

  /**
   * Enables editing for the specified note
   */
  enableNoteEditing(versionItem: Item, version: Version): void {
    this.versionBeingEditedNumber = version.version;
    this.versionBeingEditedNote = !!versionItem.firstMetadataValue('synsicris.version.notes') ? versionItem.firstMetadataValue('synsicris.version.notes') : '';
  }

  /**
   * Disables editing for the specified note and discards all pending changes
   */
  disableNoteEditing(): void {
    this.versionBeingEditedNumber = undefined;
    this.versionBeingEditedNote = undefined;
  }

}
