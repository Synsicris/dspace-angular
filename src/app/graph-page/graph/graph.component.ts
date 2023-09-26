import { ChartData } from '../../charts/models/chart-data';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SearchFilter } from '../../shared/search/models/search-filter.model';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { AlertType } from '../../shared/alert/aletr-type';
import { ChartType } from '../../charts/models/chart-type';
import { mergeMap, switchMap, tap } from 'rxjs/operators';
import { FacetValues } from '../../shared/search/models/facet-values.model';
import { ChartSeries } from '../../charts/models/chart-series';
import { RemoteData } from '../../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { SearchFilterConfig } from '../../shared/search/models/search-filter-config.model';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { SearchService } from '../../core/shared/search/search.service';
import isNull from 'lodash/isNull';
import isEqual from 'lodash/isEqual';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
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
  public results$: Observable<ChartSeries[] | ChartData[]>;

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

  public filterType: string;

  public isLastPage$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  getAllElementsGraphTypes = [
    'chart.bar.right-to-left',
    'chart.bar.left-to-right',
  ];

  public pageNr = 1;

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
    this.calculateResults();
  }

  /**
   * Get the chart data from the facet values,
   */
  private calculateResults() {
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
   * setting the configuration, scope and query filter params.
   * If the filter type is one of the getAllElementsGraphTypes,
   * the pageSize is set to the total number of elements.
   * @param filterConfig The search filter configuration
   */
  getFacetValues(filterConfig: SearchFilterConfig): Observable<FacetValue[]> {
    const searchOptions = new PaginatedSearchOptions({
      configuration: this.configuration,
      scope: this.scope,
      filters: this.queryFilterParams,
      pagination: Object.assign(new PaginationComponentOptions(), {
        currentPage: this.pageNr,
      }),
    });

    return this.searchService
      .getFacetValuesFor(filterConfig, this.pageNr, searchOptions)
      .pipe(
        getFirstCompletedRemoteData(),
        switchMap((rd: RemoteData<FacetValues>) => {
          if (
            this.getAllElementsGraphTypes.includes(this.filterType) &&
            hasValue(rd.payload && +rd.payload.more > 0)
          ) {
            filterConfig.pageSize = rd.payload.pageInfo.elementsPerPage + +rd.payload.more ?? filterConfig.pageSize;
            return this.searchService
              .getFacetValuesFor(filterConfig, this.pageNr, searchOptions)
              .pipe(
                tap(() => {
                  this.chd.detectChanges();
                })
              );
          } else {
            return of(rd);
          }
        }),
        map((rd: RemoteData<FacetValues>) => {
          if (rd.payload) {
            return rd.payload.page;
          }
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
              : null
          ),
          tap((filter) => {
            if (isNotNull(filter)) {
              this.filterType = filter.filterType;
              this.chartType = this.getChartType(filter.filterType);
            }
          })
        );
  }

  /**
   * Get the chart data from the facet values
   * If the filter type is a chart.line, the chart data is returned as a ChartData array,
   * otherwise the chart data is returned as a ChartSeries array.
   * @param facetValues The facet values
   * @returns The chart data
   */
  getChartValues(facetValues: FacetValue[]): ChartSeries[] | ChartData[] {
    if (facetValues?.length > 0) {
      if (this.filterType.includes('reverse')) {
        facetValues.map(({ value, count, ...extra }) => ({
          name: count.toString(),
          value: Number(value),
          extra,
        }));
      } else if (this.filterType !== 'chart.line') {
        return facetValues.map(({ value, count, ...extra }) => ({
          name: value,
          value: count,
          extra,
        }));
      } else {
        return [
          {
            name: this.filterName,
            series: facetValues.map(({ value, count, ...extra }) => ({
              name: value,
              value: count,
              extra,
            })),
          },
        ];
      }
    }
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

  /**
   * Get the chart type from the filter type.
   * If the filter type doesn't start with 'chart.'
   * a warning notification alert is shown
   */
  getChartType(filterType): ChartType {
    const isChartType = filterType.startsWith('chart.');
    this.showNotificationAlert = !isChartType;

    switch (filterType) {
      case 'chart.bar':
        return ChartType.BAR;
      case 'chart.pie':
        return ChartType.PIE;
      case 'chart.line':
        return ChartType.LINE;
      case 'chart.bar.horizontal':
        return ChartType.BAR_HORIZONTAL;
      case 'chart.bar.right-to-left':
        return ChartType.BAR;
      case 'chart.bar.left-to-right':
        return ChartType.BAR;
      case 'chart.reverse-bar.horizontal':
        return ChartType.BAR_HORIZONTAL;
      case 'chart.reverse-bar':
        return ChartType.BAR;
      default:
        return null;
    }
  }

  enableScrollToLeft(filterType) {
    return isEqual(filterType, 'chart.bar.right-to-left');
  }

  enableScrollToRight(filterType) {
    return isEqual(filterType, 'chart.bar.left-to-right');
  }
}
