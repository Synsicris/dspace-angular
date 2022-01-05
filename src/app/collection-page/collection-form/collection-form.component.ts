import { Component, Input, OnInit } from '@angular/core';

import { combineLatest, Observable, of as observableOf } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  DynamicCheckboxModel,
  DynamicFormArrayModel,
  DynamicFormControlModel,
  DynamicFormOptionConfig,
  DynamicFormService,
  DynamicSelectModel
} from '@ng-dynamic-forms/core';

import { Collection } from '../../core/shared/collection.model';
import { ComColFormComponent } from '../../shared/comcol-forms/comcol-form/comcol-form.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { CommunityDataService } from '../../core/data/community-data.service';
import { AuthService } from '../../core/auth/auth.service';
import { RequestService } from '../../core/data/request.service';
import { ObjectCacheService } from '../../core/cache/object-cache.service';
import { EntityTypeService } from '../../core/data/entity-type.service';
import { ItemType } from '../../core/shared/item-relationships/item-type.model';
import { MetadataValue } from '../../core/shared/metadata.models';
import { getFirstSucceededRemoteListPayload } from '../../core/shared/operators';
import { SubmissionDefinitionModel } from '../../core/config/models/config-submission-definition.model';
import { catchError } from 'rxjs/operators';
import {
  collectionFormEntityTypeSelectionConfig,
  collectionFormModels,
  collectionFormSharedWorkspaceCheckboxConfig,
  collectionFormSubmissionDefinitionSelectionConfig,
  collectionTitleArrayConfig,
  collectionTitleArrayLayout,
  collectionTitleLayout,
  titleConfig
} from './collection-form.models';
import { SubmissionDefinitionsConfigService } from '../../core/config/submission-definitions-config.service';
import { ConfigObject } from '../../core/config/models/config.model';
import { NONE_ENTITY_TYPE } from '../../core/shared/item-relationships/item-type.resource-type';
import { DsDynamicInputModel } from '../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-input.model';

/**
 * Form used for creating and editing collections
 */
@Component({
  selector: 'ds-collection-form',
  styleUrls: ['../../shared/comcol-forms/comcol-form/comcol-form.component.scss'],
  templateUrl: '../../shared/comcol-forms/comcol-form/comcol-form.component.html'
})
export class CollectionFormComponent extends ComColFormComponent<Collection> implements OnInit {
  /**
   * @type {Collection} A new collection when a collection is being created, an existing Input collection when a collection is being edited
   */
  @Input() dso: Collection = new Collection();

  /**
   * @type {Collection.type} This is a collection-type form
   */
  type = Collection.type;

  /**
   * The dynamic form field used for entity type selection
   * @type {DynamicSelectModel<string>}
   */
  entityTypeSelection: DynamicSelectModel<string> = new DynamicSelectModel(collectionFormEntityTypeSelectionConfig);

  /**
   * The dynamic form field used for submission definition selection
   * @type {DynamicSelectModel<string>}
   */
  submissionDefinitionSelection: DynamicSelectModel<string> = new DynamicSelectModel(collectionFormSubmissionDefinitionSelectionConfig);

  sharedWorkspaceChekbox: DynamicCheckboxModel = new DynamicCheckboxModel(collectionFormSharedWorkspaceCheckboxConfig);

  /**
   * The dynamic form fields used for creating/editing a collection
   * @type {DynamicFormControlModel[]}
   */
  formModel: DynamicFormControlModel[];

  public constructor(protected formService: DynamicFormService,
                     protected translate: TranslateService,
                     protected notificationsService: NotificationsService,
                     protected authService: AuthService,
                     protected dsoService: CommunityDataService,
                     protected requestService: RequestService,
                     protected objectCache: ObjectCacheService,
                     protected entityTypeService: EntityTypeService,
                     protected submissionDefinitionService: SubmissionDefinitionsConfigService) {
    super(formService, translate, notificationsService, authService, requestService, objectCache);
  }

  ngOnInit() {

    let currentRelationshipValue: MetadataValue[];
    let currentDefinitionValue: MetadataValue[];
    let currentSharedWorkspaceValue: MetadataValue[];
    let currentTitleValue: MetadataValue[];
    if (this.dso && this.dso.metadata) {
      currentRelationshipValue = this.dso.metadata['dspace.entity.type'];
      currentDefinitionValue = this.dso.metadata['cris.submission.definition'];
      currentSharedWorkspaceValue = this.dso.metadata['cris.workspace.shared'];
      currentTitleValue = this.dso.metadata['dc.title'];
    }

    const titleModel: DynamicFormArrayModel = new DynamicFormArrayModel(Object.assign({}, collectionTitleArrayConfig, {
      initialCount: currentTitleValue.length,
      groupFactory: () => {
        return [new DsDynamicInputModel(titleConfig, collectionTitleLayout)];
      }
    }), collectionTitleArrayLayout);

    currentTitleValue.forEach((metadata: MetadataValue, index: number) => {
      const model: any = titleModel.get(index).group[0];
      model.value = metadata.value;
      model.language = metadata.language;
      console.log(model);
    });

    const entities$: Observable<ItemType[]> = this.entityTypeService.findAll({ elementsPerPage: 100, currentPage: 1 }).pipe(
      getFirstSucceededRemoteListPayload()
    );

    const definitions$: Observable<ConfigObject[]> = this.submissionDefinitionService
      .findAll({ elementsPerPage: 100, currentPage: 1 }).pipe(
        getFirstSucceededRemoteListPayload(),
        catchError(() => observableOf([]))
      );

    // retrieve all entity types and submission definitions to populate the dropdowns selection
    combineLatest([entities$, definitions$])
      .subscribe(([entityTypes, definitions]: [ItemType[], SubmissionDefinitionModel[]]) => {

        entityTypes
          .filter((type: ItemType) => type.label !== NONE_ENTITY_TYPE)
          .forEach((type: ItemType, index: number) => {
          this.entityTypeSelection.add({
            disabled: false,
            label: type.label,
            value: type.label
          } as DynamicFormOptionConfig<string>);
          if (currentRelationshipValue && currentRelationshipValue.length > 0 && currentRelationshipValue[0].value === type.label) {
            this.entityTypeSelection.select(index);
            this.entityTypeSelection.disabled = true;
          }
        });

        definitions.forEach((definition: SubmissionDefinitionModel, index: number) => {
          this.submissionDefinitionSelection.add({
            disabled: false,
            label: definition.name,
            value: definition.name
          } as DynamicFormOptionConfig<string>);
          if (currentDefinitionValue && currentDefinitionValue.length > 0 && currentDefinitionValue[0].value === definition.name) {
            this.submissionDefinitionSelection.select(index);
          }
        });

        this.formModel = [titleModel, ...collectionFormModels, this.entityTypeSelection, this.submissionDefinitionSelection, this.sharedWorkspaceChekbox];

        super.ngOnInit();

        if (currentSharedWorkspaceValue && currentSharedWorkspaceValue.length > 0) {
          this.sharedWorkspaceChekbox.value = currentSharedWorkspaceValue[0].value === 'true';
        }
    });

  }
}
