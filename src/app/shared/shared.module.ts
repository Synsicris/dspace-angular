import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTreeModule } from '@angular/cdk/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';

import { NouisliderModule } from 'ng2-nouislider';
import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbTimepickerModule,
  NgbTooltipModule,
  NgbTypeaheadModule
} from '@ng-bootstrap/ng-bootstrap';
import { MissingTranslationHandler, TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { FileUploadModule } from 'ng2-file-upload';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TextMaskModule } from 'angular2-text-mask';
import { MomentModule } from 'ngx-moment';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ExportMetadataSelectorComponent } from './dso-selector/modal-wrappers/export-metadata-selector/export-metadata-selector.component';
import { FileDropzoneNoUploaderComponent } from './file-dropzone-no-uploader/file-dropzone-no-uploader.component';
import { ItemListElementComponent } from './object-list/item-list-element/item-types/item/item-list-element.component';
import { EnumKeysPipe } from './utils/enum-keys-pipe';
import { FileSizePipe } from './utils/file-size-pipe';
import { MetadataFieldValidator } from './utils/metadatafield-validator.directive';
import { SafeUrlPipe } from './utils/safe-url-pipe';
import { ConsolePipe } from './utils/console.pipe';
import { CollectionListElementComponent } from './object-list/collection-list-element/collection-list-element.component';
import { CommunityListElementComponent } from './object-list/community-list-element/community-list-element.component';
import { SearchResultListElementComponent } from './object-list/search-result-list-element/search-result-list-element.component';
import { ObjectListComponent } from './object-list/object-list.component';
import { CollectionGridElementComponent } from './object-grid/collection-grid-element/collection-grid-element.component';
import { CommunityGridElementComponent } from './object-grid/community-grid-element/community-grid-element.component';
import { AbstractListableElementComponent } from './object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ObjectGridComponent } from './object-grid/object-grid.component';
import { ObjectCollectionComponent } from './object-collection/object-collection.component';
import { ErrorComponent } from './error/error.component';
import { LoadingComponent } from './loading/loading.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ThumbnailComponent } from '../thumbnail/thumbnail.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchResultGridElementComponent } from './object-grid/search-result-grid-element/search-result-grid-element.component';
import { ViewModeSwitchComponent } from './view-mode-switch/view-mode-switch.component';
import { VarDirective } from './utils/var.directive';
import { AuthNavMenuComponent } from './auth-nav-menu/auth-nav-menu.component';
import { LogOutComponent } from './log-out/log-out.component';
import { DragClickDirective } from './utils/drag-click.directive';
import { TruncatePipe } from './utils/truncate.pipe';
import { TruncatableComponent } from './truncatable/truncatable.component';
import { TruncatableService } from './truncatable/truncatable.service';
import { TruncatablePartComponent } from './truncatable/truncatable-part/truncatable-part.component';
import { UploaderComponent } from './uploader/uploader.component';
import { ChipsComponent } from './chips/chips.component';
import { NumberPickerComponent } from './number-picker/number-picker.component';
import { MockAdminGuard } from './mocks/admin-guard.service.mock';
import { AlertComponent } from './alert/alert.component';
import { SearchResultDetailElementComponent } from './object-detail/my-dspace-result-detail-element/search-result-detail-element.component';
import { ClaimedTaskActionsComponent } from './mydspace-actions/claimed-task/claimed-task-actions.component';
import { PoolTaskActionsComponent } from './mydspace-actions/pool-task/pool-task-actions.component';
import { ObjectDetailComponent } from './object-detail/object-detail.component';
import { ItemDetailPreviewComponent } from './object-detail/my-dspace-result-detail-element/item-detail-preview/item-detail-preview.component';
import { MyDSpaceItemStatusComponent } from './object-collection/shared/mydspace-item-status/my-dspace-item-status.component';
import { WorkspaceitemActionsComponent } from './mydspace-actions/workspaceitem/workspaceitem-actions.component';
import { WorkflowitemActionsComponent } from './mydspace-actions/workflowitem/workflowitem-actions.component';
import { ItemSubmitterComponent } from './object-collection/shared/mydspace-item-submitter/item-submitter.component';
import { ItemActionsComponent } from './mydspace-actions/item/item-actions.component';
import { ClaimedTaskActionsApproveComponent } from './mydspace-actions/claimed-task/approve/claimed-task-actions-approve.component';
import { ClaimedTaskActionsRejectComponent } from './mydspace-actions/claimed-task/reject/claimed-task-actions-reject.component';
import { ObjNgFor } from './utils/object-ngfor.pipe';
import { BrowseByComponent } from './browse-by/browse-by.component';
import { BrowseEntryListElementComponent } from './object-list/browse-entry-list-element/browse-entry-list-element.component';
import { DebounceDirective } from './utils/debounce.directive';
import { ClickOutsideDirective } from './utils/click-outside.directive';
import { EmphasizePipe } from './utils/emphasize.pipe';
import { InputSuggestionsComponent } from './input-suggestions/input-suggestions.component';
import { CapitalizePipe } from './utils/capitalize.pipe';
import { ObjectKeysPipe } from './utils/object-keys-pipe';
import { AuthorityConfidenceStateDirective } from './authority-confidence/authority-confidence-state.directive';
import { LangSwitchComponent } from './lang-switch/lang-switch.component';
import { PlainTextMetadataListElementComponent } from './object-list/metadata-representation-list-element/plain-text/plain-text-metadata-list-element.component';
import { ItemMetadataListElementComponent } from './object-list/metadata-representation-list-element/item/item-metadata-list-element.component';
import { MetadataRepresentationListElementComponent } from './object-list/metadata-representation-list-element/metadata-representation-list-element.component';
import { ObjectValuesPipe } from './utils/object-values-pipe';
import { InListValidator } from './utils/in-list-validator.directive';
import { AutoFocusDirective } from './utils/auto-focus.directive';
import { StartsWithDateComponent } from './starts-with/date/starts-with-date.component';
import { StartsWithTextComponent } from './starts-with/text/starts-with-text.component';
import { DSOSelectorComponent } from './dso-selector/dso-selector/dso-selector.component';
import { CreateCommunityParentSelectorComponent } from './dso-selector/modal-wrappers/create-community-parent-selector/create-community-parent-selector.component';
import { CreateItemParentSelectorComponent } from './dso-selector/modal-wrappers/create-item-parent-selector/create-item-parent-selector.component';
import { CreateCollectionParentSelectorComponent } from './dso-selector/modal-wrappers/create-collection-parent-selector/create-collection-parent-selector.component';
import { CommunitySearchResultListElementComponent } from './object-list/search-result-list-element/community-search-result/community-search-result-list-element.component';
import { CollectionSearchResultListElementComponent } from './object-list/search-result-list-element/collection-search-result/collection-search-result-list-element.component';
import { EditItemSelectorComponent } from './dso-selector/modal-wrappers/edit-item-selector/edit-item-selector.component';
import { EditCommunitySelectorComponent } from './dso-selector/modal-wrappers/edit-community-selector/edit-community-selector.component';
import { EditCollectionSelectorComponent } from './dso-selector/modal-wrappers/edit-collection-selector/edit-collection-selector.component';
import { ItemListPreviewComponent } from './object-list/my-dspace-result-list-element/item-list-preview/item-list-preview.component';
import { MetadataFieldWrapperComponent } from '../item-page/field-components/metadata-field-wrapper/metadata-field-wrapper.component';
import { MetadataValuesComponent } from '../item-page/field-components/metadata-values/metadata-values.component';
import { RoleDirective } from './roles/role.directive';
import { UserMenuComponent } from './auth-nav-menu/user-menu/user-menu.component';
import { ClaimedTaskActionsReturnToPoolComponent } from './mydspace-actions/claimed-task/return-to-pool/claimed-task-actions-return-to-pool.component';
import { ItemDetailPreviewFieldComponent } from './object-detail/my-dspace-result-detail-element/item-detail-preview/item-detail-preview-field/item-detail-preview-field.component';
import { CollectionSearchResultGridElementComponent } from './object-grid/search-result-grid-element/collection-search-result/collection-search-result-grid-element.component';
import { CommunitySearchResultGridElementComponent } from './object-grid/search-result-grid-element/community-search-result/community-search-result-grid-element.component';
import { PageSizeSelectorComponent } from './page-size-selector/page-size-selector.component';
import { AbstractTrackableComponent } from './trackable/abstract-trackable.component';
import { ComcolMetadataComponent } from './comcol/comcol-forms/edit-comcol-page/comcol-metadata/comcol-metadata.component';
import { ItemSelectComponent } from './object-select/item-select/item-select.component';
import { CollectionSelectComponent } from './object-select/collection-select/collection-select.component';
import { FilterInputSuggestionsComponent } from './input-suggestions/filter-suggestions/filter-input-suggestions.component';
import { DsoInputSuggestionsComponent } from './input-suggestions/dso-input-suggestions/dso-input-suggestions.component';
import { ItemGridElementComponent } from './object-grid/item-grid-element/item-types/item/item-grid-element.component';
import { TypeBadgeComponent } from './object-list/type-badge/type-badge.component';
import { MetadataRepresentationLoaderComponent } from './metadata-representation/metadata-representation-loader.component';
import { MetadataRepresentationDirective } from './metadata-representation/metadata-representation.directive';
import { ListableObjectComponentLoaderComponent } from './object-collection/shared/listable-object/listable-object-component-loader.component';
import { ItemSearchResultListElementComponent } from './object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { ListableObjectDirective } from './object-collection/shared/listable-object/listable-object.directive';
import { ItemMetadataRepresentationListElementComponent } from './object-list/metadata-representation-list-element/item/item-metadata-representation-list-element.component';
import { PageWithSidebarComponent } from './sidebar/page-with-sidebar.component';
import { SidebarDropdownComponent } from './sidebar/sidebar-dropdown.component';
import { SidebarFilterComponent } from './sidebar/filter/sidebar-filter.component';
import { SidebarFilterSelectedOptionComponent } from './sidebar/filter/sidebar-filter-selected-option.component';
import { SelectableListItemControlComponent } from './object-collection/shared/selectable-list-item-control/selectable-list-item-control.component';
import { ImportableListItemControlComponent } from './object-collection/shared/importable-list-item-control/importable-list-item-control.component';
import { ItemVersionsComponent } from './item/item-versions/item-versions.component';
import { SortablejsModule } from 'ngx-sortablejs';
import { LogInContainerComponent } from './log-in/container/log-in-container.component';
import { LogInShibbolethComponent } from './log-in/methods/shibboleth/log-in-shibboleth.component';
import { LogInPasswordComponent } from './log-in/methods/password/log-in-password.component';
import { LogInComponent } from './log-in/log-in.component';
import { BundleListElementComponent } from './object-list/bundle-list-element/bundle-list-element.component';
import { MissingTranslationHelper } from './translate/missing-translation.helper';
import { ItemVersionsNoticeComponent } from './item/item-versions/notice/item-versions-notice.component';
import { FileValidator } from './utils/require-file.validator';
import { FileValueAccessorDirective } from './utils/file-value-accessor.directive';
import { FileSectionComponent } from '../item-page/simple/field-components/file-section/file-section.component';
import { ModifyItemOverviewComponent } from '../item-page/edit-item-page/modify-item-overview/modify-item-overview.component';
import { ClaimedTaskActionsLoaderComponent } from './mydspace-actions/claimed-task/switcher/claimed-task-actions-loader.component';
import { ClaimedTaskActionsDirective } from './mydspace-actions/claimed-task/switcher/claimed-task-actions.directive';
import { ClaimedTaskActionsEditMetadataComponent } from './mydspace-actions/claimed-task/edit-metadata/claimed-task-actions-edit-metadata.component';
import { ImpersonateNavbarComponent } from './impersonate-navbar/impersonate-navbar.component';
import { NgForTrackByIdDirective } from './ng-for-track-by-id.directive';
import { FileDownloadLinkComponent } from './file-download-link/file-download-link.component';
import { CollectionDropdownComponent } from './collection-dropdown/collection-dropdown.component';
import { EntityDropdownComponent } from './entity-dropdown/entity-dropdown.component';
import { VocabularyTreeviewComponent } from './vocabulary-treeview/vocabulary-treeview.component';
import { CurationFormComponent } from '../curation-form/curation-form.component';
import { PublicationSidebarSearchListElementComponent } from './object-list/sidebar-search-list-element/item-types/publication/publication-sidebar-search-list-element.component';
import { SidebarSearchListElementComponent } from './object-list/sidebar-search-list-element/sidebar-search-list-element.component';
import { CollectionSidebarSearchListElementComponent } from './object-list/sidebar-search-list-element/collection/collection-sidebar-search-list-element.component';
import { CommunitySidebarSearchListElementComponent } from './object-list/sidebar-search-list-element/community/community-sidebar-search-list-element.component';
import { AuthorizedCollectionSelectorComponent } from './dso-selector/dso-selector/authorized-collection-selector/authorized-collection-selector.component';
import { DsoPageEditButtonComponent } from './dso-page/dso-page-edit-button/dso-page-edit-button.component';
import { DsoPageVersionButtonComponent } from './dso-page/dso-page-version-button/dso-page-version-button.component';
import { HoverClassDirective } from './hover-class.directive';
import { ValidationSuggestionsComponent } from './input-suggestions/validation-suggestions/validation-suggestions.component';
import { ItemAlertsComponent } from './item/item-alerts/item-alerts.component';
import { ItemSearchResultGridElementComponent } from './object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component';
import { BitstreamDownloadPageComponent } from './bitstream-download-page/bitstream-download-page.component';
import { GenericItemPageFieldComponent } from '../item-page/simple/field-components/specific-field/generic/generic-item-page-field.component';
import { MetadataRepresentationListComponent } from '../item-page/simple/metadata-representation-list/metadata-representation-list.component';
import { RelatedItemsComponent } from '../item-page/simple/related-items/related-items-component';
import { LinkMenuItemComponent } from './menu/menu-item/link-menu-item.component';
import { OnClickMenuItemComponent } from './menu/menu-item/onclick-menu-item.component';
import { TextMenuItemComponent } from './menu/menu-item/text-menu-item.component';
import { ItemExportComponent } from './item-export/item-export/item-export.component';
import { SearchChartsComponent } from './search/search-charts/search-charts.component';
import { SearchChartBarComponent } from './search/search-charts/search-chart/search-chart-bar/search-chart-bar.component';
import { SearchChartBarToLeftComponent } from './search/search-charts/search-chart/search-chart-bar-to-left/search-chart-bar-to-left.component';
import { SearchChartBarToRightComponent } from './search/search-charts/search-chart/search-chart-bar-to-right/search-chart-bar-to-right.component';
import { SearchChartPieComponent } from './search/search-charts/search-chart/search-chart-pie/search-chart-pie.component';
import { SearchChartLineComponent } from './search/search-charts/search-chart/search-chart-line/search-chart-line.component';
import { SearchChartFilterWrapperComponent } from './search/search-charts/search-chart/search-chart-wrapper/search-chart-wrapper.component';
import { SearchChartComponent } from './search/search-charts/search-chart/search-chart.component';
import { ChartsModule } from '../charts/charts.module';
import { SearchChartFilterComponent } from './search/search-charts/search-chart/search-chart-filter/search-chart-filter.component';
import { VocabularyExternalSourceComponent } from './vocabulary-external-source/vocabulary-external-source.component';
import { ItemExportAlertComponent } from './item-export/item-export-alert/item-export-alert.component';
import { ItemExportModalLauncherComponent } from './item-export/item-export-modal-launcher/item-export-modal-launcher.component';
import { BulkImportSelectorComponent } from './dso-selector/modal-wrappers/bulk-import-collection-selector/bulk-import-collection-selector.component';
import { AdministeredCollectionSelectorComponent } from './dso-selector/dso-selector/administered-collection-selector/administered-collection-selector.component';
import { RelationshipsListComponent } from './object-list/relationships-list/relationships-list.component';
import { RelationshipsItemsActionsComponent } from './object-list/relationships-list/relationships-items-actions/relationships-items-actions.component';
import { RelationshipsItemsListPreviewComponent } from './object-list/relationships-list/relationships-items-list-preview/relationships-items-list-preview.component';
import { SearchNavbarComponent } from '../search-navbar/search-navbar.component';
import { ItemVersionsSummaryModalComponent } from './item/item-versions/item-versions-summary-modal/item-versions-summary-modal.component';
import { ItemVersionsDeleteModalComponent } from './item/item-versions/item-versions-delete-modal/item-versions-delete-modal.component';
import { ScopeSelectorModalComponent } from './search-form/scope-selector-modal/scope-selector-modal.component';
import { BitstreamRequestACopyPageComponent } from './bitstream-request-a-copy-page/bitstream-request-a-copy-page.component';
import { DsSelectComponent } from './ds-select/ds-select.component';
import { LogInOidcComponent } from './log-in/methods/oidc/log-in-oidc.component';
import { LogInOrcidComponent } from './log-in/methods/orcid/log-in-orcid.component';
import { ClaimItemSelectorComponent } from './dso-selector/modal-wrappers/claim-item-selector/claim-item-selector.component';
import { MetricBadgesComponent } from './object-list/metric-badges/metric-badges.component';
import { MetricLoaderComponent } from './metric/metric-loader/metric-loader.component';
import { MetricAltmetricComponent } from './metric/metric-altmetric/metric-altmetric.component';
import { MetricDimensionsComponent } from './metric/metric-dimensions/metric-dimensions.component';
import { MetricDspacecrisComponent } from './metric/metric-dspacecris/metric-dspacecris.component';
import { MetricGooglescholarComponent } from './metric/metric-googlescholar/metric-googlescholar.component';
import { MetricEmbeddedViewComponent } from './metric/metric-embedded-view/metric-embedded-view.component';
import { MetricEmbeddedDownloadComponent } from './metric/metric-embedded-download/metric-embedded-download.component';
import { MetricDonutsComponent } from './object-list/metric-donuts/metric-donuts.component';
import { BrowseMostElementsComponent } from './browse-most-elements/browse-most-elements.component';
import { BrowseSectionComponent } from './explore/section-component/browse-section/browse-section.component';
import { ThemedBrowseSectionComponent } from './explore/section-component/browse-section/themed-browse-section.component';
import { TopSectionComponent } from './explore/section-component/top-section/top-section.component';
import { ThemedTopSectionComponent } from './explore/section-component/top-section/themed-top-section.component';
import { FacetSectionComponent } from './explore/section-component/facet-section/facet-section.component';
import { SearchSectionComponent } from './explore/section-component/search-section/search-section.component';
import { TextSectionComponent } from './explore/section-component/text-section/text-section.component';
import { CountersSectionComponent } from './explore/section-component/counters-section/counters-section.component';
import { ThemedCountersSectionComponent } from './explore/section-component/counters-section/themed-counters-section.component';
import { MultiColumnTopSectionComponent } from './explore/section-component/multi-column-top-section/multi-column-top-section.component';
import { EditMetadataSecurityComponent } from '../item-page/edit-item-page/edit-metadata-security/edit-metadata-security.component';
import { MetadataLinkViewComponent } from './metadata-link-view/metadata-link-view.component';
import { ExportExcelSelectorComponent } from './dso-selector/modal-wrappers/export-excel-selector/export-excel-selector.component';
import { MetricPlumxComponent } from './metric/metric-plumx/metric-plumx.component';
import { ThemedFacetSectionComponent } from './explore/section-component/facet-section/themed-facet-section.component';
import { ThemedMultiColumnTopSectionComponent } from './explore/section-component/multi-column-top-section/themed-multi-column-top-section.component';
import { ThemedSearchSectionComponent } from './explore/section-component/search-section/themed-search-section.component';
import { ThemedTextSectionComponent } from './explore/section-component/text-section/themed-text-section.component';
import { ThemedBrowseMostElementsComponent } from './browse-most-elements/themed-browse-most-elements.component';
import { CreateImpactPathwayComponent } from '../impact-pathway-board/create-impact-pathway/create-impact-pathway.component';
import { TaskColorDirective } from '../impact-pathway-board/shared/impact-path-way/impact-path-way-task/task.directive';
import { AuthorityTypeaheadComponent } from './authority-typeahead/authority-typeahead.component';
import { MaterialModule } from './material/material.module';
import { CreateProjectComponent } from '../projects/create-project/create-project.component';
import { InvitationModalComponent } from './invitation-modal/invitation-modal.component';
import { EditItemGrantsModalComponent } from './edit-item-grants-modal/edit-item-grants-modal.component';
import { ItemCreateComponent } from './item/item-create/item-create.component';
import { AuthorityDropdownComponent } from './authority-dropdown/authority-dropdown.component';
import { ItemVersionListComponent } from './item-version-list/item-version-list.component';
import { CompareItemComponent } from './compare-item/compare-item.component';

