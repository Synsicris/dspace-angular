import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathwayStep } from '../../../../core/impact-pathway/models/impact-pathway-step.model';
import { ImpactPathwayService } from '../../../../core/impact-pathway/impact-pathway.service';
import { fadeInOut } from '../../../../shared/animations/fade';
import { ImpactPathWayTaskModalComponent } from '../impact-path-way-task/impact-path-way-task-modal/impact-path-way-task-modal.component';
import { ImpactPathwayTask } from '../../../../core/impact-pathway/models/impact-pathway-task.model';

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
      const modalRef = this.modalService.open(ImpactPathWayTaskModalComponent, { size: 'lg' });

      modalRef.result.then((result) => {
        if (result) {
          this.cdr.detectChanges();
        }
      }, () => null);
      modalRef.componentInstance.step = impactPathwayStep;
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
