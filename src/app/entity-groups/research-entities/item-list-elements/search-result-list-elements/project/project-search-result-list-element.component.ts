import { Component } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import {
  listableObjectComponent
} from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import {
  ItemSearchResultListElementComponent
} from '../../../../../shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { ProjectVersionService } from '../../../../../core/project/project-version.service';
import { getFirstCompletedRemoteData } from '../../../../../core/shared/operators';
import { RemoteData } from '../../../../../core/data/remote-data';
import { Item } from 'src/app/core/shared/item.model';

@listableObjectComponent('ProjectSearchResult', ViewMode.ListElement)
@Component({
  selector: 'ds-project-search-result-list-element',
  styleUrls: ['./project-search-result-list-element.component.scss'],
  templateUrl: './project-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Project
 */
export class ProjectSearchResultListElementComponent extends ItemSearchResultListElementComponent {

  item$: BehaviorSubject<Item> = new BehaviorSubject<Item>(null);

  /**
   * @param projectVersion
   * @param truncatableService
   * @param dsoNameService
   */
  constructor(
    protected projectVersion: ProjectVersionService,
    protected truncatableService: TruncatableService,
    protected dsoNameService: DSONameService) {
    super(truncatableService, dsoNameService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.projectVersion.findLastVisibleItemVersionByItemID(this.dso.id).pipe(
      getFirstCompletedRemoteData()
    ).subscribe((versionRD: RemoteData<Item>) => {
      if (versionRD.hasSucceeded) {
        this.item$.next(versionRD.payload);
      }
    });
  }

}
