import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { BehaviorSubject, Observable, of as observableOf, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { Collection } from '../../../core/shared/collection.model';
import { hasValue } from '../../../shared/empty.util';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { SubmissionService } from '../../submission.service';
import { SubmissionObject } from '../../../core/submission/models/submission-object.model';
import { SubmissionJsonPatchOperationsService } from '../../../core/submission/submission-json-patch-operations.service';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { CollectionDropdownComponent } from '../../../shared/collection-dropdown/collection-dropdown.component';
import { SectionsService } from '../../sections/sections.service';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { SectionsType } from '../../sections/sections-type';
import { SubmissionDefinitionsConfigService } from '../../../core/config/submission-definitions-config.service';
import { RequestService } from '../../../core/data/request.service';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';

/**
 * This component allows to show the current collection the submission belonging to and to change it.
 */
@Component({
  selector: 'ds-submission-form-collection',
  styleUrls: ['./submission-form-collection.component.scss'],
  templateUrl: './submission-form-collection.component.html'
})
export class SubmissionFormCollectionComponent implements OnChanges, OnInit {

  /**
   * The current collection id this submission belonging to
   * @type {string}
   */
  @Input() currentCollectionId: string;

  /**
   * The current configuration object that define this submission
   * @type {SubmissionDefinitionsModel}
   */
  @Input() currentDefinition: string;

  /**
   * The submission id
   * @type {string}
   */
  @Input() submissionId;

  /**
   * The entity type input used to create a new submission
   * @type {string}
   */
  @Input() entityType: string;

  /**
   * An event fired when a different collection is selected.
   * Event's payload equals to new SubmissionObject.
   */
  @Output() collectionChange: EventEmitter<SubmissionObject> = new EventEmitter<SubmissionObject>();

  /**
   * A boolean representing if a collection change operation is processing
   * @type {BehaviorSubject<boolean>}
   */
  public processingChange$ = new BehaviorSubject<boolean>(false);

  /**
   * The selected collection id
   * @type {string}
   */
  public selectedCollectionId: string;

  /**
   * The selected collection name
   * @type {Observable<string>}
   */
  public selectedCollectionName$: Observable<string>;

  /**
   * The JsonPatchOperationPathCombiner object
   * @type {JsonPatchOperationPathCombiner}
   */
  protected pathCombiner: JsonPatchOperationPathCombiner;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  /**
   * The html child that contains the collections list
   */
  @ViewChild(CollectionDropdownComponent) collectionDropdown: CollectionDropdownComponent;

  /**
   * A boolean representing if the collection section is available
   * @type {BehaviorSubject<boolean>}
   */
  available$: Observable<boolean>;

  /**
   * Metadata name to filter collection list
   */
  metadata: string;

  /**
   * If a collection choice is available
   */
  hasChoice = true;

  /**
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} cdr
   * @param {CollectionDataService} collectionDataService
   * @param {DSONameService} nameService
   * @param {JsonPatchOperationsBuilder} operationsBuilder
   * @param {SubmissionJsonPatchOperationsService} operationsService
   * @param {RequestService} requestService
   * @param {SectionsService} sectionsService
   * @param {SubmissionService} submissionService
   * @param {SubmissionDefinitionsConfigService} submissionDefinitionsService
   */
  constructor(protected cdr: ChangeDetectorRef,
              private collectionDataService: CollectionDataService,
              private nameService: DSONameService,
              private operationsBuilder: JsonPatchOperationsBuilder,
              private operationsService: SubmissionJsonPatchOperationsService,
              private requestService: RequestService,
              private sectionsService: SectionsService,
              private submissionService: SubmissionService,
              private submissionDefinitionsService: SubmissionDefinitionsConfigService) {
  }

  /**
   * Initialize collection list
   */
  ngOnChanges(changes: SimpleChanges) {
    if (hasValue(changes.currentCollectionId)
      && hasValue(changes.currentCollectionId.currentValue)) {
      this.selectedCollectionId = this.currentCollectionId;

      this.selectedCollectionName$ = this.collectionDataService.findById(this.currentCollectionId).pipe(
        getFirstSucceededRemoteDataPayload(),
        map((collection: Collection) => collection.entityType + '.listelement.badge')
      );
    }
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', 'collection');
    this.available$ = this.sectionsService.isSectionTypeAvailable(this.submissionId, SectionsType.collection);
    if (this.entityType) {
      this.metadata = 'dspace.entity.type';
    }
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  /**
   * Emit a [collectionChange] event when a new collection is selected from list
   *
   * @param event
   *    the selected [CollectionListEntryItem]
   */
  onSelect(event) {
    this.processingChange$.next(true);
    this.operationsBuilder.replace(this.pathCombiner.getPath(), event.collection.id, true);
    this.subs.push(this.operationsService.jsonPatchByResourceID(
      this.submissionService.getSubmissionObjectLinkName(),
      this.submissionId,
      'sections',
      'collection').pipe(
        mergeMap((submissionObject: SubmissionObject[]) => {
          // retrieve the full submission object with embeds
          return this.submissionService.retrieveSubmission(submissionObject[0].id).pipe(
            getFirstSucceededRemoteDataPayload()
          );
        })
      ).subscribe((submissionObject: SubmissionObject) => {
        this.selectedCollectionId = event.collection.id;
        this.selectedCollectionName$ = observableOf(this.nameService.getName(event.collection));
        this.collectionChange.emit(submissionObject);
        this.submissionService.changeSubmissionCollection(this.submissionId, event.collection.id);
        this.processingChange$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  /**
   * Reset search form control on dropdown menu close
   */
  onClose() {
    this.collectionDropdown.reset();
  }

  /**
   * Reset search form control when dropdown menu is closed
   *
   * @param isOpen
   *    Representing if the dropdown menu is open or not.
   */
  toggled(isOpen: boolean) {
    if (!isOpen) {
      this.collectionDropdown.reset();
    }
  }

  /**
   * Update the component's hasChoice value.
   * @param hasChoice
   *   the new value
   */
  onHasChoice(hasChoice: boolean) {
    this.hasChoice = hasChoice;
  }
}
