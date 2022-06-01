import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { isNotEmpty } from '../../empty.util';
import {
  POLICY_GROUP_METADATA,
  POLICY_SHARED_METADATA,
  ProjectDataService,
  ProjectGrantsTypes
} from '../../../core/project/project-data.service';
import { ProjectGroupService } from '../../../core/project/project-group.service';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-grant-badge',
  styleUrls: ['./grant-badge.component.scss'],
  templateUrl: './grant-badge.component.html'
})
/**
 * Component rendering the type of item as a badge
 */
export class GrantBadgeComponent implements OnInit {

  /**
   * The component used to retrieve the type from
   */
  @Input() object: DSpaceObject;
  /**
   * Containt the badge message to display
   */
  badgeMessage: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Contain the policy group name
   */
  policyGroup: string;

  /**
   * Contain the policy shared value
   */
  projectShared: string;

  /**
   * Contain the value when policy is open
   */
  parentProjectPolicy: string = ProjectGrantsTypes.Parentproject;

  /**
   * Contain the value when policy is restricted
   */
  projectPolicy: string = ProjectGrantsTypes.Subproject;

  constructor(
    private projectService: ProjectDataService,
    private projectGroupService: ProjectGroupService,
    private translate: TranslateService) {
  }

  ngOnInit() {
    if (isNotEmpty(this.object.firstMetadataValue(POLICY_SHARED_METADATA))) {
      this.projectShared = this.object.firstMetadataValue(POLICY_SHARED_METADATA);
    }

    if (isNotEmpty(this.object.firstMetadataValue(POLICY_GROUP_METADATA))) {
      this.policyGroup = this.object.firstMetadataValue(POLICY_GROUP_METADATA);
    }

    if (isNotEmpty(this.policyGroup)) {
      if (this.projectShared === ProjectGrantsTypes.Parentproject) {
        this.badgeMessage.next(this.translate.instant('item.grant.badge.parentproject'));
      } else {
        const communityId = this.projectGroupService.getCommunityIdByGroupName(this.policyGroup);
        this.projectService.getProjectItemByProjectCommunityId(communityId)
          .subscribe((projectItemRD: RemoteData<Item>) => {
            const projectItemName = (projectItemRD.hasSucceeded) ? projectItemRD.payload?.name : '';
            this.badgeMessage.next(this.translate.instant('item.grant.badge.project',{ name: projectItemName } ));
          });
      }
    }
  }


}
