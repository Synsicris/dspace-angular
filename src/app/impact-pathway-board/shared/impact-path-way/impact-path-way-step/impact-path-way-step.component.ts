import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { find, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ImpactPathwayStep } from '../../../core/models/impact-pathway-step.model';
import { ImpactPathwayService } from '../../../core/impact-pathway.service';
import { fadeInOut } from '../../../../shared/animations/fade';
import { ImpactPathwayTask } from '../../../core/models/impact-pathway-task.model';
import { CreateSimpleItemModalComponent } from '../../../../shared/create-simple-item-modal/create-simple-item-modal.component';
import { SimpleItem } from '../../../../shared/create-simple-item-modal/models/simple-item.model';
import { isNotEmpty } from '../../../../shared/empty.util';
import { DragAndDropContainerComponent } from '../../drag-and-drop-container.component';
import { CollectionDataService } from '../../../../core/data/collection-data.service';
import { environment } from '../../../../../environments/environment';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { RemoteData } from '../../../../core/data/remote-data';
import { Collection } from '../../../../core/shared/collection.model';
import { PaginatedList } from '../../../../core/data/paginated-list.model';

@Component({
  selector: 'ipw-impact-path-way-step',
  styleUrls: ['./impact-path-way-step.component.scss', '../../drag-and-drop-container.component.scss'],
  templateUrl: './impact-path-way-step.component.html',
  animations: [
    fadeInOut
  ]
})
export class ImpactPathWayStepComponent extends DragAndDropContainerComponent {

  /**
   * The project community's id
   */
  @Input() public projectCommunityId: string;
  @Input() public impactPathwayId: string;
  @Input() public impactPathwayStepId: string;
  @Input() public allImpactPathwayStepIds: string[];

  public impactPathwayStep$: BehaviorSubject<ImpactPathwayStep> = new BehaviorSubject<ImpactPathwayStep>(null);

  private title$: Observable<string>;
  private info$: Observable<string>;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected collectionService: CollectionDataService,
    protected impactPathwayService: ImpactPathwayService,
    protected modalService: NgbModal,
    protected translate: TranslateService
    ) {
    super(impactPathwayService);
  }

  ngOnInit(): void {
    this.connectedToList = this.allImpactPathwayStepIds;
    this.subs.push(this.impactPathwayService.getImpactPathwayStepById(this.impactPathwayStepId)
      .subscribe((step: ImpactPathwayStep) => {
        this.impactPathwayStep$.next(step);
      })
    );
    this.title$ = this.impactPathwayStep$.pipe(
      find((impactPathwayStep: ImpactPathwayStep) => isNotEmpty(impactPathwayStep)),
      map((impactPathwayStep: ImpactPathwayStep) => `impact-pathway.step.label.${impactPathwayStep.type}`),
      mergeMap((label: string) => this.translate.get(label))
    );

    this.info$ = this.impactPathwayStep$.pipe(
      find((impactPathwayStep: ImpactPathwayStep) => isNotEmpty(impactPathwayStep)),
      map((impactPathwayStep: ImpactPathwayStep) => `impact-pathway.step.info.${impactPathwayStep.type}`),
      mergeMap((label: string) => this.translate.get(label))
    );

  }

  drop(event: CdkDragDrop<ImpactPathwayStep>) {
    if (event.previousContainer === event.container) {
      const newList = [...event.container.data.tasks];
      moveItemInArray(newList, event.previousIndex, event.currentIndex);
      this.impactPathwayService.dispatchOrderTasks(this.impactPathwayId, this.impactPathwayStepId, newList, event.container.data.tasks);
    }
    this.isDragging.next(false);
    this.isDropAllowed.next(false);
  }

  createTask() {
    this.impactPathwayStep$.pipe(
      take(1),
      switchMap((impactPathwayStep: ImpactPathwayStep) => {
        if (impactPathwayStep.hasScope()) {
          return this.collectionService.getAuthorizedCollectionByCommunityAndEntityType(this.projectCommunityId, environment.impactPathway.contributionFundingprogrammeEntity).pipe(
            getFirstCompletedRemoteData(),
            map((collectionRD: RemoteData<PaginatedList<Collection>>) => {
              if (collectionRD.hasSucceeded && isNotEmpty(collectionRD.payload.page)) {
                return [impactPathwayStep, collectionRD.payload.page[0].id];
              } else {
                return [impactPathwayStep, null];
              }
            })
          );
        } else {
          return observableOf([impactPathwayStep, null]);
        }
      })
    ).subscribe(([impactPathwayStep, authorityScopeUUID]: [ImpactPathwayStep, string]) => {
      const modalRef = this.modalService.open(CreateSimpleItemModalComponent, { size: 'lg', keyboard: false, backdrop: 'static' });

      modalRef.result.then((result) => {
        if (result) {
          this.cdr.detectChanges();
        }
      }, () => null);
      modalRef.componentInstance.formConfig = this.impactPathwayService.getImpactPathwayStepTaskFormConfig(
        impactPathwayStep.type,
        false
      );
      modalRef.componentInstance.formHeader = this.impactPathwayService.getImpactPathwayStepTaskFormHeader(
        impactPathwayStep.type,
        false
      );
      modalRef.componentInstance.searchMessageInfoKey = this.impactPathwayService.getImpactPathwayStepTaskSearchHeader(
        impactPathwayStep.type,
        false
      );
      modalRef.componentInstance.processing = this.impactPathwayService.isProcessing();
      modalRef.componentInstance.vocabularyName = this.impactPathwayService.getTaskTypeAuthorityName(
        impactPathwayStep.type,
        false
      );
      modalRef.componentInstance.searchConfiguration = this.impactPathwayService.getSearchTaskConfigName(
        impactPathwayStep.type,
        false
      );
      modalRef.componentInstance.scope = this.projectCommunityId;
      modalRef.componentInstance.authorityScope = authorityScopeUUID;
      modalRef.componentInstance.query = this.buildExcludedTasksQuery();

      modalRef.componentInstance.createItem.subscribe((item: SimpleItem) => {
        this.impactPathwayService.dispatchGenerateImpactPathwayTask(
          this.projectCommunityId,
          impactPathwayStep.parentId,
          impactPathwayStep.id,
          item.type.value,
          item.metadata);
      });
      modalRef.componentInstance.addItems.subscribe((items: SimpleItem[]) => {
        items.forEach((item) => {
          this.impactPathwayService.dispatchAddImpactPathwayTaskAction(
            impactPathwayStep.parentId,
            impactPathwayStep.id,
            item.id);
        });
      });
    });
  }

  onTaskSelected($event: ImpactPathwayTask) {
    this.impactPathwayService.setSelectedTask($event);
  }

  getStepTitle(): Observable<string> {
    return this.title$;
  }

  getStepInfoTitle(): Observable<string> {
    return this.info$;
  }

  getTasks(): Observable<ImpactPathwayTask[]> {
    return this.impactPathwayService.getImpactPathwayTasksByStepId(this.impactPathwayId, this.impactPathwayStepId);
  }

  private buildExcludedTasksQuery(): string {
    /*    const subprojectMembersGroup = this.projectGroupService.getProjectMembersGroupNameByCommunity(this.subproject);
        let query = `(entityGrants:project OR cris.policy.group: ${subprojectMembersGroup})`;*/
    let query = '';
    const tasksIds = this.impactPathwayStep$.value.getTasksIds();
    if (tasksIds.length > 0) {
      const excludedIdsQuery = '-(search.resourceid' + ':(' + tasksIds.join(' OR ') + '))';
      query += `${excludedIdsQuery}`;
    }

    return query;
  }

}
