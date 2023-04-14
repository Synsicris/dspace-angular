import { SearchFilter } from './../../shared/search/models/search-filter.model';
import { PaginatedSearchOptions } from './../../shared/search/models/paginated-search-options.model';
import { AlertType } from './../../shared/alert/aletr-type';
import { ChartType } from './../../charts/models/chart-type';
import { mergeMap, tap } from 'rxjs/operators';
import { FacetValues } from './../../shared/search/models/facet-values.model';
import { ChartSeries } from './../../charts/models/chart-series';
import { RemoteData } from './../../core/data/remote-data';
import { getFirstCompletedRemoteData } from './../../core/shared/operators';
import { SearchFilterConfig } from './../../shared/search/models/search-filter-config.model';
import { SearchConfigurationService } from './../../core/shared/search/search-configuration.service';
import { SearchService } from '../../core/shared/search/search.service';
import { isNull, isEqual } from 'lodash';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { hasValue, isNotNull } from '../../shared/empty.util';
import { FacetValue } from '../../shared/search/models/facet-value.model';

@Component({
  selector: 'ds-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {
  /**
   * The search configuration
   * @type {string}
   */
  public configuration: string;

  /**
   * The search scope
   * @type {string}
   */
  public scope: string;

  /**
   * The filter name (e.g. 'graphitemtype')
   * @type {string}
   */
  public filterName: string;

  /**
   * The chart type
   * @type {ChartType}
   */
  public chartType: ChartType;

  /**
   * The chart data
   * @type {Observable<ChartSeries[]>}
   */
  public results$: Observable<ChartSeries[]>;

  /**
   * The graph container element reference
   * @type {ElementRef}
   */
  @ViewChild('graphContainer', { static: true }) graphContainer: ElementRef;

  /**
   * Array of default query params, used to define the search context
   * @type {string[]}
   */
  private defaultQueryParams: string[] = [
    'scope',
    'configuration',
    'filterName',
  ];

  /**
   * The query filter to get facet values for the search configuration
   * @type {string}
   */
  private queryFilterParams: SearchFilter[];

  /**
   * The notification error i18n key
   */
  public notificationErrorText = 'graph-page.warining.no-chart-type';

  /**
   * Flag to show/hide notification alert based on @var filterName
   */
  public showNotificationAlert = false;

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  /**
   * Flag to show/hide chart container on window resize,
   * used to provide chart responsiveness
   */
  public renderingControl = true;

  constructor(
    private aroute: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private searchConfigService: SearchConfigurationService,
    private chd: ChangeDetectorRef
  ) {
    this.scope = this.aroute.snapshot.queryParams.scope ?? null;
    this.configuration = this.aroute.snapshot.queryParams.configuration ?? 'default';
    this.filterName = this.aroute.snapshot.queryParams.filterName?.toString().toLowerCase() ?? null;

    // Check if the filter name is valid, if not redirect to 404
    this.getFilterConfig(this.filterName).subscribe((filter) => {
      if (!hasValue(filter)) {
        this.router.navigate(['/404']);
      }
    });

    this.queryFilterParams = this.filterQueryParams(
      this.aroute.snapshot.queryParams
    );
  }

  /**
   * Get the graph container width and height and set to the chart view array
   */
  get view() {
    return [
      this.graphContainer?.nativeElement?.offsetWidth,
      this.graphContainer?.nativeElement?.offsetHeight,
    ];
  }

  /**
   * Get the chart data from the facet values,
   * to pass to the chart component
   */
  ngOnInit(): void {
    const facetValues$: Observable<FacetValue[]> = this.getFilterConfig(
      this.filterName
    ).pipe(
      mergeMap((filter) => {
        return this.getFacetValues(filter);
      })
    );

    this.results$ = facetValues$.pipe(
      map((facetValues: FacetValue[]) => {
        return this.getChartValues(facetValues);
      })
    );
  }

  /**
   * Get facet values for the search configuration,
   * setting the configuration, scope and query filter params
   */
  getFacetValues(filterConfig: SearchFilterConfig): Observable<FacetValue[]> {
    const searchOptions = new PaginatedSearchOptions({
      configuration: this.configuration,
      scope: this.scope,
      filters: this.queryFilterParams,
    });
    return this.searchService
      .getFacetValuesFor(filterConfig, 1, searchOptions)
      .pipe(
        getFirstCompletedRemoteData(),
        map((rd: RemoteData<FacetValues>) => {
          return rd.payload.page;
        })
      );
  }

  /**
   * Get the filter configuration for the filter name
   */
  private getFilterConfig(filterName: string): Observable<SearchFilterConfig> {
    return isNull(filterName)
    ? of(null)
    : this.searchConfigService.getConfig(this.scope, this.configuration).pipe(
        getFirstCompletedRemoteData(),
        map((config: RemoteData<SearchFilterConfig[]>) =>
         config.hasSucceeded && hasValue(config.payload)
            ? config.payload.find((f) => isEqual(f.name, filterName))
            : null),
        tap((filter) => {
          if (isNotNull(filter)) {
            this.chartType = this.chartTypeFromFilterType(filter.filterType);
          }
        })
      );
  }

  /**
   * Get the chart data from the facet values
   */
  getChartValues(facetValues: FacetValue[]): ChartSeries[] {
    return facetValues.map(({ value, count, ...extra }) => ({
      name: value,
      value: count,
      extra,
    }));
  }

  /**
   * Get the chart type from the filter type.
   * If the filter type doesn't start with 'chart.', the chart type is null
   * and the notification alert is shown
   */
  private chartTypeFromFilterType(filterType: string): ChartType {
    const isChartType = filterType.startsWith('chart.');
    this.showNotificationAlert = !isChartType;
    if (isChartType) {
      const type = filterType.split('.').pop()?.toUpperCase();
      return type ? ChartType[type] : null;
    }
    return null;
  }

  /**
   * Method to create the query filter params string
   */
  private filterQueryParams(queryParams: Params): SearchFilter[] {
    const params = Object.entries(queryParams)
      .filter(
        ([key, value]) =>
          hasValue(value) && !this.defaultQueryParams.includes(key)
      )
      .map(([key, value]) => new SearchFilter(key, [value]));

    return params;
  }

  /**
   * Method to handle the window resize event
   * in order to re-render the chart and to resize it,
   * based on @var view values
   */
  @HostListener('window:resize')
  onResize() {
    this.renderingControl = false;
    setTimeout(() => {
      this.renderingControl = true;
      this.chd.detectChanges();
    });
  }
}
