import { Component, Input, OnInit } from '@angular/core';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { hasValue, isEmpty, isUndefined } from '../../empty.util';
import { getResourceTypeValueFor } from '../../../core/cache/object-cache.reducer';

@Component({
  selector: 'ds-grant-badge',
  templateUrl: './grant-badge.component.html'
})
/**
 * Component rendering the type of an item as a badge
 */
export class GrantBadgeComponent implements OnInit {

  /**
   * The component used to retrieve the type from
   */
  @Input() object: DSpaceObject;

  projectShared: string;

  ngOnInit() {
    if (!isUndefined(this.object.firstMetadataValue('cris.project.shared')) && hasValue(this.object.firstMetadataValue('cris.project.shared'))) {
      this.projectShared = this.object.firstMetadataValue('cris.project.shared');
    }
  }


}
