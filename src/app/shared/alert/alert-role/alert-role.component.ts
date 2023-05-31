import { Component, Input, OnInit } from '@angular/core';
import { trigger } from '@angular/animations';
import { fadeOutLeave, fadeOutState } from '../../animations/fade';
import { AlertComponent } from '../alert.component';
import { AlertRole, defaultRole } from './alert-role';
import { from } from 'rxjs';
import { concatMap, filter, map, take, tap } from 'rxjs/operators';

/**
 * This component allow to create div that uses the Bootstrap's Alerts component.
 */
@Component({
  selector: 'ds-alert-role',
  animations: [
    trigger('enterLeave', [
      fadeOutLeave, fadeOutState,
    ])
  ],
  templateUrl: '../alert.component.html',
  styleUrls: ['../alert.component.scss']
})
export class AlertRoleComponent extends AlertComponent implements OnInit {

  @Input()
  alertRoles: AlertRole[] | null;

  @Input()
  dismissRoles: AlertRole[] | null;

  /**
   * Initialize the component
   */
  ngOnInit() {
    super.ngOnInit();
    this.initializeAlertRoles();
  }

  protected initializeAlertRoles() {
    if (this.alertRoles != null) {
      from([
        ...this.alertRoles,
        defaultRole
      ])
        .pipe(
          tap(() => this.isDismissed$.next(true)),
          concatMap(role =>
            role.isAuthorized()
              .pipe(
                map(authorized => ({ ...role, authorized }))
              )
          ),
          filter(({ authorized }) => authorized === true),
          take(1)
        ).subscribe(alertRole => {
        this.isDismissed$.next(false);
        this.content$.next(alertRole.mapContentKey(this.content));
      });
    } else if (this.dismissRoles != null) {
      from(this.dismissRoles)
        .pipe(
          concatMap(role =>
            role.isAuthorized()
              .pipe(
                map(authorized => ({ ...role, authorized }))
              )
          ),
          map(({ authorized }) => authorized),
          filter(Boolean),
          take(1)
        ).subscribe(dismiss => this.isDismissed$.next(dismiss));
    }
  }

}
