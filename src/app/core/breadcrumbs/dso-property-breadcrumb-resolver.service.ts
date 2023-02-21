import { Injectable } from '@angular/core';
import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { ChildHALResource } from '../shared/child-hal-resource.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { Observable } from 'rxjs';
import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../shared/operators';
import { switchMap, take } from 'rxjs/operators';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';
import { IdentifiableDataService } from '../data/base/identifiable-data.service';
import { CacheableObject } from '../cache/cacheable-object.model';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';

@Injectable({
  providedIn: 'root'
})
export abstract class DSOPropertyBreadcrumbResolver<S extends ChildHALResource & DSpaceObject, T extends CacheableObject & { [key: string]: S }> extends DSOBreadcrumbResolver<S> {

  protected constructor(
    protected breadcrumbService: DSOBreadcrumbsService,
    protected dataService: IdentifiableDataService<S>,
    protected dataServiceT: IdentifiableDataService<T>
  ) {
    super(breadcrumbService, dataService);
  }

  abstract get followDSOLinks(): FollowLinkConfig<T>[];

  abstract mapProperty(dso: T): Observable<S | undefined>;

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BreadcrumbConfig<S>> {
    const uuid = route.params.id;
    return this.resolveProperty(uuid, state.url);
  }

  protected resolveDSO(uuid: string): Observable<T> {
    return this.dataServiceT.findById(uuid, true, false, ...this.followDSOLinks).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload()
    );
  }

  protected resolveProperty(dsoId: string, fullPath: string): Observable<BreadcrumbConfig<S>> {
    return this.resolveDSO(dsoId)
      .pipe(
        switchMap(dso => this.mapProperty(dso)),
        switchMap(s => this.resolveByUUID(s?.uuid, fullPath)),
        take(1)
      );
  }

}
