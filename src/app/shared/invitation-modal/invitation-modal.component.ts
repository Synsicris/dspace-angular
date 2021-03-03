import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { Registration } from '../../core/shared/registration.model';
import { NotificationsService } from '../notifications/notifications.service';

@Component({
  selector: 'ds-invitation-modal',
  templateUrl: './invitation-modal.component.html',
  styleUrls: ['./invitation-modal.component.scss']
})
export class InvitationModalComponent implements OnInit {

  @Input() groupList: string[];

  /**
   * The invitation form group
   */
  public invitationForm: FormGroup;

  public processing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Initialize instance variables
   *
   * @param {NgbActiveModal} activeModal
   * @param {EpersonRegistrationService} registrationService
   * @param {FormBuilder} formBuilder
   * @param {NotificationsService} notificationService
   * @param {TranslateService} translate
   */
  constructor(
    protected activeModal: NgbActiveModal,
    protected registrationService: EpersonRegistrationService,
    protected formBuilder: FormBuilder,
    protected notificationService: NotificationsService,
    protected translate: TranslateService) {
  }

  /**
   * Initialize the component, setting up invitation form
   */
  ngOnInit(): void {
    this.invitationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Close the modal
   */
  close() {
    this.activeModal.close();
  }

  send() {
    this.processing$.next(true);
    const email = this.invitationForm.get('email').value;
    this.registrationService.sendInvitation(email, this.groupList).pipe(getFirstCompletedRemoteData())
      .subscribe((response: RemoteData<Registration>) => {
        if (response.isSuccess) {
          this.notificationService.success(null,this.translate.instant('project-overview.invitation.success'));
        } else {
          this.notificationService.error(null, this.translate.instant('project-overview.invitation.error'));
        }
        this.close();
      });
  }
}
