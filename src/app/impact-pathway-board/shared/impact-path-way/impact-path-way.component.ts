import { ChangeDetectorRef, Component, Inject, Input, ViewChild } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathway } from '../../../core/impact-pathway/models/impact-pathway.model';
import { NativeWindowRef, NativeWindowService } from '../../../core/services/window.service';
import { ImpactPathwayLink } from '../../../core/impact-pathway/impact-pathway.reducer';
import { ImpactPathwayLinksService } from '../../../core/impact-pathway/impact-pathway-links.service';
import { ImpactPathwayService } from '../../../core/impact-pathway/impact-pathway.service';

@Component({
  selector: 'ipw-impact-path-way',
  styleUrls: ['./impact-path-way.component.scss'],
  templateUrl: './impact-path-way.component.html'
})
export class ImpactPathWayComponent {

  @Input() public impactPathway: ImpactPathway;

  @ViewChild('accordionRef', { static: false }) wrapper: NgbAccordion;

  canShowRelations: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(@Inject(NativeWindowService) protected _window: NativeWindowRef,
              private cdr: ChangeDetectorRef,
              private impactPathwayService: ImpactPathwayService,
              private impactPathwayLinksService: ImpactPathwayLinksService) {
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

  isOpen() {
    return this.wrapper && this.wrapper.activeIds.includes(this.impactPathway.id);
  }

  updateDescription(value) {
    this.impactPathwayService.dispatchPatchImpactPathwayMetadata(
      this.impactPathway.id,
      this.impactPathway,
      'dc.description',
      0,
      value
    );
  }
}
