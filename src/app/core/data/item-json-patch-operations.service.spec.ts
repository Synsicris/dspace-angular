import { Store } from '@ngrx/store';

import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';

import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestService } from './request.service';
import { PatchRequest } from './request.models';
import { ItemJsonPatchOperationsService } from './item-json-patch-operations.service';
import { getMockRemoteDataBuildService } from '../../shared/mocks/remote-data-build.service.mock';

describe('ItemJsonPatchOperationsService', () => {
  let scheduler: TestScheduler;
  let service: ItemJsonPatchOperationsService;
  const requestService = {} as RequestService;
  const store = {} as Store<CoreState>;
  const halEndpointService = {} as HALEndpointService;
  const rdbService = getMockRemoteDataBuildService();

  function initTestService() {
    return new ItemJsonPatchOperationsService(
      requestService,
      store,
      halEndpointService,
      rdbService
    );
  }

  beforeEach(() => {
    scheduler = getTestScheduler();
    service = initTestService();
  });

  it('should instantiate ItemJsonPatchOperationsService properly', () => {
    expect(service).toBeDefined();
    expect((service as any).patchRequestConstructor).toEqual(PatchRequest);
  });

});
