import { Inject, Injectable, InjectionToken } from '@angular/core';

import { from as observableFrom, Observable, of as observableOf } from 'rxjs';
import { concatMap, map, mapTo, mergeMap, reduce, switchMap } from 'rxjs/operators';

import { RemoteData } from '../../core/data/remote-data';
import { isEmpty, isNotEmpty, isNotNull } from '../../shared/empty.util';
import {
  getFinishedRemoteData,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload
} from '../../core/shared/operators';
import { Item } from '../../core/shared/item.model';
import { ProjectDataService } from '../../core/project/project-data.service';
import { Metadata } from '../../core/shared/metadata.utils';
import { ItemDataService } from '../../core/data/item-data.service';
import { MetadataValue } from '../../core/shared/metadata.models';
import { QuestionsBoard } from './models/questions-board.model';
import { QuestionsBoardStep } from './models/questions-board-step.model';
import { ItemAuthorityRelationService } from '../../core/shared/item-authority-relation.service';
import { QuestionsBoardTask } from './models/questions-board-task.model';
import { SubmissionFormModel } from '../../core/config/models/config-submission-form.model';
import { SubmissionFormsConfigDataService } from '../../core/config/submission-forms-config-data.service';
import { VocabularyService } from '../../core/submission/vocabularies/vocabulary.service';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { ComparedVersionItem, ProjectVersionService } from '../../core/project/project-version.service';
import { QuestionsBoardConfig } from '../../../config/questions-board.config';
import { environment } from '../../../environments/environment';

export const QUESTIONS_BOARD_CONFIG: InjectionToken<string> = new InjectionToken<string>('');

@Injectable({
  providedIn: 'any'
})
export class QuestionsBoardService {
  private questionsBoardConfig: QuestionsBoardConfig;
  constructor(
    @Inject(QUESTIONS_BOARD_CONFIG) private questionsBoardConfigName: string,
    protected collectionService: CollectionDataService,
    protected formConfigService: SubmissionFormsConfigDataService,
    protected itemAuthorityRelationService: ItemAuthorityRelationService,
    protected itemService: ItemDataService,
    protected projectService: ProjectDataService,
    private projectVersionService: ProjectVersionService,
    protected vocabularyService: VocabularyService
  ) {
    this.questionsBoardConfig = Object.assign({}, environment[questionsBoardConfigName]);
  }

  /**
   * Method used as workaround to resolve issue whwn the same instance of the service is used
   * in the QuestionsBoardEffects
   * @param config
   */
  setConfig(config: QuestionsBoardConfig) {
    this.questionsBoardConfig = Object.assign({}, config);
  }

  /**
   * Return the metadata of the relation between project and the question board object
   */
  getProjectRelationMetadata(): string {
    return this.questionsBoardConfig.questionsBoardRelationMetadata;
  }

  /**
   * Return the form name used for editing the question board object
   */
  getQuestionsBoardEditFormSection(): string {
    return `sections/${this.questionsBoardConfig.questionsBoardEditFormSection}`;
  }

  /**
   * Return the edit mode used for editing the question board object
   */
  getQuestionsBoardEditMode(): string {
    return this.questionsBoardConfig.questionsBoardEditMode;
  }

  /**
   * Return the metadata of the relation between question board object and its steps
   */
  getQuestionsBoardRelationStepsMetadata(): string {
    return this.questionsBoardConfig.questionsBoardStepRelationMetadata;
  }

  /**
   * Return the metadata of the relation between question board step object and its tasks
   */
  getQuestionsBoardRelationTasksMetadata(): string {
    return this.questionsBoardConfig.questionsBoardTaskRelationMetadata;
  }

  /**
   * Return the type of the entity that represent the step
   */
  getQuestionsBoardStepEntityTypeName(): string{
    return this.questionsBoardConfig.questionsBoardStepEntityName;
  }


  /**
   * Return the form name used for editing the question board step object
   */
  getQuestionsBoardStepFormName(stepType: string): string {
    return `${this.questionsBoardConfig.questionsBoardFormPrefix}_${stepType}_form`;
  }

  /**
   * Return the form name used for editing the question board task object
   */
  getQuestionsBoardStepTaskFormName(stepType: string): string {
    return `${this.questionsBoardConfig.questionsBoardFormPrefix}_${stepType}_task_form`;
  }

  /**
   * Return the header label used for searching task functionality
   */
  getQuestionsBoardStepTaskSearchHeader(stepType: string): string {
    return `${this.questionsBoardConfig.questionsBoardI18nPrefix}.${stepType}.task_search`;
  }

