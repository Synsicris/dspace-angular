import { AuthorizationDataService } from './../../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from './../../../../core/data/feature-authorization/feature-id';
import { ConfirmWithdrawComponent } from './confirm-withdraw/confirm-withdraw.component';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  Observable,
  ObservedValueOf,
  of as observableOf,
  Subscription,
} from 'rxjs';
import { defaultIfEmpty, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { buildPaginatedList, PaginatedList } from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { EPersonDataService } from '../../../../core/eperson/eperson-data.service';
import { GroupDataService } from '../../../../core/eperson/group-data.service';
import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { Group } from '../../../../core/eperson/models/group.model';
import {
  getAllCompletedRemoteData,
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getRemoteDataPayload
} from '../../../../core/shared/operators';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { PaginationComponentOptions } from '../../../../shared/pagination/pagination-component-options.model';
import { EpersonDtoModel } from '../../../../core/eperson/models/eperson-dto.model';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Keys to keep track of specific subscriptions
 */
enum SubKey {
  ActiveGroup,
  MembersDTO,
  SearchResultsDTO,
}

@Component({
  selector: 'ds-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
/**
 * The list of members in the edit group page
 */
export class MembersListComponent implements OnInit, OnDestroy {

  @Input()
  messagePrefix: string;

  /**
   * Boolean representing if to show the admin edit actions
   */
  @Input() showHeadingTitle = true;

  /**
   * Boolean representing if to show the admin edit actions
   */
  @Input() showEditActions = true;

  /**
   * Boolean representing if to show the send invitation action
   */
  @Input() showInvitationAction = false;
  /**
   * Boolean representing if user can see the withdraw action
   */
  @Input() showWithdrawActions = false;
  /**
   * Boolean representing if to show the send invitation section
   */
  @Input() showInvitationPersonSection = false;

  /**
   * Boolean representing if to show the id column of the tables
   */
  @Input() showId = true;

  /**
   * Boolean representing if to show the id column of the tables
   */
  @Input() overrideAdmin = false;

  /**
   * EPeople being displayed in search result, initially all members, after search result of search
   */
  ePeopleSearchDtos: BehaviorSubject<PaginatedList<EpersonDtoModel>> = new BehaviorSubject<PaginatedList<EpersonDtoModel>>(undefined);
  /**
   * List of EPeople members of currently active group being edited
   */
  ePeopleMembersOfGroupDtos: BehaviorSubject<PaginatedList<EpersonDtoModel>> = new BehaviorSubject<PaginatedList<EpersonDtoModel>>(undefined);

  /**
   * Pagination config used to display the list of EPeople that are result of EPeople search
   */
  configSearch: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'sml',
    pageSize: 5,
    currentPage: 1
  });
  /**
   * Pagination config used to display the list of EPerson Membes of active group being edited
   */
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'ml',
    pageSize: 5,
    currentPage: 1
  });

  /**
   * Map of active subscriptions
   */
  subs: Map<SubKey, Subscription> = new Map();

  // The search form
  searchForm;

  // Current search in edit group - epeople search form
  currentSearchQuery: string;
  currentSearchScope: string;

  // Whether or not user has done a EPeople search yet
  searchDone: boolean;

  // current active group being edited
  groupBeingEdited: Group;

  paginationSub: Subscription;

  /**
   * A boolean representing if user is AdministratorOf for the current project/funding
   */
  isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Event emitted with the email address to which send invitation
   */
  @Output() sendInvitation: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Event emitted with the eperson to which add to groups
   */
  @Output() addMemberToMultipleGroups: EventEmitter<EPerson> = new EventEmitter<EPerson>();


  /**
   * Event emitted with the eperson to which delete from the groups
   */
  @Output() deleteMemberToMultipleGroups: EventEmitter<EPerson> = new EventEmitter<EPerson>();

  constructor(private groupDataService: GroupDataService,
    public ePersonDataService: EPersonDataService,
    private translateService: TranslateService,
    private notificationsService: NotificationsService,
    private formBuilder: FormBuilder,
    private paginationService: PaginationService,
    private modalService: NgbModal,
    protected authorizationService: AuthorizationDataService,
    private router: Router) {
    this.currentSearchQuery = '';
    this.currentSearchScope = 'metadata';
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group(({
      scope: 'metadata',
      query: '',
    }));
    this.subs.set(SubKey.ActiveGroup, this.groupDataService.getActiveGroup().subscribe((activeGroup: Group) => {
      if (activeGroup != null) {
        this.groupBeingEdited = activeGroup;
        this.retrieveMembers(this.config.currentPage);
      }
    }));

    this.authorizationService.isAuthorized(FeatureID.AdministratorOf).pipe(
      take(1)
    ).subscribe((isAdmin) => {
      this.isAdmin$.next(isAdmin);
    });

  }

  /**
   * Retrieve the EPersons that are members of the group
   *
   * @param page the number of the page to retrieve
   * @private
   */
  private retrieveMembers(page: number) {
    this.unsubFrom(SubKey.MembersDTO);
    this.subs.set(SubKey.MembersDTO,
      this.paginationService.getCurrentPagination(this.config.id, this.config).pipe(
        switchMap((currentPagination) => {
          return this.ePersonDataService.findListByHref(this.groupBeingEdited._links.epersons.href, {
            currentPage: currentPagination.currentPage,
            elementsPerPage: currentPagination.pageSize
          }
          );
        }),
        getAllCompletedRemoteData(),
        map((rd: RemoteData<any>) => {
          if (rd.hasFailed) {
            this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure', { cause: rd.errorMessage }));
          } else {
            return rd;
          }
        }),
        switchMap((epersonListRD: RemoteData<PaginatedList<EPerson>>) => {
        const dtos$ = observableCombineLatest([...epersonListRD.payload.page.map((member: EPerson) => {
            const dto$: Observable<EpersonDtoModel> = observableCombineLatest(
              this.isMemberOfGroup(member), (isMember: ObservedValueOf<Observable<boolean>>) => {
                const epersonDtoModel: EpersonDtoModel = new EpersonDtoModel();
                epersonDtoModel.eperson = member;
                epersonDtoModel.memberOfGroup = isMember;
                return epersonDtoModel;
              });
            return dto$;
        })]);
        return dtos$.pipe(defaultIfEmpty([]), map((dtos: EpersonDtoModel[]) => {
            return buildPaginatedList(epersonListRD.payload.pageInfo, dtos);
          }));
        }))
        .subscribe((paginatedListOfDTOs: PaginatedList<EpersonDtoModel>) => {
          this.ePeopleMembersOfGroupDtos.next(paginatedListOfDTOs);
        }));
  }

  /**
   * Whether or not the given ePerson is a member of the group currently being edited
   * @param possibleMember  EPerson that is a possible member (being tested) of the group currently being edited
   */
  isMemberOfGroup(possibleMember: EPerson): Observable<boolean> {
    return this.groupDataService.getActiveGroup().pipe(take(1),
      mergeMap((group: Group) => {
        if (group != null) {
          return this.ePersonDataService.findListByHref(group._links.epersons.href, {
            currentPage: 1,
            elementsPerPage: 9999
          })
            .pipe(
              getFirstSucceededRemoteData(),
              getRemoteDataPayload(),
              map((listEPeopleInGroup: PaginatedList<EPerson>) => listEPeopleInGroup.page.filter((ePersonInList: EPerson) => ePersonInList.id === possibleMember.id)),
              map((epeople: EPerson[]) => epeople.length > 0));
        } else {
          return observableOf(false);
        }
      }));
  }

  /**
   * Unsubscribe from a subscription if it's still subscribed, and remove it from the map of
   * active subscriptions
   *
   * @param key The key of the subscription to unsubscribe from
   * @private
   */
  private unsubFrom(key: SubKey) {
    if (this.subs.has(key)) {
      this.subs.get(key).unsubscribe();
      this.subs.delete(key);
    }
  }

  /**
   * Deletes a given EPerson from the members list of the group currently being edited
   * @param ePerson   EPerson we want to delete as member from group that is currently being edited
   */
  deleteMemberFromGroup(ePerson: EpersonDtoModel) {
    this.groupDataService.getActiveGroup().pipe(take(1)).subscribe((activeGroup: Group) => {
      if (activeGroup != null) {
        const response = this.groupDataService.deleteMemberFromGroup(activeGroup, ePerson.eperson);
        this.showNotifications('deleteMember', response, ePerson.eperson.name, activeGroup);
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.noActiveGroup'));
      }
    });
  }

  /**
   * Adds a given EPerson to the members list of the group currently being edited
   * @param ePerson   EPerson we want to add as member to group that is currently being edited
   */
  addMemberToGroup(ePerson: EpersonDtoModel) {
    ePerson.memberOfGroup = true;
    this.groupDataService.getActiveGroup().pipe(take(1)).subscribe((activeGroup: Group) => {
      if (activeGroup != null) {
        const response = this.groupDataService.addMemberToGroup(activeGroup, ePerson.eperson);
        this.showNotifications('addMember', response, ePerson.eperson.name, activeGroup);
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.noActiveGroup'));
      }
    });
  }


  /**
   * Dispatch addMemberToMultipleGroups event
   * @param ePerson
   */
  addMemberToAllGroups(ePerson: EpersonDtoModel) {
    this.addMemberToMultipleGroups.emit(ePerson.eperson);
    this.retrieveMembers(this.config.currentPage);
  }


  /**
   * Dispatch deleteMemberToMultipleGroups event
   * @param ePerson
   */
  deleteMemberToAllGroups(ePerson: EpersonDtoModel) {
    this.deleteMemberToMultipleGroups.emit(ePerson.eperson);
    this.retrieveMembers(this.config.currentPage);
  }


  /**
   * Dispatch sendInvitation event
   * @param ePerson
   */
  dispatchSendInvitation(ePerson: EpersonDtoModel) {
    this.sendInvitation.emit(ePerson.eperson.email);
  }

  /**
   * Search in the EPeople by name, email or metadata
   * @param data  Contains scope and query param
   */
  search(data: any) {
    this.unsubFrom(SubKey.SearchResultsDTO);
    this.subs.set(SubKey.SearchResultsDTO,
      this.paginationService.getCurrentPagination(this.configSearch.id, this.configSearch).pipe(
        switchMap((paginationOptions) => {

          const query: string = data.query;
          const scope: string = data.scope;
          if (query != null && this.currentSearchQuery !== query && this.groupBeingEdited) {
            this.router.navigate([], {
              queryParamsHandling: 'merge'
            });
            this.currentSearchQuery = query;
            this.paginationService.resetPage(this.configSearch.id);
          }
          if (scope != null && this.currentSearchScope !== scope && this.groupBeingEdited) {
            this.router.navigate([], {
              queryParamsHandling: 'merge'
            });
            this.currentSearchScope = scope;
            this.paginationService.resetPage(this.configSearch.id);
          }
          this.searchDone = true;

          return this.ePersonDataService.searchByScope(this.currentSearchScope, this.currentSearchQuery, {
            currentPage: paginationOptions.currentPage,
            elementsPerPage: paginationOptions.pageSize
          });
        }),
        getAllCompletedRemoteData(),
        map((rd: RemoteData<any>) => {
          if (rd.hasFailed) {
            this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure', { cause: rd.errorMessage }));
          } else {
            return rd;
          }
        }),
        switchMap((epersonListRD: RemoteData<PaginatedList<EPerson>>) => {
          const dtos$ = observableCombineLatest([...epersonListRD.payload.page.map((member: EPerson) => {
            const dto$: Observable<EpersonDtoModel> = observableCombineLatest(
              this.isMemberOfGroup(member), (isMember: ObservedValueOf<Observable<boolean>>) => {
                const epersonDtoModel: EpersonDtoModel = new EpersonDtoModel();
                epersonDtoModel.eperson = member;
                epersonDtoModel.memberOfGroup = isMember;
                return epersonDtoModel;
              });
            return dto$;
          })]);
          return dtos$.pipe(defaultIfEmpty([]), map((dtos: EpersonDtoModel[]) => {
            return buildPaginatedList(epersonListRD.payload.pageInfo, dtos);
          }));
        }))
        .subscribe((paginatedListOfDTOs: PaginatedList<EpersonDtoModel>) => {
          this.ePeopleSearchDtos.next(paginatedListOfDTOs);
        }));
  }

  /**
   * unsub all subscriptions
   */
  ngOnDestroy(): void {
    for (const key of this.subs.keys()) {
      this.unsubFrom(key);
    }
    this.paginationService.clearPagination(this.config.id);
    this.paginationService.clearPagination(this.configSearch.id);
  }

  /**
   * Shows a notification based on the success/failure of the request
   * @param messageSuffix   Suffix for message
   * @param response        RestResponse observable containing success/failure request
   * @param nameObject      Object request was about
   * @param activeGroup     Group currently being edited
   */
  showNotifications(messageSuffix: string, response: Observable<RemoteData<any>>, nameObject: string, activeGroup: Group) {
    response.pipe(getFirstCompletedRemoteData()).subscribe((rd: RemoteData<any>) => {
      if (rd.hasSucceeded) {
        this.notificationsService.success(this.translateService.get(this.messagePrefix + '.notification.success.' + messageSuffix, { name: nameObject }));
      } else {
        this.notificationsService.error(this.translateService.get(this.messagePrefix + '.notification.failure.' + messageSuffix, { name: nameObject }));
      }
    });
  }

  /**
   * Reset all input-fields to be empty and search all search
   */
  clearFormAndResetResult() {
    this.searchForm.patchValue({
      query: '',
    });
    this.search({ query: '' });
  }
  /**
   * Open modal
   *
   * @param content
   */
  public openModal(ePerson: EpersonDtoModel) {
    const modalRef = this.modalService.open(ConfirmWithdrawComponent);
    modalRef.componentInstance.ePerson = ePerson;
    modalRef.componentInstance.messagePrefix = this.messagePrefix;

    modalRef.componentInstance.confirm = () => {
      this.modalService.dismissAll();
      this.deleteMemberToAllGroups(ePerson);
    };

  }

}
