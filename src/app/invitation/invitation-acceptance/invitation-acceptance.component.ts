import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { Registration } from '../../core/shared/registration.model';
import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../../core/shared/operators';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { AuthService } from '../../core/auth/auth.service';
import { Community } from '../../core/shared/community.model';
import { CommunityDataService } from '../../core/data/community-data.service';

export interface InvitationGroupData {
  groupName: string;
  type: string;
  role: string;
  communityName: string;
}

@Component({
  selector: 'ds-invitation-acceptance',
  templateUrl: './invitation-acceptance.component.html',
  styleUrls: ['./invitation-acceptance.component.scss']
})
export class InvitationAcceptanceComponent implements OnInit {

  registrationData: Registration;
  invitationsGroupData$: BehaviorSubject<InvitationGroupData[]> = new BehaviorSubject([]);

  constructor(private router: Router,
              private route: ActivatedRoute,
              private epersonRegistrationService: EpersonRegistrationService,
              private epersonDataService: EPersonDataService,
              private communityService: CommunityDataService,
              private auth: AuthService) {
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((paramMap: ParamMap) => {
        const token = paramMap.get('registrationToken');
        return this.epersonRegistrationService.searchByToken(token);
      }),
      map((registrationData: Registration) => {
        this.registrationData = registrationData;
        return registrationData.groupNames.map((groupName, index) => {
          const groupNameArray = groupName.split('_');
          return {
            groupName,
            type: groupName.startsWith('project_') ? 'project' : 'funding',
            role: groupNameArray[2],
            communityName: registrationData.dspaceObjectNames[index]
          } as InvitationGroupData;
        });
      })
    ).subscribe((list: InvitationGroupData[]) => {
      this.invitationsGroupData$.next(list);
    });
  }

  accept() {
    this.auth.getAuthenticatedUserFromStore().pipe(
      take(1),
      switchMap((eperson: EPerson) =>
        this.epersonDataService.acceptInvitationToJoinGroups(eperson.id, this.registrationData.token).pipe(
          getFirstCompletedRemoteData()
        )
      )
    ).subscribe(() => {
      this.navigateToHome();
    });
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  getCommunity(parentId): Observable<Community> {
    return this.communityService.findById(parentId).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload()
    );
  }

}



