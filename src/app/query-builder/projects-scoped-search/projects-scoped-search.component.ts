import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { PROJECT_RELATION_SOLR } from '../../core/project/project-data.service';

@Component({
  selector: 'ds-projects-scoped-search',
  templateUrl: './projects-scoped-search.component.html',
  styleUrls: ['./projects-scoped-search.component.scss']
})
export class ProjectsScopedSearchComponent implements OnInit, OnChanges {

  /**
   * Query to use to restrict the search
   */
  @Input() query: string;

  /**
   * Custom message if no result
   */
  @Input() notFoundMessageKey = 'search.results.no-results.custom';
  /**
   * Configuration name to use for the search
   */
  @Input() configuration = 'default';

  /**
   * Reference for configurationSearchPage
   */
  @ViewChildren('searchPage') searchPage: QueryList<any>;

  forcedEmbeddedKeys: Map<string, string[]>;
  ngOnInit(): void {
    this.forcedEmbeddedKeys = new Map([[this.configuration, ['metrics, version']]]);
    this.buildQuery(this.query);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.query && !changes.query.isFirstChange()) {
      this.buildQuery(changes.query.currentValue);
      this.searchPage.first.triggerFreshSearch(this.query);
    }
  }

  private buildQuery(query) {
    if (query) {
      this.query = `query={!join from=search.resourceid to=${PROJECT_RELATION_SOLR}}` +
        `{!join from=${PROJECT_RELATION_SOLR} to=search.resourceid}(${query})`;
    } else {
      this.query = '';
    }

  }

}
