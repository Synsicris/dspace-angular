import { of as observableOf } from 'rxjs';
import { SearchService } from '../../core/shared/search/search.service';
import { MYDSPACE_ROUTE } from '../../+my-dspace-page/my-dspace-page.component';

export function getMockSearchService(): SearchService {
  return jasmine.createSpyObj('searchService', {
    search: '',
    getEndpoint: observableOf('discover/search/objects'),
    getSearchLink: MYDSPACE_ROUTE,
    getScopes: observableOf(['test-scope']),
    setServiceOptions: {}
  });
}
