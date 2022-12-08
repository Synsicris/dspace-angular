import { Item } from './../../core/shared/item.model';
import { Component, Input, OnDestroy } from '@angular/core';

import { ObjectiveService } from '../core/objective.service';
import { ImpactPathwayStep } from '../core/models/impact-pathway-step.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { isNotEmpty } from '../../shared/empty.util';
import { environment } from '../../../environments/environment';
import { ImpactPathwayService } from '../core/impact-pathway.service';
import { BehaviorSubject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Component({
  selector: 'ipw-wrapper-objectives',
  styleUrls: ['./wrapper-objectives.component.scss'],
  templateUrl: './wrapper-objectives.component.html'
})
export class WrapperObjectivesComponent implements OnDestroy {

  /**
   * The project community's id
   */
  @Input() public projectCommunityId: string;
  @Input() public impactPathwayStep: ImpactPathwayStep;
  @Input() public targetImpactPathwayTaskId: string;

  public stepTitle: string;

  /**
   * A boolean representing if item is a version of original item
   */
  public isVersionOfAnItem$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private objectivesService: ObjectiveService,
    private router: Router,
    private impactPathwayService: ImpactPathwayService,
    protected aroute: ActivatedRoute,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    const label = `impact-pathway.step.label.${this.impactPathwayStep.type}`;
    this.stepTitle = this.translate.instant(label);

    this.aroute.data.pipe(
      map((data) => data.isVersionOfAnItem),
      filter((isVersionOfAnItem) => isVersionOfAnItem === true),
      take(1)
    ).subscribe((isVersionOfAnItem: boolean) => {
      this.isVersionOfAnItem$.next(isVersionOfAnItem);
    });
  }

  getObjectivesTasks() {
    return this.impactPathwayStep.tasks.filter((task) => (task.type === environment.impactPathway.projObjectiveEntity ||
      task.type === environment.impactPathway.iaObjectiveEntity));
  }

  back() {
    this.router.navigate(['entities', 'impactpathway', this.impactPathwayStep.parentId]);
  }

  hasInfoMessage(): boolean {
    return isNotEmpty(this.getInfoMessage());
  }

  getInfoMessage(): string {
    return this.translate.instant('impact-pathway.objectives.' + this.impactPathwayStep.type + '.info.panel');
  }

  /**
   * When destroy component clear all collapsed values.
   */
  ngOnDestroy() {
    this.impactPathwayService.dispatchClearCollapsable();
  }

  /**
   * Dispatch initialization of comparing mode
   *
   * @param version
   */
  onVersionSelected(version: Item) {
    this.impactPathwayService.initCompareImpactPathwayTask(this.impactPathwayStep.parentId, this.impactPathwayStep.id, this.targetImpactPathwayTaskId, version.id);
  }

  /**
   * Dispatch cleaning of comparing mode
   */
  onVersionDeselected() {
    this.impactPathwayService.dispatchStopCompareImpactPathwayTask(this.impactPathwayStep.parentId, this.impactPathwayStep.id, this.targetImpactPathwayTaskId);
  }

}
