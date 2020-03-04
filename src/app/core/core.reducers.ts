import { ActionReducerMap, } from '@ngrx/store';

import { objectCacheReducer, ObjectCacheState } from './cache/object-cache.reducer';
import { indexReducer, MetaIndexState } from './index/index.reducer';
import { requestReducer, RequestState } from './data/request.reducer';
import { authReducer, AuthState } from './auth/auth.reducer';
import { jsonPatchOperationsReducer, JsonPatchOperationsState } from './json-patch/json-patch-operations.reducer';
import { serverSyncBufferReducer, ServerSyncBufferState } from './cache/server-sync-buffer.reducer';
import { objectUpdatesReducer, ObjectUpdatesState } from './data/object-updates/object-updates.reducer';
import { routeReducer, RouteState } from './services/route.reducer';
import {
  bitstreamFormatReducer,
  BitstreamFormatRegistryState
} from '../+admin/admin-registries/bitstream-formats/bitstream-format.reducers';
import { historyReducer, HistoryState } from './history/history.reducer';
import { impactPathwayReducer, ImpactPathwayState } from './impact-pathway/impact-pathway.reducer';
import { workingPlanReducer, WorkingPlanState } from './working-plan/working-plan.reducer';

export interface CoreState {
  'bitstreamFormats': BitstreamFormatRegistryState;
  'cache/object': ObjectCacheState,
  'cache/syncbuffer': ServerSyncBufferState,
  'cache/object-updates': ObjectUpdatesState
  'data/request': RequestState,
  'history': HistoryState;
  'index': MetaIndexState,
  'auth': AuthState,
  'json/patch': JsonPatchOperationsState,
  'route': RouteState,
  'impactPathway': ImpactPathwayState,
  'workingplan': WorkingPlanState

}

export const coreReducers: ActionReducerMap<CoreState> = {
  'bitstreamFormats': bitstreamFormatReducer,
  'cache/object': objectCacheReducer,
  'cache/syncbuffer': serverSyncBufferReducer,
  'cache/object-updates': objectUpdatesReducer,
  'data/request': requestReducer,
  'history': historyReducer,
  'index': indexReducer,
  'auth': authReducer,
  'json/patch': jsonPatchOperationsReducer,
  'route': routeReducer,
  'impactPathway': impactPathwayReducer,
  'workingplan': workingPlanReducer
};
