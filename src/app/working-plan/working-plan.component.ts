import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Workpackage } from './core/models/workpackage-step.model';
import { WorkingPlanStateService } from './core/working-plan-state.service';
import { CollectionDataService } from '../core/data/collection-data.service';
import { FindListOptions } from '../core/data/request.models';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { RemoteData } from '../core/data/remote-data';
import { PaginatedList } from '../core/data/paginated-list.model';
import { Collection } from '../core/shared/collection.model';
import { getFirstSucceededRemoteWithNotEmptyData } from '../core/shared/operators';
import { isEmpty } from '../shared/empty.util';

@Component({
  selector: 'ipw-working-plan',
  templateUrl: './working-plan.component.html',
  styleUrls: ['./working-plan.component.scss'],
})
export class WorkingPlanComponent implements OnInit, OnDestroy {

  @Input() public projectId: string;

  workPackageCollectionId: string;
  milestoneCollectionId: string;

  constructor(
    private cdr: ChangeDetectorRef,
    private collectionDataService: CollectionDataService,
    private workingPlanStateService: WorkingPlanStateService
  ) {
  }

  ngOnInit(): void {
    this.retrieveCollections();
  }

  ngAfterViewInit(): void {
    this.workingPlanStateService.isWorkingPlanLoaded().pipe(
      take(1)
    ).subscribe(() => {
      this.workingPlanStateService.dispatchRetrieveAllWorkpackages(this.projectId, environment.workingPlan.workingPlanPlaceMetadata);
    });
  }

  public getWorkpackages(): Observable<Workpackage[]> {
    return this.workingPlanStateService.getWorkpackages();
  }

  public isLoading(): Observable<boolean> {
    return this.workingPlanStateService.isLoading().pipe(
      map((loading) => loading && (isEmpty(this.workPackageCollectionId) || isEmpty(this.milestoneCollectionId))),
    );
  }

  ngOnDestroy(): void {
    this.workingPlanStateService.dispatchCleanState();
  }

  private retrieveCollections(): void {
    const findOptions: FindListOptions = {
      elementsPerPage: 10,
      currentPage: 1
    };
    const wpCollId$: Observable<Collection> = this.collectionDataService
      .getAuthorizedCollectionByCommunityAndEntityType(
        this.projectId,
        environment.workingPlan.workpackageEntityName,
        findOptions,
        true).pipe(
        getFirstSucceededRemoteWithNotEmptyData(),
        map((collections: RemoteData<PaginatedList<Collection>>) => {
          return collections.payload.page[0];
        })
      );
    const mlCollId$ = this.collectionDataService
      .getAuthorizedCollectionByCommunityAndEntityType(
        this.projectId,
        environment.workingPlan.milestoneEntityName,
        findOptions,
        true).pipe(
        getFirstSucceededRemoteWithNotEmptyData(),
        map((collections: RemoteData<PaginatedList<Collection>>) => {
          return collections.payload.page[0];
        })
      );
    combineLatest([wpCollId$, mlCollId$]).subscribe(([wpColl, mlColl]) => {
      this.workPackageCollectionId = wpColl.id;
      this.milestoneCollectionId = mlColl.id;
    });
  }
}
