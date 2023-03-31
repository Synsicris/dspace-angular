import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject, from, Observable, Subscription } from 'rxjs';
import { mergeMap, reduce, take } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Group } from '../../core/eperson/models/group.model';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ProjectGroupService } from '../../core/project/project-group.service';
import { hasValue } from '../../shared/empty.util';
import { InvitationModalComponent } from '../../shared/invitation-modal/invitation-modal.component';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { RemoteData } from '../../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { createFailedRemoteDataObject$ } from '../../shared/remote-data.utils';
import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'ds-programme-members',
  templateUrl: './programme-members.component.html',
  styleUrls: ['./programme-members.component.scss']
})
export class ProgrammeMembersComponent implements OnInit {

  /**
   * The programme item
   */
  @Input() relatedItem: Item;

  /**
   * The programme group to manage
   */
  @Input() targetGroup: Group;

  /**
   * Representing if managing a project funders group or not
   */
  @Input() isFundersGroup: boolean;

  /**
   * Representing if managing a programme organizational manager group or not
   */
  @Input() isManagersGroup: boolean;

  groupBeingEdited: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * I18n message key for help box
   */
  helpMessageLabel;

  /**
   * I18n message prefix key
   */
  messagePrefix = 'programme.manage';

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
    protected projectGroupService: ProjectGroupService
  ) {

  }

  ngOnInit(): void {
    if (this.isManagersGroup) {
      this.helpMessageLabel = this.messagePrefix + '.members.managers-group-help';
    } else if (this.isFundersGroup) {
      this.helpMessageLabel = this.messagePrefix + '.members.funders-group-help';
    } else {
      this.helpMessageLabel = this.messagePrefix + '.members.members-group-help';
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
        this.notificationsService.success(this.translateService.get(this.messagePrefix + '.members-list.notification.success.addMember'));
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.members-list.notification.failure.noActiveGroup'));
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
        this.notificationsService.success(this.translateService.get(this.messagePrefix + '.members-list.notification.success.deleteMember'));
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.members-list.notification.failure.noActiveGroup'));
      }
    });
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

  private getGroups(): Observable<string[]> {
    let groups$: Observable<string[]>;
    if (this.isManagersGroup) {
      groups$ = this.projectGroupService.getInvitationProgrammeFunderOrganizationalManagersGroupByItem(this.relatedItem);
    } else if (this.isFundersGroup) {
      groups$ = this.projectGroupService.getInvitationProgrammeProjectFundersGroupByItem(this.relatedItem);
    } else {
      groups$ = this.projectGroupService.getInvitationProgrammeReadersGroupByItem(this.relatedItem);
    }

    return groups$;
  }

  private getGroupEntity(groupId: string): Observable<RemoteData<Group>> {
    return this.groupService.findById(groupId).pipe(
      getFirstCompletedRemoteData()
    );
  }

}