const MODULES = [
  // Do NOT include UniversalModule, HttpModule, or JsonpModule here
  CommonModule,
  SortablejsModule,
  FileUploadModule,
  FormsModule,
  InfiniteScrollModule,
  NgbNavModule,
  NgbDatepickerModule,
  NgbTimepickerModule,
  NgbTypeaheadModule,
  NgxPaginationModule,
  NgbPaginationModule,
  NgbDropdownModule,
  NgbTooltipModule,
  ReactiveFormsModule,
  RouterModule,
  NouisliderModule,
  MomentModule,
  TextMaskModule,
  DragDropModule,
  CdkTreeModule,
  ChartsModule,
  MaterialModule,
  FlexLayoutModule
];

const ROOT_MODULES = [
  TranslateModule.forChild({
    missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslationHelper },
    useDefaultLang: true
  }),
  ChartsModule.withEntryComponents()
];

const PIPES = [
  // put shared pipes here
  EnumKeysPipe,
  FileSizePipe,
  SafeUrlPipe,
  TruncatePipe,
  EmphasizePipe,
  CapitalizePipe,
  ObjectKeysPipe,
  ObjectValuesPipe,
  ConsolePipe,
  ObjNgFor
];

const COMPONENTS = [
  // put shared components here
  AlertComponent,
  AuthNavMenuComponent,
  UserMenuComponent,
  ChipsComponent,
  DsSelectComponent,
  ErrorComponent,
  FileSectionComponent,
  LangSwitchComponent,
  LoadingComponent,
  LogInComponent,
  LogOutComponent,
  NumberPickerComponent,
  ObjectListComponent,
  ObjectDetailComponent,
  ObjectGridComponent,
  AbstractListableElementComponent,
  ObjectCollectionComponent,
  PaginationComponent,
  SearchFormComponent,
  PageWithSidebarComponent,
  SidebarDropdownComponent,
  SidebarFilterComponent,
  SidebarFilterSelectedOptionComponent,
  ThumbnailComponent,
  UploaderComponent,
  FileDropzoneNoUploaderComponent,
  ItemListPreviewComponent,
  MyDSpaceItemStatusComponent,
  ItemSubmitterComponent,
  ItemDetailPreviewComponent,
  ItemDetailPreviewFieldComponent,
  ClaimedTaskActionsComponent,
  ClaimedTaskActionsApproveComponent,
  ClaimedTaskActionsRejectComponent,
  ClaimedTaskActionsReturnToPoolComponent,
  ClaimedTaskActionsEditMetadataComponent,
  ClaimedTaskActionsLoaderComponent,
  ItemActionsComponent,
  PoolTaskActionsComponent,
  WorkflowitemActionsComponent,
  WorkspaceitemActionsComponent,
  ViewModeSwitchComponent,
  TruncatableComponent,
  TruncatablePartComponent,
  BrowseByComponent,
  InputSuggestionsComponent,
  FilterInputSuggestionsComponent,
  ValidationSuggestionsComponent,
  DsoInputSuggestionsComponent,
  DSOSelectorComponent,
  CreateCommunityParentSelectorComponent,
  CreateCollectionParentSelectorComponent,
  CreateItemParentSelectorComponent,
  BulkImportSelectorComponent,
  EditCommunitySelectorComponent,
  EditCollectionSelectorComponent,
  EditItemSelectorComponent,
  ClaimItemSelectorComponent,
  CommunitySearchResultListElementComponent,
  CollectionSearchResultListElementComponent,
  BrowseByComponent,

  CollectionSearchResultGridElementComponent,
  CommunitySearchResultGridElementComponent,
  PageSizeSelectorComponent,
  ListableObjectComponentLoaderComponent,
  CollectionListElementComponent,
  CommunityListElementComponent,
  CollectionGridElementComponent,
  CommunityGridElementComponent,
  BrowseByComponent,
  AbstractTrackableComponent,
  ComcolMetadataComponent,
  TypeBadgeComponent,
  MetricBadgesComponent,
  MetricDonutsComponent,
  BrowseByComponent,
  AbstractTrackableComponent,

  ItemSelectComponent,
  CollectionSelectComponent,
  MetadataRepresentationLoaderComponent,
  SelectableListItemControlComponent,

  ImportableListItemControlComponent,

  LogInShibbolethComponent,
  LogInOidcComponent,
  LogInOrcidComponent,
  LogInPasswordComponent,
  LogInContainerComponent,
  ItemVersionsComponent,
  ItemSearchResultListElementComponent,
  ItemVersionsNoticeComponent,
  ModifyItemOverviewComponent,
  ImpersonateNavbarComponent,
  FileDownloadLinkComponent,
  BitstreamDownloadPageComponent,
  BitstreamRequestACopyPageComponent,
  CollectionDropdownComponent,
  EntityDropdownComponent,
  ExportMetadataSelectorComponent,
  ConfirmationModalComponent,
  VocabularyTreeviewComponent,
  AuthorizedCollectionSelectorComponent,
  AdministeredCollectionSelectorComponent,
  CurationFormComponent,
  SearchResultListElementComponent,
  SearchResultGridElementComponent,
  ItemListElementComponent,
  ItemGridElementComponent,
  ItemSearchResultGridElementComponent,
  BrowseEntryListElementComponent,
  SearchResultDetailElementComponent,
  PlainTextMetadataListElementComponent,
  ItemMetadataListElementComponent,
  MetadataRepresentationListElementComponent,
  ItemMetadataRepresentationListElementComponent,
  BundleListElementComponent,
  StartsWithDateComponent,
  StartsWithTextComponent,
  SidebarSearchListElementComponent,
  PublicationSidebarSearchListElementComponent,
  CollectionSidebarSearchListElementComponent,
  CommunitySidebarSearchListElementComponent,
  SearchNavbarComponent,
  ScopeSelectorModalComponent,
  ItemExportComponent,
  ItemExportAlertComponent,
  ItemExportModalLauncherComponent,
  SearchChartsComponent,
  SearchChartBarComponent,
  SearchChartBarToLeftComponent,
  SearchChartBarToRightComponent,
  SearchChartPieComponent,
  SearchChartLineComponent,
  SearchChartFilterWrapperComponent,
  SearchChartComponent,
  SearchChartFilterComponent,
  VocabularyExternalSourceComponent,
  SearchNavbarComponent,
  RelationshipsListComponent,
  RelationshipsItemsActionsComponent,
  RelationshipsItemsListPreviewComponent,
  MetricLoaderComponent,
  MetricAltmetricComponent,
  MetricDimensionsComponent,
  MetricDspacecrisComponent,
  MetricGooglescholarComponent,
  MetricEmbeddedViewComponent,
  MetricEmbeddedDownloadComponent,
  BrowseMostElementsComponent,
  ThemedBrowseSectionComponent,
  BrowseSectionComponent,
  TopSectionComponent,
  ThemedTopSectionComponent,
  FacetSectionComponent,
  ThemedFacetSectionComponent,
  SearchSectionComponent,
  TextSectionComponent,
  CountersSectionComponent,
  ThemedCountersSectionComponent,
  MultiColumnTopSectionComponent,
  EditMetadataSecurityComponent,
  MetadataLinkViewComponent,
  ExportExcelSelectorComponent,
  ThemedMultiColumnTopSectionComponent,
  ThemedSearchSectionComponent,
  ThemedTextSectionComponent,
  ThemedBrowseMostElementsComponent,
  CreateImpactPathwayComponent,
  AuthorityTypeaheadComponent,
  AuthorityDropdownComponent,
  CreateProjectComponent,
  InvitationModalComponent,
  EditItemGrantsModalComponent,
  CompareItemComponent
];

