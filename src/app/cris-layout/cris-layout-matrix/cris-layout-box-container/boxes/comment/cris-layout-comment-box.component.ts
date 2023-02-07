import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { CrisLayoutRelationBoxComponent } from '../relation/cris-layout-relation-box.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CrisLayoutBox } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';
import { Observable, of } from 'rxjs';
import { ProjectDataService, VERSION_UNIQUE_ID } from '../../../../../core/project/project-data.service';
import { hasValue } from '../../../../../shared/empty.util';
import { environment } from '../../../../../../environments/environment';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { AuthorizationDataService } from '../../../../../core/data/feature-authorization/authorization-data.service';

@Component({
  selector: 'ds-cris-layout-comment-box',
  templateUrl: './cris-layout-comment-box.component.html',
  styleUrls: ['../relation/cris-layout-relation-box.component.scss']
})
@RenderCrisLayoutBoxFor(LayoutBox.COMMENT)
@RenderCrisLayoutBoxFor(LayoutBox.COMMENT_ALL)
export class CrisLayoutCommentBoxComponent extends CrisLayoutRelationBoxComponent implements OnInit, OnDestroy {

  /**
   * @param authorizationService
   * @param cd
   * @param itemService
   * @param projectService
   * @param route
   * @param translateService
   * @param boxProvider
   * @param itemProvider
   */
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
    super.ngOnInit();
  }

  /**
   * Activates / Deactivates the creation of an item {@link ItemCreateComponent}, depending
   * on the value emitted from this observable.
   * The Observable will emit:
   *   - `true` to enable the item creation
   *   - `false` to disable the item creation
   *
   * @protected
   */
  protected initCanCreateItems$(): Observable<boolean> {
    return of(this.box.boxType === LayoutBox.COMMENT);
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
