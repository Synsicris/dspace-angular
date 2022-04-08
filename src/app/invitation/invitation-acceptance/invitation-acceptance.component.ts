import { getRemoteDataPayload } from './../../core/shared/operators';
import { CommunityDataService } from './../../core/data/community-data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Registration } from '../../core/shared/registration.model';
import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { map, mergeMap, switchMap, take } from 'rxjs/operators';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { AuthService } from '../../core/auth/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Community } from '../../core/shared/community.model';

@Component({
  selector: 'ds-invitation-acceptance',
  templateUrl: './invitation-acceptance.component.html',
  styleUrls: ['./invitation-acceptance.component.scss']
})
export class InvitationAcceptanceComponent implements OnInit {

  registrationData: Registration;
  invitationsGroupData$ = new BehaviorSubject([]);

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
        return registrationData.groupNames;
      }),
      switchMap((groupNames: string[]) => groupNames),
      mergeMap((groupName: string) => {
        const groupNameArray = groupName.split('_');
        const parentId = groupNameArray[1];
        return this.getCommunity(parentId).pipe(
          map(community => ({ type: groupNameArray[2], community: community }))
        );
      }),
    ).subscribe((communityAndType: any) => {
      const val: any[] = this.invitationsGroupData$.value;
      val.push(communityAndType);
      this.invitationsGroupData$.next(val);
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
    return this.communityService.findById(parentId)
      .pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload()
      );
  }

}



