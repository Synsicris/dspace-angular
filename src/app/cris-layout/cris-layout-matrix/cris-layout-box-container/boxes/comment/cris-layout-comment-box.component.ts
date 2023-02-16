import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { CrisLayoutRelationBoxComponent } from '../relation/cris-layout-relation-box.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CrisLayoutBox, RelationBoxConfiguration } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';
import { from, Observable, of, switchMap } from 'rxjs';
import { ProjectDataService, VERSION_UNIQUE_ID } from '../../../../../core/project/project-data.service';
import { hasValue } from '../../../../../shared/empty.util';
import { environment } from '../../../../../../environments/environment';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { AuthorizationDataService } from '../../../../../core/data/feature-authorization/authorization-data.service';
import { map, take, withLatestFrom } from 'rxjs/operators';
import {
  getDiscoveryConfiguration,
  groupRangeFilters,
  isConfigParam,
  RangeFilterGroup
} from '../../../../../../config/layout-config.utils';
import { merge } from 'lodash';
import { flattenObject } from '../../../../../shared/object.util';

@Component({
  selector: 'ds-cris-layout-comment-box',
  templateUrl: './cris-layout-comment-box.component.html',
  styleUrls: ['../relation/cris-layout-relation-box.component.scss']
})
@RenderCrisLayoutBoxFor(LayoutBox.COMMENT)
@RenderCrisLayoutBoxFor(LayoutBox.COMMENT_ALL)
export class CrisLayoutCommentBoxComponent extends CrisLayoutRelationBoxComponent implements OnInit, OnDestroy {

  /**
   * @param authorizationService
   * @param cd
   * @param itemService
   * @param projectService
   * @param route
   * @param router
   * @param translateService
   * @param boxProvider
   * @param itemProvider
   */
  constructor(
    public readonly authorizationService: AuthorizationDataService,
    public readonly cd: ChangeDetectorRef,
    public readonly itemService: ItemDataService,
    public readonly projectService: ProjectDataService,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly translateService: TranslateService,
    @Inject('boxProvider') public boxProvider: CrisLayoutBox,
    @Inject('itemProvider') public itemProvider: Item
  ) {
    super(cd, route, translateService, boxProvider, itemProvider);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected initConfiguration(box: CrisLayoutBox) {
    of(getDiscoveryConfiguration(box.configuration as RelationBoxConfiguration))
      .pipe(
        map(filters => groupRangeFilters(filters)),
        withLatestFrom(this.route.queryParams),
        map(([confParam, queryParams]) =>
          Object.assign(
            {},
            // merge facet filters from config
            this.mergeFacetFilters(confParam, queryParams),
            // take not facet filters
            this.getNonFacetQueryParams(queryParams, confParam)
          )
        ),
        switchMap(params =>
          from(
            this.router.navigate(
              [],
              {
                relativeTo: this.route,
                queryParams: params,
                queryParamsHandling: 'merge'
              }
            )
          )
        ),
        take(1)
      ).subscribe(() =>
      (this.configuration = (box.configuration as RelationBoxConfiguration)['discovery-configuration'])
    );
  }

  /**
   * Merge facet filters from confParam and queryParams into a single flattened object
   * that is structured like a {@see Params}
   *
   * @param confParam
   * @param queryParams
   * @private
   */
  private mergeFacetFilters(confParam, queryParams): Params {
    return flattenObject(
      Object.assign(
        {},
        confParam,
        this.groupQueryParams(queryParams, confParam)
      )
    );
  }

  /**
   * Retrieves query params that are not configured as range filter
   *
   * @param queryParams
   * @param confParam
   * @private
   */
  private getNonFacetQueryParams(queryParams: Params, confParam: RangeFilterGroup): Params {
    return Object.keys(queryParams)
      .filter(name => !isConfigParam(confParam, name))
      .reduce((prev, curr) => Object.assign({}, prev, { [curr]: queryParams[curr] }), {});
  }

  /**
   * Groups queryParams into {@link RangeFilterGroup}
   *
   * @param queryParams
   * @param confParam
   * @private
   */
  private groupQueryParams(queryParams: Params, confParam: RangeFilterGroup): RangeFilterGroup {
    return Object.keys(queryParams)
      .filter(name => isConfigParam(confParam, name))
      .map(name => this.mapToRangeFilterGroup(name, queryParams))
      .reduce((prev, curr) => merge(prev, curr), {});
  }

  /**
   * Maps target queryParams using its name into a {@link RangeFilterGroup}
   *
   * @param name
   * @param queryParams
   * @private
   */
  private mapToRangeFilterGroup(name: string, queryParams: Params): RangeFilterGroup {
    const l = name.lastIndexOf('.');
    return l < 0 ? {} : { [`${name.substring(0, l)}`]: { [`${name.substring(l + 1)}`]: queryParams[name] } };
  }

  /**
   * Activates / Deactivates the creation of an item {@link ItemCreateComponent}, depending
   * on the value emitted from this observable.
   * The Observable will emit:
   *   - `true` to enable the item creation
   *   - `false` to disable the item creation
   *
   * @protected
   */
  protected initCanCreateItems$(): Observable<boolean> {
    return of(this.box.boxType === LayoutBox.COMMENT);
  }

  protected initSearchFilter(item: Item) {
    this.searchFilter = `scope=${this.getScopeItemId(item)}`;
  }

  private getScopeItemId(item: Item): string {
    const uniqueId = item.firstMetadataValue(VERSION_UNIQUE_ID);
    let scopeId = null;
    if (!hasValue(uniqueId) || !hasValue(scopeId = uniqueId.split('_')[0])) {
      return item.id;
    }
    return scopeId;
  }

  getTargetEntity() {
    return environment.comments.commentEntityType;
  }
}
