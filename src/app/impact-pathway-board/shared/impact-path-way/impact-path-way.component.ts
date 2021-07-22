import { ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { NgbAccordion, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathway } from '../../core/models/impact-pathway.model';
import { NativeWindowRef, NativeWindowService } from '../../../core/services/window.service';
import { ImpactPathwayLink } from '../../core/impact-pathway.reducer';
import { ImpactPathwayLinksService } from '../../core/impact-pathway-links.service';
import { ImpactPathwayService } from '../../core/impact-pathway.service';
import { ImpactPathwayStep } from '../../core/models/impact-pathway-step.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { Item } from '../../../core/shared/item.model';
import { SubmissionFormModel } from '../../../core/config/models/config-submission-form.model';

@Component({
  selector: 'ipw-impact-path-way',
  styleUrls: ['./impact-path-way.component.scss'],
  templateUrl: './impact-path-way.component.html'
})
export class ImpactPathWayComponent implements OnInit {

  @Input() public projectId: string;
  @Input() public impactPathway: ImpactPathway;

  @ViewChild('accordionRef', { static: false }) wrapper: NgbAccordion;

  formConfig$: Observable<SubmissionFormModel>;
  canDeleteImpactPathway$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  canShowRelations: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  infoShowed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(@Inject(NativeWindowService) protected _window: NativeWindowRef,
              private authorizationService: AuthorizationDataService,
              private cdr: ChangeDetectorRef,
              private impactPathwayService: ImpactPathwayService,
              private impactPathwayLinksService: ImpactPathwayLinksService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.formConfig$ = this.impactPathwayService.getImpactPathwayFormConfig();
    this.impactPathwayService.retrieveObjectItem(this.impactPathway.id).pipe(
      mergeMap((item: Item) => this.authorizationService.isAuthorized(FeatureID.CanDelete, item.self, undefined)),
      take(1)
    ).subscribe((canDelete) => this.canDeleteImpactPathway$.next(canDelete));
  }

  ngAfterContentChecked() {
    if (this._window.nativeWindow) {
      this.cdr.detectChanges();
      this.loaded.next(true);
    }

  }

  getRelations(): Observable<ImpactPathwayLink[]> {
    return this.impactPathwayLinksService.getAllLinks();
  }

  isOpen(): boolean {
    return this.wrapper && this.wrapper.activeIds.includes(this.impactPathway.id);
  }

  isProcessingRemove(): Observable<boolean> {
    return this.impactPathwayService.isRemoving();
  }

  /**
   * Dispatch a dispatchRemoveImpactPathwayAction
   */
  public confirmRemove(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.impactPathwayService.dispatchRemoveImpactPathwayAction(this.projectId, this.impactPathway.id);
        }
      }
    );
  }

  /**
   * Toggles info panel
   */
  toggleInfoPanel() {
    this.infoShowed.next(!this.infoShowed.value);
  }

  /**
   * Return all impactPathway step ids
   */
  getImpactPathwayStepIds(): string[] {
    return this.impactPathway.steps.map((step: ImpactPathwayStep) => step.id);
  }

  /**
   * Update impact-pathway object from given item
   * @param item
   */
  updateImpactPathway(item) {
    this.impactPathway = this.impactPathwayService.updateImpactPathway(item, this.impactPathway);
    this.impactPathwayService.dispatchUpdateImpactPathway(
      this.impactPathway.id,
      this.impactPathway
    );
  }
}
