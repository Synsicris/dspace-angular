import { getFirstSucceededRemoteData, getRemoteDataPayload } from './../../core/shared/operators';
import { Group } from './../../core/eperson/models/group.model';
import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { GroupDataService } from '../../core/eperson/group-data.service';
import { InvitationModalComponent } from '../../shared/invitation-modal/invitation-modal.component';
import { Community } from '../../core/shared/community.model';
import { RemoteData } from '../../core/data/remote-data';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ds-manage-project-funders-group',
  templateUrl: './manage-group.component.html',
  styleUrls: ['./manage-group.component.scss']
})
export class ManageGroupComponent implements OnInit {

  /**
   * The project/funding group to manage
   */
  targetGroup: Group;

  /**
   * The project/funding community
   */
  @Input() relatedCommunity: Community;

  /**
   * Representing if managing a project admin group or not
   */
  @Input() isAdminGroup: boolean;

  /**
   * Representing if managing members of a funding
   */
  @Input() isFunding: boolean;

  groupBeingEdited: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * I18n message key for help box
   */
  helpMessageLabel;

  /**
   * I18n message prefix key
   */
  messagePrefix = 'project.manage';
  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];
  /**
   * Modal reference
   */
  private modalRef: NgbModalRef;

  constructor(
    protected epersonService: EPersonDataService,
    protected groupService: GroupDataService,
    protected modalService: NgbModal,
    protected translateService: TranslateService,
    protected notificationsService: NotificationsService,
    protected route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {

    this.route.paramMap.subscribe((data: any) => {
      this.setActiveGroup(data.params.id);
    });

    this.helpMessageLabel = this.messagePrefix + '.members-group-help';

  }

  sendInvitation(email?: string) {
    this.modalRef = this.modalService.open(InvitationModalComponent);
    this.modalRef.componentInstance.groupList = [this.targetGroup.id];
    this.modalRef.componentInstance.email = email;
  }

  /**
   * Add eperson to all groups needed for the current role
   * @param ePerson
   */
  addMemberToGroup(ePerson: EPerson): void {
    this.groupService.addMemberToGroup(this.targetGroup, ePerson).pipe(
      getFirstCompletedRemoteData()
    ).subscribe((group: RemoteData<Group>) => {
      if (group.hasSucceeded) {
        this.notificationsService.success(this.translateService.get(this.messagePrefix + '.notification.success.addMember'));
        this.refreshGroupsMembers();
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.noActiveGroup'));
      }
    });
  }

  /**
   * Remove eperson from all groups needed for the current role
   * @param ePerson
   */
  deleteMemberToGroup(ePerson: EPerson) {
    this.groupService.deleteMemberFromGroup(this.targetGroup, ePerson).pipe(
      getFirstCompletedRemoteData()
    ).subscribe((group: RemoteData<Group>) => {
      if (group.hasSucceeded) {
        this.notificationsService.success(this.translateService.get(this.messagePrefix + '.notification.success.deleteMember'));
        this.refreshGroupsMembers();
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.noActiveGroup'));
      }
    });
  }

  /**
   * Start editing the selected group
   * @param groupId   ID of group to set as active
   */
  setActiveGroup(groupId: string) {
    this.groupService.cancelEditGroup();
    this.groupService.findById(groupId)
      .pipe(
        getFirstSucceededRemoteData(),
        getRemoteDataPayload())
      .subscribe((group: Group) => {
        this.groupService.editGroup(group);
        this.targetGroup = group;
      });
  }

  private refreshGroupsMembers(): void {
    this.epersonService.clearLinkRequests(this.targetGroup._links.epersons.href);
  }

}
