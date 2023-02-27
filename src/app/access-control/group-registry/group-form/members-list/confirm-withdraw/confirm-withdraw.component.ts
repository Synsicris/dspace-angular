import { Component, Input } from '@angular/core';
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

  confirm() {
    return;
  }

  close() {
    this.activeModal.dismiss();
  }

}
