import { Component, Input, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathway } from '../../../core/impact-pathway/models/impact-pathway.model';
import { PatchImpactPathwayMetadataAction } from '../../../core/impact-pathway/impact-pathway.actions';
import { AppState } from '../../../app.reducer';

@Component({
  selector: 'ipw-impact-path-way',
  styleUrls: ['./impact-path-way.component.scss'],
  templateUrl: './impact-path-way.component.html'
})
export class ImpactPathWayComponent {

  @Input() public impactPathway: ImpactPathway;

  @ViewChild('accordionRef') wrapper: NgbAccordion;

  constructor(private store: Store<AppState>) {
  }

  isOpen() {
    return this.wrapper && this.wrapper.activeIds.includes(this.impactPathway.id);
  }

  updateDescription(value) {
    this.store.dispatch(new PatchImpactPathwayMetadataAction(
      this.impactPathway.id,
      this.impactPathway,
      'dc.description',
      0,
      value
    ));
  }
}
