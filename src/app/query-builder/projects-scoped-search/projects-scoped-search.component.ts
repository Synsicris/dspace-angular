import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';

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
   * Configuration name to use for the search
   */
  @Input() configuration = 'default';

  /**
   * Reference for configurationSearchPage
   */
  @ViewChildren('searchPage') searchPage: QueryList<any>;

  ngOnInit(): void {
    this.buildQuery(this.query);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.query && !changes.query.isFirstChange()) {
      this.buildQuery(changes.query.currentValue);
      this.searchPage.first.refresh();
    }
  }

  private buildQuery(query) {
    if (query) {
      this.query = `query={!join from=search.resourceid to=synsicris.relation.parentproject_authority}` +
        `{!join from=synsicris.relation.parentproject_authority to=search.resourceid}(${query})`;
    } else {
      this.query = '';
    }

  }

}
