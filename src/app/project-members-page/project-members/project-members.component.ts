import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Group } from '../../core/eperson/models/group.model';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { hasValue } from '../../shared/empty.util';
import { InvitationModalComponent } from '../../shared/invitation-modal/invitation-modal.component';
import { Community } from '../../core/shared/community.model';
import { ProjectGroupService } from '../../core/project/project-group.service';

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

  constructor(protected groupService: GroupDataService, protected modalService: NgbModal, protected projectGroupService: ProjectGroupService) {

  }

  ngOnInit(): void {
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
    this.groupService.cancelEditGroup();
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  sendInvitation(email?: string) {
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

    groups$.pipe(take(1))
      .subscribe((groups: string[]) => {
        this.modalRef = this.modalService.open(InvitationModalComponent);
        this.modalRef.componentInstance.groupList = groups;
        this.modalRef.componentInstance.email = email;
      });

  }
}