const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  CollectionListElementComponent,
  CommunityListElementComponent,
  SearchResultListElementComponent,
  CommunitySearchResultListElementComponent,
  CollectionSearchResultListElementComponent,
  CollectionGridElementComponent,
  CommunityGridElementComponent,
  CommunitySearchResultGridElementComponent,
  CollectionSearchResultGridElementComponent,
  SearchResultGridElementComponent,
  ItemListElementComponent,
  ItemGridElementComponent,
  ItemSearchResultListElementComponent,
  ItemSearchResultGridElementComponent,
  BrowseEntryListElementComponent,
  SearchResultDetailElementComponent,
  StartsWithDateComponent,
  StartsWithTextComponent,
  CreateCommunityParentSelectorComponent,
  CreateCollectionParentSelectorComponent,
  CreateItemParentSelectorComponent,
  BulkImportSelectorComponent,
  ClaimItemSelectorComponent,
  EditCommunitySelectorComponent,
  EditCollectionSelectorComponent,
  EditItemSelectorComponent,
  PlainTextMetadataListElementComponent,
  ItemMetadataListElementComponent,
  MetadataRepresentationListElementComponent,
  ItemMetadataRepresentationListElementComponent,
  LogInPasswordComponent,
  LogInShibbolethComponent,
  LogInOidcComponent,
  LogInOrcidComponent,
  BundleListElementComponent,
  ClaimedTaskActionsApproveComponent,
  ClaimedTaskActionsRejectComponent,
  ClaimedTaskActionsReturnToPoolComponent,
  ClaimedTaskActionsEditMetadataComponent,
  CollectionDropdownComponent,
  FileDownloadLinkComponent,
  BitstreamDownloadPageComponent,
  BitstreamRequestACopyPageComponent,
  CurationFormComponent,
  ExportMetadataSelectorComponent,
  ConfirmationModalComponent,
  VocabularyTreeviewComponent,
  SidebarSearchListElementComponent,
  PublicationSidebarSearchListElementComponent,
  CollectionSidebarSearchListElementComponent,
  CommunitySidebarSearchListElementComponent,
  LinkMenuItemComponent,
  OnClickMenuItemComponent,
  TextMenuItemComponent,
  ScopeSelectorModalComponent,
  ThemedBrowseSectionComponent,
  BrowseSectionComponent,
  TopSectionComponent,
  ThemedTopSectionComponent,
  FacetSectionComponent,
  ThemedFacetSectionComponent,
  SearchSectionComponent,
  TextSectionComponent,
  CountersSectionComponent,
  ThemedCountersSectionComponent,
  MultiColumnTopSectionComponent,
  SearchChartBarComponent,
  SearchChartBarToLeftComponent,
  SearchChartBarToRightComponent,
  SearchChartPieComponent,
  SearchChartLineComponent,
  ThemedMultiColumnTopSectionComponent,
  ThemedSearchSectionComponent,
  ThemedTextSectionComponent,
  ThemedBrowseMostElementsComponent,
];

