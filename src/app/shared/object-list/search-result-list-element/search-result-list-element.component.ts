import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { SearchResult } from '../../search/models/search-result.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { hasValue } from '../../empty.util';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { TruncatableService } from '../../truncatable/truncatable.service';
import { Metadata } from '../../../core/shared/metadata.utils';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { APP_CONFIG, AppConfig } from '../../../../config/app-config.interface';
import { ResultViewConfig } from '../../../../config/display-search-result-config.interface';

@Component({
  selector: 'ds-search-result-list-element',
  template: ``
})
export class SearchResultListElementComponent<T extends SearchResult<K>, K extends DSpaceObject> extends AbstractListableElementComponent<T> implements OnInit {
  /**
   * The DSpaceObject of the search result
   */
  dso: K;
  dsoTitle: string;

  /**
   * Display configurations for the item search result
   */
  displayConfigurations: ResultViewConfig[];

  public constructor(protected truncatableService: TruncatableService,
                     protected dsoNameService: DSONameService,
                     @Inject(APP_CONFIG) protected appConfig?: AppConfig) {
    super();
  }

  /**
   * Retrieve the dso from the search result and set the display configuration of the dso informations
   */
  ngOnInit(): void {
    if (hasValue(this.object)) {
      this.dso = this.object.indexableObject;
      this.dsoTitle = this.dsoNameService.getName(this.dso);

      const itemType = this.firstMetadataValue('dspace.entity.type');
      const def = 'default';

      if ( !!this.appConfig.displayItemSearchResult && !!this.appConfig.displayItemSearchResult[itemType] ) {
        this.displayConfigurations = this.appConfig.displayItemSearchResult[itemType];
      } else if ( !!this.appConfig.displayItemSearchResult[def] ) {
        this.displayConfigurations = this.appConfig.displayItemSearchResult[def];
      } else {
        this.displayConfigurations = null;
      }
    }
  }

  /**
   * Gets all matching metadata string values from hitHighlights or dso metadata, preferring hitHighlights.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @returns {string[]} the matching string values or an empty array.
   */
  allMetadataValues(keyOrKeys: string | string[]): string[] {
    return Metadata.allValues([this.object.hitHighlights, this.dso.metadata], keyOrKeys);
  }

  /**
   * Gets the first matching metadata string value from hitHighlights or dso metadata, preferring hitHighlights.
   *
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
   * @returns {string} the first matching string value, or `undefined`.
   */
  firstMetadataValue(keyOrKeys: string | string[]): string {
    return Metadata.firstValue([this.object.hitHighlights, this.dso.metadata], keyOrKeys);
  }

  /**
   * Emits if the list element is currently collapsed or not
   */
  isCollapsed(): Observable<boolean> {
    return this.truncatableService.isCollapsed(this.dso.id);
  }

}
