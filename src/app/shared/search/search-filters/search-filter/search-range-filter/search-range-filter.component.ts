
import { BehaviorSubject, combineLatest, combineLatest as observableCombineLatest, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { FilterType } from '../../../models/filter-type.model';
import { renderFacetFor } from '../search-filter-type-decorator';
import { facetLoad, SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';
import { SearchFilterConfig } from '../../../models/search-filter-config.model';
import {
  FILTER_CONFIG,
  IN_PLACE_SEARCH,
  REFRESH_FILTER,
  SearchFilterService
} from '../../../../../core/shared/search/search-filter.service';
import { SearchService } from '../../../../../core/shared/search/search.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { RouteService } from '../../../../../core/services/route.service';
import { hasValue } from '../../../../empty.util';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { environment } from './../../../../../../environments/environment';

/**
 * The suffix for a range filters' minimum in the frontend URL
 */
export const RANGE_FILTER_MIN_SUFFIX = '.min';

/**
 * The suffix for a range filters' maximum in the frontend URL
 */
export const RANGE_FILTER_MAX_SUFFIX = '.max';

/**
 * The date formats that are possible to appear in a date filter
 */
const dateFormats = ['YYYY', 'YYYY-MM', 'YYYY-MM-DD'];

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({
  selector: 'ds-search-range-filter',
  styleUrls: ['./search-range-filter.component.scss'],
  templateUrl: './search-range-filter.component.html',
  animations: [facetLoad]
})

/**
 * Component that represents a range facet for a specific filter configuration
 */
@renderFacetFor(FilterType.range)
export class SearchRangeFilterComponent extends SearchFacetFilterComponent implements OnInit, OnDestroy {
  /**
   * Fallback minimum for the range
   */
  min = 1950;

  /**
   * Fallback maximum for the range
   */
  max = new Date().getUTCFullYear();

  /**
   * The current range of the filter
   */
  range;

  /**
   * Subscription to unsubscribe from
   */
  sub: Subscription;

  /**
   * Whether the sider is being controlled by the keyboard.
   * Supresses any changes until the key is released.
   */
  keyboardControl: boolean;

  /**
   * The hovered date
   * @type {(NgbDate | null)}
   */
  hoveredDate: NgbDate | null = null;

  /**
   * The date to begin the range
   * @type {(NgbDate | null)}
   */
  fromDate: NgbDate | null;

  /**
   * The date to end the range
   * @type {(NgbDate | null)}
   */
  toDate: NgbDate | null;

  /**
   * A flag to indicate if the datepicker should be shown
   */
  showDatepicker = false;

  /**
   * ngbDatepicker ref to close after dates selection
   * @type {NgbInputDatepicker}
   */
  @ViewChild('datepicker') ngbDatepicker: NgbInputDatepicker;

  constructor(protected searchService: SearchService,
    protected filterService: SearchFilterService,
    protected router: Router,
    protected rdbs: RemoteDataBuildService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
    @Inject(IN_PLACE_SEARCH) public inPlaceSearch: boolean,
    @Inject(FILTER_CONFIG) public filterConfig: SearchFilterConfig,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(REFRESH_FILTER) public refreshFilters: BehaviorSubject<boolean>,
    private route: RouteService) {
    super(searchService, filterService, rdbs, router, searchConfigService, inPlaceSearch, filterConfig, refreshFilters);
  }

  /**
   * Initialize with the min and max values as configured in the filter configuration
   * Set the initial values of the range
   */
  async ngOnInit(): Promise<void> {
    super.ngOnInit();
    // getting configuration on order to define the calculations
    // if configuration => show datepicker and set the default range
    if (environment.layout.navbar.search.filters.datepicker.includes(this.filterConfig.name)) {
      this.showDatepicker = true;
      const prevWeek = this.calendar.getPrev(this.calendar.getToday(), 'd', 7);
      const nextWeek = this.calendar.getNext(this.calendar.getToday(), 'd', 7);

      // default applied filter
      await this.search(this.formatter.format(prevWeek), this.formatter.format(nextWeek));

      const fromDate = this.route.getQueryParameterValue(this.filterConfig.paramName + RANGE_FILTER_MIN_SUFFIX).pipe(startWith(undefined));
      const toDate = this.route.getQueryParameterValue(this.filterConfig.paramName + RANGE_FILTER_MAX_SUFFIX).pipe(startWith(undefined));

      this.sub = combineLatest([fromDate, toDate]).pipe(
        map(([from, to]) => {
          const fDate = hasValue(from) ? from : this.formatter.format(prevWeek);
          const tDate = hasValue(to) ? to : this.formatter.format(nextWeek);
          return [fDate, tDate];
        })
      ).subscribe((dates: string[]) => {
        this.fromDate = NgbDate.from(this.formatter.parse(dates[0]));
        this.toDate =  NgbDate.from(this.formatter.parse(dates[1]));
      });
    } else {
      this.min = moment(this.filterConfig.minValue, dateFormats).year() || this.min;
      this.max = moment(this.filterConfig.maxValue, dateFormats).year() || this.max;
      const iniMin = this.route.getQueryParameterValue(this.filterConfig.paramName + RANGE_FILTER_MIN_SUFFIX).pipe(startWith(undefined));
      const iniMax = this.route.getQueryParameterValue(this.filterConfig.paramName + RANGE_FILTER_MAX_SUFFIX).pipe(startWith(undefined));

      this.sub = observableCombineLatest(iniMin, iniMax).pipe(
        map(([min, max]) => {
          const minimum = hasValue(min) ? min : this.min;
          const maximum = hasValue(max) ? max : this.max;
          return [minimum, maximum];
        })
      ).subscribe((minmax) => this.range = minmax);
    }
  }

  /**
   * Submits new custom range values to the range filter from the widget
   */
  async onSubmit() {
    if (this.keyboardControl) {
      return;  // don't submit if a key is being held down
    }

    const newMin = this.range[0] !== this.min ? [this.range[0]] : null;
    const newMax = this.range[1] !== this.max ? [this.range[1]] : null;
    await this.search(newMin, newMax);
  }

  startKeyboardControl(): void {
    this.keyboardControl = true;
  }

  stopKeyboardControl(): void {
    this.keyboardControl = false;
  }

  /**
   * TODO when upgrading nouislider, verify that this check is still needed.
   * Prevents AoT bug
   * @returns {boolean} True if the platformId is a platform browser
   */
  shouldShowSlider(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Filter the date based on dates selections
   * @param date the selected date
   */
  async onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    if (hasValue(this.fromDate) && hasValue(this.toDate)) {
      this.ngbDatepicker?.close();
      await this.search(this.formatter.format(this.fromDate), this.formatter.format(this.toDate));
    }
  }

  /**
   * Returns if the date is valid and after fromDate when toDate is not selected yet
   * @param date the hovered date
   * @returns a validity flag
   */
  isHovered(date: NgbDate): boolean {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  /**
   * Returns if the date is valid and inside the range (fromDate - toDate)
   * @param date the selected date
   * @returns a validity flag
   */
  isInside(date: NgbDate): boolean {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  /**
   * Returns if the date is inside the range ([fromDate - toDate])
   * @param date the selected date
   * @returns a validity flag
   */
  isRange(date: NgbDate): boolean {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  /**
   * Returns if the selected value is a valid calendar date
   * @param currentValue the selected value | invalid input
   * @param input date farmated in string
   * @returns the valid date or null otherwise
   */
  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  private async search(minDate, maxDate) {
    await this.router.navigate(this.getSearchLinkParts(), {
      queryParams:
      {
        [this.filterConfig.paramName + RANGE_FILTER_MIN_SUFFIX]: minDate,
        [this.filterConfig.paramName + RANGE_FILTER_MAX_SUFFIX]: maxDate
      },
      queryParamsHandling: 'merge'
    });
    this.filter = '';
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
