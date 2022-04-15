import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { Item } from '../../core/shared/item.model';
import { RemoteData } from '../../core/data/remote-data';
import { WorkingPlanService } from './working-plan.service';


/**
 * This class represents a resolver that retrieve item that describe the project from synsicris.relation.entity_project metadata
 */
@Injectable()
export class WorkingPlanItemResolver implements Resolve<RemoteData<Item>> {

  constructor(private workingPlanService: WorkingPlanService) {
  }

  /**
   * Method for resolving an item based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Item>> Emits the found Item based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Item>> {
    return this.workingPlanService.getWorkingPlanFromProjectId(route.params.id);
  }
}
