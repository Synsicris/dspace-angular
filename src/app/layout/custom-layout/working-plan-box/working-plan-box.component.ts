import { Component, ElementRef, OnInit } from '@angular/core';

import { CrisLayoutBox } from '../../decorators/cris-layout-box.decorator';
import { LayoutPage } from '../../enums/layout-page.enum';
import { LayoutTab } from '../../enums/layout-tab.enum';
import { LayoutBox } from '../../enums/layout-box.enum';
import { CrisLayoutBoxModelComponent as CrisLayoutBoxObj } from '../../models/cris-layout-box.model';
import { TranslateService } from '@ngx-translate/core';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { Community } from '../../../core/shared/community.model';
import { ProjectDataService } from '../../../core/project/project-data.service';

@Component({
  selector: 'ds-working-plan-box',
  templateUrl: './working-plan-box.component.html',
  styleUrls: ['./working-plan-box.component.scss']
})
@CrisLayoutBox(LayoutPage.DEFAULT, LayoutTab.DEFAULT, LayoutBox.WORKINGPLAN)
export class WorkingPlanBoxComponent extends CrisLayoutBoxObj implements OnInit {

  /**
   * The project community which the impact-pathways belong to
   */
  projectCommunityUUID: string;

  constructor(
    protected projectService: ProjectDataService,
    protected translateService: TranslateService,
    protected viewRef: ElementRef
  ) {
    super(translateService, viewRef);
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
