import { of as observableOf } from 'rxjs';
import { first } from 'rxjs/operators';

import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { CoordinatorPageResolver } from './coordinator-page.resolver';
import { EPersonMock } from '../shared/testing/eperson.mock';
import { RouterStub } from '../shared/testing/router.stub';

describe('CollectionPageResolver', () => {
  describe('resolve', () => {
    let resolver: CoordinatorPageResolver;
    let itemService: any;
    let researcherProfileService: any;
    let authService: any;
    const router: any = new RouterStub();
    const uuid = '1234-65487-12354-1235';

    beforeEach(() => {
      itemService = {
        findById: (id: string) => createSuccessfulRemoteDataObject$({ id })
      };
      researcherProfileService = jasmine.createSpyObj('researcherProfileService', {
        findRelatedItemId: observableOf ( uuid ),
        isLinkedToOrcid: true
      });
      authService = jasmine.createSpyObj('authService', {
        isAuthenticated: observableOf(true),
        getAuthenticatedUserFromStore: observableOf(EPersonMock)
      });
      resolver = new CoordinatorPageResolver(authService, itemService, researcherProfileService, router);
    });

    it('should resolve a researcher profile', (done) => {
      resolver.resolve(undefined, undefined)
        .pipe(first())
        .subscribe(
          (resolved) => {
            expect(resolved.payload.id).toEqual(uuid);
            done();
          }
        );
    });
  });
});
