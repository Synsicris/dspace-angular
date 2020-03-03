import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathwayStep } from '../../../../core/impact-pathway/models/impact-pathway-step.model';
import { ImpactPathwayService } from '../../../../core/impact-pathway/impact-pathway.service';
import { fadeInOut } from '../../../../shared/animations/fade';
import { ImpactPathwayTask } from '../../../../core/impact-pathway/models/impact-pathway-task.model';
import { CreateSimpleItemModalComponent } from '../../../../shared/create-simple-item-modal/create-simple-item-modal.component';
import { SimpleItem } from '../../../../shared/create-simple-item-modal/models/simple-item.model';

@Component({
  selector: 'ipw-impact-path-way-step',
  styleUrls: ['../../drag-and-drop-container.component.scss'],
  templateUrl: './impact-path-way-step.component.html',
  animations: [
    fadeInOut
  ]
})
export class ImpactPathWayStepComponent {

  @Input() public impactPathwayId: string;
  @Input() public impactPathwayStepId: string;

  public impactPathwayStep$: Observable<ImpactPathwayStep>;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected impactPathwayService: ImpactPathwayService,
    protected modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.impactPathwayStep$ = this.impactPathwayService.getImpactPathwayStepById(this.impactPathwayStepId);
  }

  createTask() {
    this.impactPathwayStep$.pipe(
      take(1)
    ).subscribe((impactPathwayStep: ImpactPathwayStep) => {
      const modalRef = this.modalService.open(CreateSimpleItemModalComponent, { size: 'lg' });

      modalRef.result.then((result) => {
        if (result) {
          this.cdr.detectChanges();
        }
      }, () => null);
      modalRef.componentInstance.formConfig = this.impactPathwayService.getImpactPathwayStepTaskFormConfig(
        impactPathwayStep.type,
        false
      );
      modalRef.componentInstance.processing = this.impactPathwayService.isProcessing();
      modalRef.componentInstance.excludeListId = [this.impactPathwayStepId];
      modalRef.componentInstance.authorityName = this.impactPathwayService.getTaskTypeAuthorityName(
        impactPathwayStep.type,
        false
      );
      modalRef.componentInstance.searchConfiguration = this.impactPathwayService.getSearchTaskConfigName(
        impactPathwayStep.type,
        false
      );
      modalRef.componentInstance.createItem.subscribe((item: SimpleItem) => {
        this.impactPathwayService.dispatchGenerateImpactPathwayTask(
          impactPathwayStep.parentId,
          impactPathwayStep.id,
          item.type.value,
          item.metadata,
          modalRef);
      });
      modalRef.componentInstance.addItems.subscribe((items: SimpleItem[]) => {
        items.forEach((item) => {
          this.impactPathwayService.dispatchAddImpactPathwayTaskAction(
            impactPathwayStep.parentId,
            impactPathwayStep.id,
            item.id,
            modalRef);
        })
      });
    })
  }

  onTaskSelected($event: ImpactPathwayTask) {
    this.impactPathwayService.setSelectedTask($event)
  }

  getStepTitle(): Observable<string> {
    return this.impactPathwayService.getImpactPathwayStepTitle(this.impactPathwayStepId)
  }

  getTasks(): Observable<ImpactPathwayTask[]> {
    return this.impactPathwayService.getImpactPathwayTasksByStepId(this.impactPathwayId, this.impactPathwayStepId);
  }
}
