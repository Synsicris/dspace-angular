import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of as observableOf } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, startWith } from 'rxjs/operators';

import { SearchFilter } from '../shared/search/search-filter.model';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { PaginatedList } from '../core/data/paginated-list';
import { PaginatedSearchOptions } from '../shared/search/paginated-search-options.model';
import { RemoteData } from '../core/data/remote-data';
import { SearchResult } from '../shared/search/search-result.model';
import { hasValue } from '../shared/empty.util';
import { followLink } from '../shared/utils/follow-link-config.model';
import { Item } from '../core/shared/item.model';
import { SearchService } from '../core/shared/search/search.service';
import { getFirstSucceededRemoteDataPayload } from '../core/shared/operators';
import { LinkService } from '../core/cache/builders/link.service';

@Component({
  selector: 'ds-project-overview-page',
  templateUrl: './project-overview-page.component.html',
  styleUrls: ['./project-overview-page.component.scss']
})
export class ProjectOverviewPageComponent implements OnInit {

  impactPathwayUUID: string

  constructor(protected linkService: LinkService, protected router: Router, protected searchService: SearchService) {
  }

  ngOnInit() {
    this.getFirstImpactPathway()
      .subscribe((UUID) => {
        console.log(UUID);
        this.impactPathwayUUID = UUID
      });
  }

  /**
   * Get the uuid of the first impact pathway item available
   */
  getFirstImpactPathway(): Observable<string> {
    const filters: SearchFilter[] = [new SearchFilter('f.entityType', ['impactpathway'])]
    const sort = new SortOptions('dc.title', SortDirection.ASC);
    const pagination = new PaginationComponentOptions()
    const searchOptions = new PaginatedSearchOptions({
      configuration: 'default',
      query: '',
      filters: filters,
      pagination: pagination,
      sort: sort
    });

    return this.searchService.search(searchOptions).pipe(
      filter((rd: RemoteData<PaginatedList<SearchResult<any>>>) => rd.hasSucceeded),
      map((rd: RemoteData<PaginatedList<SearchResult<any>>>) => {
        const dsoPage: any[] = rd.payload.page
          .filter((result) => hasValue(result))
          .map((searchResult: SearchResult<any>) => {
            if (searchResult.indexableObject.type === 'item') {
              return observableOf((searchResult.indexableObject));
            } else {
              this.linkService.resolveLink(searchResult.indexableObject, followLink('item'));
              return searchResult.indexableObject.item.pipe(
                getFirstSucceededRemoteDataPayload()
              )
            }
          });
        const payload = Object.assign(rd.payload, { page: dsoPage }) as PaginatedList<any>;
        return Object.assign(rd, { payload: payload });
      }),
      map((rd: RemoteData<PaginatedList<Observable<Item>>>) => rd.payload),
      filter((list: PaginatedList<Observable<Item>>) => list.page.length > 0),
      flatMap((list: PaginatedList<Observable<Item>>) => (list.page[0]).pipe(
        map((item: Item) => item.id)
      )),
      startWith(''),
      distinctUntilChanged()
    );
  }

}
