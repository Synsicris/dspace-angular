import { Component } from '@angular/core';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { ItemSearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { ProjectVersionService } from 'src/app/core/project/project-version.service';
import { Observable } from 'rxjs';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from './../../../../../core/shared/operators';
import { Version } from './../../../../../core/shared/version.model';

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


  constructor(
    protected projectVersion: ProjectVersionService,
    protected truncatableService: TruncatableService,
    protected dsoNameService: DSONameService) {
    super(truncatableService, dsoNameService);
  }

  getLastVisibleVersionByItemID(): Observable<Version> {
    return this.projectVersion.getLastVisibleVersionByItemID(this.dso.id).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload()
    );
  }


}
