import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CreateSimpleItemModalComponent } from '../../../shared/create-simple-item-modal/create-simple-item-modal.component';
import { SimpleItem } from '../../../shared/create-simple-item-modal/models/simple-item.model';
import { WorkingPlanService } from '../../../core/working-plan/working-plan.service';
import { WorkingPlanStateService } from '../../../core/working-plan/working-plan-state.service';
import { Observable } from 'rxjs/internal/Observable';
import { ChartDateViewType } from '../../../core/working-plan/working-plan.reducer';
import { Workpackage } from '../../../core/working-plan/models/workpackage-step.model';

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'ipw-working-plan-chart-toolbar',
  templateUrl: './working-plan-chart-toolbar.component.html',
  styleUrls: ['./working-plan-chart-toolbar.component.scss']
})
export class WorkingPlanChartToolbarComponent implements OnInit {
  @Input() workpackages: Observable<Workpackage[]>;

  chartDateView: Observable<ChartDateViewType>;
  ChartDateViewType = ChartDateViewType;

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private workingPlanService: WorkingPlanService,
    private workingPlanStateService: WorkingPlanStateService,
  ) {
  }

  ngOnInit(): void {
    this.chartDateView = this.workingPlanStateService.getChartDateViewSelector();
  }

  createWorkpackage() {
    const modalRef = this.modalService.open(CreateSimpleItemModalComponent, { size: 'lg' });

    modalRef.result.then((result) => {
      if (result) {
        this.cdr.detectChanges();
      }
    }, () => null);
    modalRef.componentInstance.formConfig = this.workingPlanService.getWorkpackageFormConfig();
    modalRef.componentInstance.processing = this.workingPlanStateService.isProcessing();
    modalRef.componentInstance.excludeListId = [];
    modalRef.componentInstance.hasSearch = false;
    modalRef.componentInstance.createItem.subscribe((item: SimpleItem) => {
      const metadata = this.workingPlanService.setDefaultForStatusMetadata(item.metadata);
      this.workingPlanStateService.dispatchGenerateWorkpackage(metadata, modalRef)
    });

  }

  onChartDateViewChange(view: ChartDateViewType) {
    this.workingPlanStateService.dispatchChangeChartDateView(view);
  }

}