  /**
   * Return the form section name used for editing the question board task object
   */
  getQuestionsBoardTaskFormSection(): string {
    return this.questionsBoardConfig.questionsBoardTaskFormSection;
  }

  /**
   * Return the search configuration used to search question board tasks
   */
  getSearchTaskConfigName(stepType: string): string {
    return `${this.questionsBoardConfig.questionsBoardFormPrefix}_${stepType}_task_type`;
  }

  getQuestionsBoardObjectFromProjectId(projectId, relationMetadata): Observable<RemoteData<Item>> {
    return this.itemService.findById(projectId, false).pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((projectItem: Item) => {
        const metadataValue = Metadata.first(projectItem.metadata, relationMetadata);
        if (isNotEmpty(metadataValue) && isNotEmpty(metadataValue.authority)) {
          return this.itemService.findById(metadataValue.authority).pipe(
            getFirstCompletedRemoteData()
          );
        } else {
          throw (new Error('Link to questions board object item is missing.'));
        }
      })
    );
  }

  getQuestionsBoardStepFormConfig(stepType: string): Observable<SubmissionFormModel> {
    const formName = this.getQuestionsBoardStepFormName(stepType);
    return this.formConfigService.findByName(formName).pipe(
      getFirstSucceededRemoteDataPayload()
    ) as Observable<SubmissionFormModel>;
  }

  getQuestionsBoardTaskFormConfig(stepType: string): Observable<SubmissionFormModel> {
    const formName = this.getQuestionsBoardStepTaskFormName(stepType);
    return this.formConfigService.findByName(formName).pipe(
      getFirstSucceededRemoteDataPayload()
    ) as Observable<SubmissionFormModel>;
  }

  initQuestionsBoard(item: Item): Observable<QuestionsBoard> {
    return this.initQuestionsBoardSteps(item.id, item).pipe(
      map((steps: QuestionsBoardStep[]) => {
        return new QuestionsBoard(item.id, '', steps, []);
      })
    );
  }

  initQuestionsBoardStep(parentId: string, stepItem: Item, tasks: QuestionsBoardTask[]): QuestionsBoardStep {
    const description = stepItem.firstMetadataValue('dc.description');

    return new QuestionsBoardStep(parentId, stepItem.id, stepItem.name, description, tasks);
  }

  initQuestionsBoardSteps(questionsBoardObjectId: string, parentItem: Item): Observable<QuestionsBoardStep[]> {
    return observableFrom(Metadata.all(parentItem.metadata, this.getQuestionsBoardRelationStepsMetadata())).pipe(
      concatMap((step: MetadataValue) => this.itemService.findById(step.authority).pipe(
        getFirstSucceededRemoteDataPayload(),
        mergeMap((stepItem: Item) => this.initQuestionsBoardTasksFromParentItem(questionsBoardObjectId, stepItem).pipe(
          map((tasks: QuestionsBoardTask[]) => this.initQuestionsBoardStep(questionsBoardObjectId, stepItem, tasks))
        )),
      )),
      reduce((acc: any, value: any) => [...acc, value], [])
    );
  }

  initQuestionsBoardTask(taskItem: Item, parentId?: string): QuestionsBoardTask {
    const type = taskItem.firstMetadataValue('dspace.entity.type');
    const description = taskItem.firstMetadataValue('dc.description');
    const internalStatus = taskItem.firstMetadataValue('synsicris.type.internal');
    const status = taskItem.firstMetadataValue('synsicris.type.status');

    return new QuestionsBoardTask(taskItem.id, type, parentId, taskItem.name, null, null, description, status, internalStatus);
  }

  initQuestionsBoardTasksFromParentItem(questionsBoardObjectId: string, parentItem: Item, buildLinks = true): Observable<QuestionsBoardTask[]> {
    const relatedTaskMetadata = Metadata.all(parentItem.metadata, this.getQuestionsBoardRelationTasksMetadata());
    if (isEmpty(relatedTaskMetadata)) {
      return observableOf([]);
    } else {
      return observableFrom(Metadata.all(parentItem.metadata, this.getQuestionsBoardRelationTasksMetadata())).pipe(
        concatMap((task: MetadataValue) => this.itemService.findById(task.authority).pipe(
          getFinishedRemoteData(),
          mergeMap((rd: RemoteData<Item>) => {
            if (rd.hasSucceeded) {
              return observableOf(this.initQuestionsBoardTask(rd.payload, parentItem.id));
            } else {
              if (rd.statusCode === 404) {
                // NOTE if a task is not found probably it has been deleted without unlinking it from parent step, so unlink it
                return this.itemAuthorityRelationService.removeChildRelationFromParent(
                  this.getQuestionsBoardEditFormSection(),
                  this.getQuestionsBoardEditMode(),
                  parentItem.id,
                  task.value,
                  this.getQuestionsBoardRelationTasksMetadata()
                ).pipe(mapTo(null));
              } else {
                return observableOf(null);
              }
            }
          })
        )),
        reduce((acc: any, value: any) => {
          if (isNotNull(value)) {
            return [...acc, value];
          } else {
            return acc;
          }
        }, [])
      );
    }
  }

  /**
   * Initialize to compare the steps that were previously compared
   *
   * @param compareList
   *    the list of compared steps
   * @param questionsBoardObjectId
   *    the quetions board object's id to compare
   */
  initCompareQuestionsBoardSteps(compareList: ComparedVersionItem[], questionsBoardObjectId): Observable<QuestionsBoardStep[]> {
    return observableFrom(compareList).pipe(
      concatMap((compareItem: ComparedVersionItem) => this.initCompareQuestionsBoardTasksFromStep(
        compareItem.item.id,
        compareItem.item,
        compareItem.versionItem ?.id).pipe(
          map((steps: QuestionsBoardStep[]) => this.initQuestionsBoardStepFromCompareItem(
            compareItem,
            questionsBoardObjectId,
            steps
          ))
        )),
      reduce((acc: any, value: any) => [...acc, value], [])
    );
  }

  /**
   * Initialize to compare the tasks for a specific step
   *
   * @param targetQuestionsBoardStepId
   *    the questions board's step id
   * @param targetItem
   *    the questions board's step compared item
   * @param versionedQuestionsBoardStepId
   *    the questions board's step compared item with
   */
  initCompareQuestionsBoardTasksFromStep(targetQuestionsBoardStepId: string, targetItem: Item, versionedQuestionsBoardStepId: string): Observable<QuestionsBoardStep[]> {
    return this.projectVersionService.compareItemChildrenByMetadata(
      targetQuestionsBoardStepId,
      versionedQuestionsBoardStepId,
      this.getQuestionsBoardRelationTasksMetadata()).pipe(
      mergeMap((compareList: ComparedVersionItem[]) => {
        return observableFrom(compareList).pipe(
          concatMap((compareItem: ComparedVersionItem) => observableOf(this.initQuestionsBoardTaskFromCompareItem(
            compareItem,
            targetQuestionsBoardStepId)
          )),
          reduce((acc: any, value: any) => {
            if (isNotNull(value)) {
              return [...acc, value];
            } else {
              return acc;
            }
          }, [])
        );
      })
    );
  }

  /**
   * Initialize to construct the compared step
   *
   * @param compareObj
   *    the compared object
   * @param tasks
   *    the tasks or steps related to the object
   */
  public initQuestionsBoardStepFromCompareItem(compareObj: ComparedVersionItem, parentId, tasks: QuestionsBoardStep[] | QuestionsBoardTask[] = []): QuestionsBoardStep {
    const type = compareObj.item.firstMetadataValue('dc.title');
    return Object.assign(new QuestionsBoardStep(), {
      id: compareObj.item.id,
      parentId: parentId,
      type: type,
      tasks: tasks,
    });
  }

  /**
   * Initialize to construct the compared step
   *
   * @param compareObj
   *    the compared object
   * @param tasks
   *    the tasks or steps related to the object
   */
  public initQuestionsBoardTaskFromCompareItem(compareObj: ComparedVersionItem, parentId?: string, tasks: QuestionsBoardTask[] = []): QuestionsBoardTask {
    const type = compareObj.item.firstMetadataValue('dspace.entity.type');
    const description = compareObj.item.firstMetadataValue('dc.description');
    const internalStatus = compareObj.item.firstMetadataValue('synsicris.type.internal');
    const status = compareObj.item.firstMetadataValue('synsicris.type.status');
    return Object.assign(new QuestionsBoardTask(), {
      id: compareObj.item.id,
      compareId: compareObj.versionItem?.id,
      compareStatus: compareObj.status,
      parentId: parentId,
      title: compareObj.item.name,
      type,
      tasks: tasks,
      description,
      status,
      internalStatus
    });
  }


  updateQuestionsBoardStep(newQuestionsBoardStepItem: Item, oldQuestionsBoardStep: QuestionsBoardStep): QuestionsBoardStep {
    const description = newQuestionsBoardStepItem.firstMetadataValue('dc.description');

    return new QuestionsBoardStep(
      oldQuestionsBoardStep.parentId,
      oldQuestionsBoardStep.id,
      oldQuestionsBoardStep.type,
      description,
      oldQuestionsBoardStep.tasks
    );
  }
}
