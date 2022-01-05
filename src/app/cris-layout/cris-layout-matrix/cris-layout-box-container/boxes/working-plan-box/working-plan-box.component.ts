import { Component, Inject, OnInit } from '@angular/core';

import { LayoutBox } from '../../../../enums/layout-box.enum';
import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { TranslateService } from '@ngx-translate/core';
import { getFirstSucceededRemoteDataPayload } from '../../../../../core/shared/operators';
import { Community } from '../../../../../core/shared/community.model';
import { ProjectDataService } from '../../../../../core/project/project-data.service';
import { Item } from '../../../../../core/shared/item.model';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';

@Component({
  selector: 'ds-working-plan-box',
  templateUrl: './working-plan-box.component.html',
  styleUrls: ['./working-plan-box.component.scss']
})
@RenderCrisLayoutBoxFor(LayoutBox.WORKINGPLAN)
export class WorkingPlanBoxComponent extends CrisLayoutBoxModelComponent implements OnInit {

  /**
   * The project community which the impact-pathways belong to
   */
  projectCommunityUUID: string;

  constructor(
    protected projectService: ProjectDataService,
    protected translateService: TranslateService,
    @Inject('boxProvider') public boxProvider: CrisLayoutBox,
    @Inject('itemProvider') public itemProvider: Item
  ) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.projectService.getProjectCommunityByItemId(this.item.uuid).pipe(
      getFirstSucceededRemoteDataPayload()
    ).subscribe((projectCommunity: Community) => {
      this.projectCommunityUUID = projectCommunity.uuid;
    });
  }

}
