import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EpersonDtoModel } from '../../../../../core/eperson/models/eperson-dto.model';

@Component({
  selector: 'ds-confirm-withdraw',
  templateUrl: './confirm-withdraw.component.html',
  styleUrls: ['./confirm-withdraw.component.scss']
})
export class ConfirmWithdrawComponent {

  @Input() ePerson: EpersonDtoModel;
  @Input() messagePrefix: string;

  constructor(protected activeModal: NgbActiveModal) { }

  // tslint:disable-next-line:no-empty
  confirm() { }

  close() {
    this.activeModal.dismiss();
  }

}
