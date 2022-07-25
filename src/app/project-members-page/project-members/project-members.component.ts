import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, from, Observable, Subscription } from 'rxjs';
import { mergeMap, reduce, take, tap } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Group } from '../../core/eperson/models/group.model';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { hasValue } from '../../shared/empty.util';
import { InvitationModalComponent } from '../../shared/invitation-modal/invitation-modal.component';
import { Community } from '../../core/shared/community.model';
import { ProjectGroupService } from '../../core/project/project-group.service';
import { RemoteData } from '../../core/data/remote-data';
import { createFailedRemoteDataObject$ } from '../../shared/remote-data.utils';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';

@Component({
  selector: 'ds-project-members',
  templateUrl: './project-members.component.html',
  styleUrls: ['./project-members.component.scss']
})
export class ProjectMembersComponent implements OnInit, OnDestroy {

  /**
   * The project/funding group to manage
   */
  @Input() targetGroup: Group;

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
    protected projectGroupService: ProjectGroupService) {

  }

  ngOnInit(): void {
    if (this.isAdminGroup) {
      this.helpMessageLabel = this.isFunding ? 'project.manage.members.funding.admin-group-help' : 'project.manage.members.project.admin-group-help';
    } else {
      this.helpMessageLabel = this.isFunding ? 'project.manage.members.funding.members-group-help' : 'project.manage.members.project.members-group-help';
    }
    this.groupService.editGroup(this.targetGroup);
    this.subs.push(
      this.groupService.getActiveGroup().subscribe((activeGroup) => {
        if (activeGroup != null) {
          this.groupBeingEdited.next(true);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  sendInvitation(email?: string) {

    this.getGroups().pipe(take(1))
      .subscribe((groups: string[]) => {
        this.modalRef = this.modalService.open(InvitationModalComponent);
        this.modalRef.componentInstance.groupList = groups;
        this.modalRef.componentInstance.email = email;
      });

  }

  /**
   * Add eperson to all groups needed for the current role
   * @param ePerson
   */
  addMemberToMultipleGroups(ePerson: EPerson): void {
    const processedGroups: Group[] = [];
    this.getGroups().pipe(
      take(1),
      mergeMap((groups: string[]) => from(groups).pipe(
        mergeMap((groupId: string) => this.getGroupEntity(groupId)),
        mergeMap((groupRD: RemoteData<Group>) => {
          if (groupRD.hasSucceeded) {
            processedGroups.push(groupRD.payload);
            return this.groupService.addMemberToGroup(groupRD.payload, ePerson).pipe(
              getFirstCompletedRemoteData()
            );
          } else {
            return createFailedRemoteDataObject$();
          }
        }),
        reduce((acc: any, value: any) => [...acc, value], []),
      )),
    ).subscribe((groups: RemoteData<Group>[]) => {
      const successfulReq = groups.filter((groupRD: RemoteData<Group>) => groupRD.hasSucceeded);

      if (successfulReq.length === groups.length) {
        this.notificationsService.success(this.translateService.get(this.messagePrefix + '.notification.success.addMember'));
        this.refreshGroupsMembers(processedGroups);
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.noActiveGroup'));
      }
    });

  }

  /**
   * Remove eperson from all groups needed for the current role
   * @param ePerson
   */
  deleteMemberToMultipleGroups(ePerson: EPerson) {
    const processedGroups: Group[] = [];
    this.getGroups().pipe(
      take(1),
      mergeMap((groups: string[]) => from(groups).pipe(
        tap((g) => console.log(g)),
        mergeMap((groupId: string) => this.getGroupEntity(groupId)),
        mergeMap((groupRD: RemoteData<Group>) => {
          console.log(groupRD);
          if (groupRD.hasSucceeded) {
            processedGroups.push(groupRD.payload);
            return this.groupService.deleteMemberFromGroup(groupRD.payload, ePerson).pipe(
              getFirstCompletedRemoteData()
            );
          } else {
            return createFailedRemoteDataObject$();
          }
        }),
        reduce((acc: any, value: any) => [...acc, value], []),
      )),
    ).subscribe((groups: RemoteData<Group>[]) => {
      console.log(groups);
      const successfulReq = groups.filter((groupRD: RemoteData<Group>) => groupRD.hasSucceeded);

      if (successfulReq.length === groups.length) {
        console.log(groups);
        this.notificationsService.success(this.translateService.get(this.messagePrefix + '.notification.success.deleteMember'));
        this.refreshGroupsMembers(processedGroups);
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.noActiveGroup'));
      }
    });

  }

  private getGroupEntity(groupId: string): Observable<RemoteData<Group>> {
    return this.groupService.findById(groupId).pipe(
      getFirstCompletedRemoteData()
    );
  }

  private getGroups(): Observable<string[]> {
    let groups$: Observable<string[]>;
    if (!this.isFunding) {
      if (this.isAdminGroup) {
        groups$ = this.projectGroupService.getInvitationProjectAllGroupsByCommunity(this.relatedCommunity);
      } else {
        groups$ = this.projectGroupService.getInvitationProjectMembersGroupsByCommunity(this.relatedCommunity);
      }
    } else {
      if (this.isAdminGroup) {
        groups$ = this.projectGroupService.getInvitationFundingAdminsGroupsByCommunity(this.relatedCommunity);
      } else {
        groups$ = this.projectGroupService.getInvitationFundingMembersGroupsByCommunity(this.relatedCommunity);
      }
    }

    return groups$;
  }

  private refreshGroupsMembers(processedGroups: Group[] ): void {
    processedGroups.forEach((groupRD: Group) => {
      this.epersonService.clearLinkRequests(groupRD._links.epersons.href);
    });
  }

}
