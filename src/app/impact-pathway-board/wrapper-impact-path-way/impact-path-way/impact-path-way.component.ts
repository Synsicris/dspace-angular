import { Component, Input, ViewChild } from '@angular/core';

import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathWay } from '../../../core/impact-pathway/models/impact-path-way.model';

@Component({
  selector: 'ipw-impact-path-way',
  styleUrls: ['./impact-path-way.component.scss'],
  templateUrl: './impact-path-way.component.html'
})
export class ImpactPathWayComponent {

  @Input() public data: ImpactPathWay;

  @ViewChild('accordionRef') wrapper: NgbAccordion;

  isOpen() {
    return this.wrapper && this.wrapper.activeIds.includes(this.data.id);
  }

}
