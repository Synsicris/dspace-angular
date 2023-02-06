import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { CrisLayoutRelationBoxComponent } from '../relation/cris-layout-relation-box.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CrisLayoutBox } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';
import { Observable, of } from 'rxjs';
import { Community } from '../../../../../core/shared/community.model';
import { ProjectDataService, VERSION_UNIQUE_ID } from '../../../../../core/project/project-data.service';
import { hasValue } from '../../../../../shared/empty.util';
import { environment } from '../../../../../../environments/environment';
import { filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { getFirstCompletedRemoteData } from '../../../../../core/shared/operators';
import { RemoteData } from '../../../../../core/data/remote-data';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { AuthorizationDataService } from '../../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../../../core/data/feature-authorization/feature-id';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'ds-cris-layout-comment-box',
  templateUrl: './cris-layout-comment-box.component.html',
  styleUrls: ['../relation/cris-layout-relation-box.component.scss']
})
@RenderCrisLayoutBoxFor(LayoutBox.COMMENT)
export class CrisLayoutCommentBoxComponent extends CrisLayoutRelationBoxComponent implements OnInit, OnDestroy {

  canCreateComment$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    public readonly authorizationService: AuthorizationDataService,
    public readonly cd: ChangeDetectorRef,
    public readonly itemService: ItemDataService,
    public readonly projectService: ProjectDataService,
    protected readonly route: ActivatedRoute,
    protected readonly translateService: TranslateService,
    @Inject('boxProvider') public boxProvider: CrisLayoutBox,
    @Inject('itemProvider') public itemProvider: Item
  ) {
    super(cd, route, translateService, boxProvider, itemProvider);
  }

  ngOnInit(): void {
    const isVersionOfAnItem$ = this.route.data.pipe(
      map((data) => data.isVersionOfAnItem),
      filter((isVersionOfAnItem) => isVersionOfAnItem === true),
      take(1)
    );

    this.projectService.getProjectItemByItemId(this.item.id).pipe(
      getFirstCompletedRemoteData(),
      withLatestFrom(isVersionOfAnItem$),
      switchMap(([projectItemRD, isVersionOfAnItem]: [RemoteData<Item>, boolean]) => {
        if (!isVersionOfAnItem) {
          return of(false);
        } else {
          const uniqueId = projectItemRD.payload.firstMetadataValue(VERSION_UNIQUE_ID);
          const projectId = uniqueId.split('_')[0];
          return this.itemService.findById(projectId).pipe(
            getFirstCompletedRemoteData(),
            switchMap((projectItemRD: RemoteData<Item>) => this.authorizationService.isAuthorized(FeatureID.isFunderOfProject, projectItemRD.payload.self))
          )
        }
      })
    ).subscribe((canCreateComment) => {
      this.canCreateComment$.next(canCreateComment);
    });


    super.ngOnInit();
  }

  protected initCanCreateItems$(): Observable<boolean> {
    return this.canCreateComment$.asObservable();
  }

  protected getProjectScope$(): Observable<Community> {
    return super.getProjectScope$();
  }

  protected initSearchFilter(item: Item) {
    this.searchFilter = `scope=${this.getScopeItemId(item)}`;
  }

  private getScopeItemId(item: Item): string {
    const uniqueId = item.firstMetadataValue(VERSION_UNIQUE_ID);
    let scopeId = null;
    if (!hasValue(uniqueId) || !hasValue(scopeId = uniqueId.split('_')[0])) {
      return item.id;
    }
    return scopeId;
  }

  getTargetEntity() {
    return environment.comments.commentEntityType;
  }
}
