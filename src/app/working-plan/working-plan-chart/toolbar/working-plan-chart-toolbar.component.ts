import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  CreateSimpleItemModalComponent
} from '../../../shared/create-simple-item-modal/create-simple-item-modal.component';
import { SimpleItem } from '../../../shared/create-simple-item-modal/models/simple-item.model';
import { WorkingPlanService } from '../../core/working-plan.service';
import { WorkingPlanStateService } from '../../core/working-plan-state.service';
import { ChartDateViewType } from '../../core/working-plan.reducer';
import { Workpackage } from '../../core/models/workpackage-step.model';
import { environment } from '../../../../environments/environment';
import { hasValue } from '../../../shared/empty.util';
import { Item } from '../../../core/shared/item.model';
import {
  VersionItemSelectedIds,
  VersionSelectedEvent
} from '../../../shared/item-version-list/item-version-list.component';

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'ds-working-plan-chart-toolbar',
  templateUrl: './working-plan-chart-toolbar.component.html',
  styleUrls: ['./working-plan-chart-toolbar.component.scss']
})
export class WorkingPlanChartToolbarComponent implements OnInit, OnDestroy {

  /**
   * If the current user is a funder Organizational/Project manager
   */
  @Input() isFunder: boolean;

  /**
   * If the working-plan given is a version item
   */
  @Input() isVersionOf: boolean;

  /**
   * The current project community's id
   */
  @Input() public projectCommunityId: string;

  /**
   * Array containing a list of Workpackage object
   */
  @Input() public workpackages: Observable<Workpackage[]>;

  /**
   * The working Plan item
   */
  @Input() workingPlan: Item;

  /**
   * A boolean representing if compare mode is active
   */
  @Input() public compareMode: Observable<boolean>;

  workpackagesCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  currentComparingWorkingPlan: BehaviorSubject<VersionItemSelectedIds> = new BehaviorSubject<VersionItemSelectedIds>(null);
  chartDateView: Observable<ChartDateViewType>;
  ChartDateViewType = ChartDateViewType;

  subs: Subscription[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private workingPlanService: WorkingPlanService,
    private workingPlanStateService: WorkingPlanStateService
  ) {
  }

  ngOnInit(): void {
    this.chartDateView = this.workingPlanStateService.getChartDateViewSelector();
    this.subs.push(this.workpackages.pipe(map((workpackages: Workpackage[]) => workpackages.length))
      .subscribe((count) => {
        this.workpackagesCount.next(count);
      }),
      this.workingPlanStateService.getCurrentComparingWorkingPlan().pipe(
      ).subscribe(({
                     workingplanId,
                     selectedWorkingplanId,
                     activeWorkingplanId,
                     baseWorkingplanId,
                     comparingWorkingplanId
                   }) => {
        this.currentComparingWorkingPlan.next({
          baseId: baseWorkingplanId,
          comparingId: comparingWorkingplanId,
          selectedId: selectedWorkingplanId,
          activeId: activeWorkingplanId
        });
      })
    );

  }

  createWorkpackage() {
    const modalRef = this.modalService.open(CreateSimpleItemModalComponent, { size: 'lg', keyboard: false, backdrop: 'static' });

    modalRef.result.then((result) => {
      if (result) {
        this.cdr.detectChanges();
      }
    }, () => null);
    modalRef.componentInstance.formConfig = this.workingPlanService.getWorkpackageFormConfig();
    modalRef.componentInstance.formHeader = this.workingPlanService.getWorkpackageFormHeader();
    modalRef.componentInstance.searchMessageInfoKey = this.workingPlanService.getWorkingPlanSearchHeader();
    modalRef.componentInstance.processing = this.workingPlanStateService.isProcessing();
    modalRef.componentInstance.excludeListId = [];
    modalRef.componentInstance.hasSearch = true;
    modalRef.componentInstance.searchConfiguration = environment.workingPlan.allUnlinkedWorkingPlanObjSearchConfigName;
    modalRef.componentInstance.scope = this.projectCommunityId;
    this.subs.push(
      modalRef.componentInstance.createItem.subscribe((item: SimpleItem) => {
        const metadata = this.workingPlanService.setDefaultForStatusMetadata(item.metadata);
        this.workingPlanStateService.dispatchGenerateWorkpackage(
          this.projectCommunityId,
          item.type.value,
          metadata,
          this.workpackagesCount.value.toString().padStart(3, '0')
        );
      }),
      modalRef.componentInstance.addItems.subscribe((items: SimpleItem[]) => {
        let place = this.workpackagesCount.value;
        items.forEach((item) => {
          this.workingPlanStateService.dispatchAddWorkpackageAction(
            this.projectCommunityId,
            item.id,
            item.workspaceItemId,
            (place++).toString().padStart(3, '0')
          );
        });
      })
    );
  }

  onChartDateViewChange(view: ChartDateViewType) {
    this.workingPlanStateService.dispatchChangeChartDateView(view);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs
      .filter((sub) => hasValue(sub))
      .forEach((sub) => sub.unsubscribe());
  }

  /**
   * Dispatch initialization of comparing mode
   *
   * @param selected
   */
  onVersionSelected(selected: VersionSelectedEvent) {
    this.workingPlanStateService.dispatchInitCompare(selected.base.id, selected.comparing.id, selected.selected.id, selected.active.id);
  }

  /**
   * Dispatch cleaning of comparing mode
   */
  onVersionDeselected() {
    this.workingPlanStateService.dispatchRetrieveAllWorkpackages(this.projectCommunityId, this.workingPlan, environment.workingPlan.workingPlanPlaceMetadata, this.isVersionOf);
  }
}
