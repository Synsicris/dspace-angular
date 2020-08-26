import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { find, flatMap, map, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ImpactPathwayStep } from '../../../../core/impact-pathway/models/impact-pathway-step.model';
import { ImpactPathwayService } from '../../../../core/impact-pathway/impact-pathway.service';
import { fadeInOut } from '../../../../shared/animations/fade';
import { ImpactPathwayTask } from '../../../../core/impact-pathway/models/impact-pathway-task.model';
import { CreateSimpleItemModalComponent } from '../../../../shared/create-simple-item-modal/create-simple-item-modal.component';
import { SimpleItem } from '../../../../shared/create-simple-item-modal/models/simple-item.model';
import { isNotEmpty } from '../../../../shared/empty.util';

@Component({
  selector: 'ipw-impact-path-way-step',
  styleUrls: ['../../drag-and-drop-container.component.scss'],
  templateUrl: './impact-path-way-step.component.html',
  animations: [
    fadeInOut
  ]
})
export class ImpactPathWayStepComponent {

  @Input() public projectId: string;
  @Input() public impactPathwayId: string;
  @Input() public impactPathwayStepId: string;

  public impactPathwayStep$: Observable<ImpactPathwayStep>;

  private title$: Observable<string>;
  constructor(
    protected cdr: ChangeDetectorRef,
    protected impactPathwayService: ImpactPathwayService,
    protected modalService: NgbModal,
    protected translate: TranslateService
    ) {
  }

  ngOnInit(): void {
    this.impactPathwayStep$ = this.impactPathwayService.getImpactPathwayStepById(this.impactPathwayStepId);
    this.title$ = this.impactPathwayStep$.pipe(
      find((impactPathwayStep: ImpactPathwayStep) => isNotEmpty(impactPathwayStep)),
      map((impactPathwayStep: ImpactPathwayStep) => `impact-pathway.step.label.${impactPathwayStep.type}`),
      flatMap((label: string) => this.translate.get(label))
    );

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
      modalRef.componentInstance.excludeFilterName = 'parentStepId';
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
          this.projectId,
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
        })
      });
    })
  }

  onTaskSelected($event: ImpactPathwayTask) {
    this.impactPathwayService.setSelectedTask($event)
  }

  getStepTitle(): Observable<string> {
    return this.title$;
  }

  getTasks(): Observable<ImpactPathwayTask[]> {
    return this.impactPathwayService.getImpactPathwayTasksByStepId(this.impactPathwayId, this.impactPathwayStepId);
  }
}
