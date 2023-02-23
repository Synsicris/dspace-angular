import { Injectable } from '@angular/core';

import { from as observableFrom, Observable, of as observableOf } from 'rxjs';
import { catchError, concatMap, map, mapTo, mergeMap, reduce, switchMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { RemoteData } from '../../core/data/remote-data';
import { isEmpty, isNotEmpty, isNotNull, isNull } from '../../shared/empty.util';
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
import { VocabularyOptions } from '../../core/submission/vocabularies/models/vocabulary-options.model';
import { VocabularyEntry } from '../../core/submission/vocabularies/models/vocabulary-entry.model';
import { VocabularyService } from '../../core/submission/vocabularies/vocabulary.service';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { ComparedVersionItem, ProjectVersionService } from '../../core/project/project-version.service';

@Injectable()
export class QuestionsBoardService {

  constructor(
    protected collectionService: CollectionDataService,
    protected formConfigService: SubmissionFormsConfigDataService,
    protected itemAuthorityRelationService: ItemAuthorityRelationService,
    protected itemService: ItemDataService,
    protected projectService: ProjectDataService,
    private projectVersionService: ProjectVersionService,
    protected vocabularyService: VocabularyService
  ) {
  }

  getExploitationPlanFromProjectId(projectId): Observable<RemoteData<Item>> {
    return this.itemService.findById(projectId).pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((projectItem: Item) => {
        const metadataValue = Metadata.first(projectItem.metadata, environment.exploitationPlan.exploitationPlanRelationMetadata);
        if (isNotEmpty(metadataValue) && isNotEmpty(metadataValue.authority)) {
          return this.itemService.findById(metadataValue.authority).pipe(
            getFirstCompletedRemoteData()
          );
        } else {
          throw (new Error('Link to exploitation plan item is missing.'));
        }
      })
    );
  }

  getTaskTypeAuthorityName(stepType: string): string {
    return `exploitation_plan_${stepType}_task_type`;
  }

  getSearchTaskConfigName(stepType: string): string {
    return `exploitation_plan_${stepType}_task_type`;
  }

  getExploitationPlanTaskFormSection(): string {
    return environment.exploitationPlan.exploitationPlanTaskFormSection;
  }

  getExploitationPlanEditFormSection(): string {
    return `sections/${environment.exploitationPlan.exploitationPlanEditFormSection}`;
  }

  getExploitationPlanEditMode(): string {
    return environment.exploitationPlan.exploitationPlanEditMode;
  }

  getExploitationPlanStepFormConfig(stepType: string): Observable<SubmissionFormModel> {
    const formName = `exploitation_plan_${stepType}_form`;
    return this.formConfigService.findByName(formName).pipe(
      getFirstSucceededRemoteDataPayload()
    ) as Observable<SubmissionFormModel>;
  }

  getExploitationPlanTaskFormConfig(stepType: string): Observable<SubmissionFormModel> {
    const formName = `exploitation_plan_${stepType}_task_form`;
    return this.formConfigService.findByName(formName).pipe(
      getFirstSucceededRemoteDataPayload()
    ) as Observable<SubmissionFormModel>;
  }

  getExploitationPlanTaskFormHeader(stepType: string): string {
    return `exploitation_plan_${stepType}_task_form`;
  }

  getExploitationPlanTaskSearchHeader(stepType: string): string {
    return `exploitation-plan.${stepType}.task_search`;
  }

  getExploitationPlanTaskType(stepType: string, taskType: string): Observable<string> {
    const name = this.getTaskTypeAuthorityName(stepType);
    const vocabularyOptions: VocabularyOptions = new VocabularyOptions(name);

    return this.vocabularyService.getVocabularyEntryByValue(taskType, vocabularyOptions).pipe(
      map((entry: VocabularyEntry) => {
        if (isNull(entry)) {
          throw new Error(`No task type found for ${taskType}`);
        }

        return entry.display;
      }),
      catchError((error: Error) => observableOf(''))
    );
  }

  initExploitationPlan(item: Item): Observable<QuestionsBoard> {
    return this.initExploitationPlanSteps(item.id, item).pipe(
      map((steps: QuestionsBoardStep[]) => {
        return new QuestionsBoard(item.id, '', steps);
      })
    );
  }

  initExploitationPlanStep(parentId: string, stepItem: Item, tasks: QuestionsBoardTask[]): QuestionsBoardStep {
    const description = stepItem.firstMetadataValue('dc.description');

    return new QuestionsBoardStep(parentId, stepItem.id, stepItem.name, description, tasks);
  }

  initExploitationPlanSteps(exploitationPlanId: string, parentItem: Item): Observable<QuestionsBoardStep[]> {
    return observableFrom(Metadata.all(parentItem.metadata, environment.exploitationPlan.exploitationPlanStepRelationMetadata)).pipe(
      concatMap((step: MetadataValue) => this.itemService.findById(step.authority).pipe(
        getFirstSucceededRemoteDataPayload(),
        mergeMap((stepItem: Item) => this.initExploitationPlanTasksFromParentItem(exploitationPlanId, stepItem).pipe(
          map((tasks: QuestionsBoardTask[]) => this.initExploitationPlanStep(exploitationPlanId, stepItem, tasks))
        )),
      )),
      reduce((acc: any, value: any) => [...acc, value], [])
    );
  }

  initExploitationPlanTask(taskItem: Item, parentId?: string): QuestionsBoardTask {
    const type = taskItem.firstMetadataValue('dspace.entity.type');
    const description = taskItem.firstMetadataValue('dc.description');
    const internalStatus = taskItem.firstMetadataValue('synsicris.type.internal');
    const status = taskItem.firstMetadataValue('synsicris.type.status');

    return new QuestionsBoardTask(taskItem.id, type, parentId, taskItem.name, null, null, description, status, internalStatus);
  }

  initExploitationPlanTasksFromParentItem(exploitationPlanId: string, parentItem: Item, buildLinks = true): Observable<QuestionsBoardTask[]> {
    const relatedTaskMetadata = Metadata.all(parentItem.metadata, environment.exploitationPlan.exploitationPlanTaskRelationMetadata);
    if (isEmpty(relatedTaskMetadata)) {
      return observableOf([]);
    } else {
      return observableFrom(Metadata.all(parentItem.metadata, environment.exploitationPlan.exploitationPlanTaskRelationMetadata)).pipe(
        concatMap((task: MetadataValue) => this.itemService.findById(task.authority).pipe(
          getFinishedRemoteData(),
          mergeMap((rd: RemoteData<Item>) => {
            if (rd.hasSucceeded) {
              return observableOf(this.initExploitationPlanTask(rd.payload, parentItem.id));
            } else {
              if (rd.statusCode === 404) {
                // NOTE if a task is not found probably it has been deleted without unlinking it from parent step, so unlink it
                return this.itemAuthorityRelationService.removeChildRelationFromParent(
                  this.getExploitationPlanEditFormSection(),
                  this.getExploitationPlanEditMode(),
                  parentItem.id,
                  task.value,
                  environment.exploitationPlan.exploitationPlanTaskRelationMetadata
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
   */
  initCompareExploitationPlanSteps(compareList: ComparedVersionItem[], exploitationPlanId): Observable<QuestionsBoardStep[]> {
    return observableFrom(compareList).pipe(
      concatMap((compareItem: ComparedVersionItem) => this.initCompareExploitationPlanTasksFromStep(
        compareItem.item.id,
        compareItem.item,
        compareItem.versionItem ?.id).pipe(
          map((steps: QuestionsBoardStep[]) => this.initExploitationPlanStepFromCompareItem(
            compareItem,
            exploitationPlanId,
            steps
          ))
        )),
      reduce((acc: any, value: any) => [...acc, value], [])
    );
  }


  /**
   * Initialize to compare the tasks for a specific step
   *
   * @param targetExploitationPlanStepId
   *    the exploitation plan's step id
   * @param targetItem
   *    the exploitation plan's step compared item
   * @param versionedExploitationPlanStepId
   *    the exploitation plan's step compared item with
   */
  initCompareExploitationPlanTasksFromStep(targetExploitationPlanStepId: string, targetItem: Item, versionedExploitationPlanStepId: string): Observable<QuestionsBoardStep[]> {
    return this.projectVersionService.compareItemChildrenByMetadata(
      targetExploitationPlanStepId,
      versionedExploitationPlanStepId,
      environment.exploitationPlan.exploitationPlanTaskRelationMetadata).pipe(
      mergeMap((compareList: ComparedVersionItem[]) => {
        return observableFrom(compareList).pipe(
          concatMap((compareItem: ComparedVersionItem) => observableOf(this.initExploitationPlanTaskFromCompareItem(
            compareItem,
            targetExploitationPlanStepId)
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
  public initExploitationPlanStepFromCompareItem(compareObj: ComparedVersionItem, parentId, tasks: QuestionsBoardStep[] | QuestionsBoardTask[] = []): QuestionsBoardStep {
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
  public initExploitationPlanTaskFromCompareItem(compareObj: ComparedVersionItem, parentId?: string, tasks: QuestionsBoardTask[] = []): QuestionsBoardTask {
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


  updateExploitationPlanStep(newExploitationPlanStepItem: Item, oldExploitationPlanStep: QuestionsBoardStep): QuestionsBoardStep {
    const description = newExploitationPlanStepItem.firstMetadataValue('dc.description');

    return new QuestionsBoardStep(
      oldExploitationPlanStep.parentId,
      oldExploitationPlanStep.id,
      oldExploitationPlanStep.type,
      description,
      oldExploitationPlanStep.tasks
    );
  }
}
