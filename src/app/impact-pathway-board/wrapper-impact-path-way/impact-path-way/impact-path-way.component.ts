import { Component, Input, ViewChild } from '@angular/core';

import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathway } from '../../../core/impact-pathway/models/impact-pathway.model';

@Component({
  selector: 'ipw-impact-path-way',
  styleUrls: ['./impact-path-way.component.scss'],
  templateUrl: './impact-path-way.component.html'
})
export class ImpactPathWayComponent {

  @Input() public data: ImpactPathway;

  @ViewChild('accordionRef') wrapper: NgbAccordion;

  isOpen() {
    return this.wrapper && this.wrapper.activeIds.includes(this.data.id);
  }

}
