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
import { VERSION_UNIQUE_ID } from '../../../../../core/project/project-data.service';
import { hasValue } from '../../../../../shared/empty.util';

@Component({
  selector: 'ds-cris-layout-comment-box',
  templateUrl: '../relation/cris-layout-relation-box.component.html',
  styleUrls: ['../relation/cris-layout-relation-box.component.scss']
})
@RenderCrisLayoutBoxFor(LayoutBox.COMMENT)
export class CrisLayoutCommentBoxComponent extends CrisLayoutRelationBoxComponent implements OnInit, OnDestroy {

  constructor(
    public readonly cd: ChangeDetectorRef,
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

  protected initCanCreateItems$(): Observable<boolean> {
    return of(true);
  }

  protected getProjectScope$(): Observable<Community> {
    return super.getProjectScope$();
  }

  protected initSearchFilter(item: Item) {
    this.searchFilter = `scope=${this.getUniqueId(item)}`;
  }

  private getUniqueId(item: Item): string {
    const uniqueId = item.firstMetadataValue(VERSION_UNIQUE_ID);
    let scopeId = null;
    if (!hasValue(uniqueId) || !hasValue(scopeId = uniqueId.split('_')[0])) {
      return item.id;
    }
    return scopeId;
  }

}