const SHARED_ITEM_PAGE_COMPONENTS = [
  MetadataFieldWrapperComponent,
  MetadataValuesComponent,
  DsoPageEditButtonComponent,
  DsoPageVersionButtonComponent,
  ItemAlertsComponent,
  GenericItemPageFieldComponent,
  MetadataRepresentationListComponent,
  RelatedItemsComponent,
  ItemCreateComponent
];

const PROVIDERS = [
  TruncatableService,
  MockAdminGuard,
  AbstractTrackableComponent
];

const DIRECTIVES = [
  VarDirective,
  DragClickDirective,
  DebounceDirective,
  ClickOutsideDirective,
  AuthorityConfidenceStateDirective,
  InListValidator,
  AutoFocusDirective,
  RoleDirective,
  MetadataRepresentationDirective,
  ListableObjectDirective,
  ClaimedTaskActionsDirective,
  FileValueAccessorDirective,
  FileValidator,
  ClaimedTaskActionsDirective,
  NgForTrackByIdDirective,
  MetadataFieldValidator,
  HoverClassDirective,
  TaskColorDirective
];

@NgModule({
  imports: [
    ...MODULES,
    ...ROOT_MODULES,
    NgbCollapseModule,
  ],
  declarations: [
    ...PIPES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...SHARED_ITEM_PAGE_COMPONENTS,
    ItemVersionsSummaryModalComponent,
    ItemVersionsDeleteModalComponent,
    ItemExportAlertComponent,
    MetricPlumxComponent,
    InvitationModalComponent,
    ItemVersionListComponent
  ],
  providers: [
    ...PROVIDERS
  ],
  exports: [
    ...MODULES,
    ...PIPES,
    ...COMPONENTS,
    ...SHARED_ITEM_PAGE_COMPONENTS,
    ...DIRECTIVES,
    TranslateModule,
    ItemVersionListComponent
  ]
})

/**
 * This module handles all components and pipes that need to be shared among multiple other modules
 */
export class SharedModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: SharedModule,
      providers: ENTRY_COMPONENTS.map((component) => ({ provide: component }))
    };
  }
}
