import { SearchConfigurationService } from './../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from './../../my-dspace-page/my-dspace-page.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ds-query-research-output',
  templateUrl: './query-research-output.component.html',
  styleUrls: ['./query-research-output.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
})
export class QueryResearchOutputComponent implements OnInit {
  searchAll = true;

  searchSelected = false;

  configurationName = 'default';

  /**
   * Filter name selected to fill the first dropdown
   * on query builder component
   *
   * @type {string}
   */
  firstDefaultFilter = 'entityType';

  constructor() {}

  ngOnInit(): void {}

  onTabSelect(stepNr: number) {
    switch (stepNr) {
      case CollapsibleSteps.StepOne:
        this.searchSelected = false;
        this.searchAll = true;
        break;

      case CollapsibleSteps.StepTwo:
        this.searchAll = false;
        this.searchSelected = true;
        break;

      default:
        break;
    }
  }
}

export enum CollapsibleSteps {
  StepOne = 1,
  StepTwo = 2,
}
