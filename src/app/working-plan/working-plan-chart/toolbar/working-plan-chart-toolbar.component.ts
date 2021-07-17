import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CreateSimpleItemModalComponent } from '../../../shared/create-simple-item-modal/create-simple-item-modal.component';
import { SimpleItem } from '../../../shared/create-simple-item-modal/models/simple-item.model';
import { WorkingPlanService } from '../../core/working-plan.service';
import { WorkingPlanStateService } from '../../core/working-plan-state.service';
import { ChartDateViewType } from '../../core/working-plan.reducer';
import { Workpackage } from '../../core/models/workpackage-step.model';
import { environment } from '../../../../environments/environment';
import { hasValue } from '../../../shared/empty.util';

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'ipw-working-plan-chart-toolbar',
  templateUrl: './working-plan-chart-toolbar.component.html',
  styleUrls: ['./working-plan-chart-toolbar.component.scss']
})
export class WorkingPlanChartToolbarComponent implements OnInit, OnDestroy {

  /**
   * The current project'id
   */
  @Input() public projectId: string;

  /**
   * Array containing a list of Workpackage object
   */
  @Input() public workpackages: Observable<Workpackage[]>;

  workpackagesCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  chartDateView: Observable<ChartDateViewType>;
  ChartDateViewType = ChartDateViewType;

  subs: Subscription[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private workingPlanService: WorkingPlanService,
    private workingPlanStateService: WorkingPlanStateService,
  ) {
  }

  ngOnInit(): void {
    this.chartDateView = this.workingPlanStateService.getChartDateViewSelector();
    this.subs.push(this.workpackages.pipe(map((workpackages: Workpackage[]) => workpackages.length))
      .subscribe((count) => {
        this.workpackagesCount.next(count);
      })
    );
  }

  createWorkpackage() {
    const modalRef = this.modalService.open(CreateSimpleItemModalComponent, { size: 'lg' });

    modalRef.result.then((result) => {
      if (result) {
        this.cdr.detectChanges();
      }
    }, () => null);
    modalRef.componentInstance.formConfig = this.workingPlanService.getWorkpackageFormConfig();
    modalRef.componentInstance.formHeader = this.workingPlanService.getWorkpackageFormHeader();
    modalRef.componentInstance.searchMessageInfoKey = this.workingPlanService.getWorkingPlanTaskSearchHeader();
    modalRef.componentInstance.processing = this.workingPlanStateService.isProcessing();
    modalRef.componentInstance.excludeListId = [];
    modalRef.componentInstance.hasSearch = true;
    modalRef.componentInstance.vocabularyName = environment.workingPlan.workpackageTypeAuthority;
    modalRef.componentInstance.searchConfiguration = environment.workingPlan.allUnlinkedWorkingPlanObjSearchConfigName;
    this.subs.push(
      modalRef.componentInstance.createItem.subscribe((item: SimpleItem) => {
        const metadata = this.workingPlanService.setDefaultForStatusMetadata(item.metadata);
        this.workingPlanStateService.dispatchGenerateWorkpackage(
          this.projectId,
          item.type.value,
          metadata,
          this.workpackagesCount.value.toString().padStart(3, '0')
        );
      }),
      modalRef.componentInstance.addItems.subscribe((items: SimpleItem[]) => {
        let place = this.workpackagesCount.value;
        items.forEach((item) => {
          this.workingPlanStateService.dispatchAddWorkpackageAction(
            this.projectId,
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

}
