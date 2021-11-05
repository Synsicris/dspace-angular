import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Config } from '../../../../config/config.interface';
import { ResearcherProfileVisibilityValue } from '../../../core/profile/model/researcher-profile.model';

export interface VisibilityConfig extends Config {
  value: ResearcherProfileVisibilityValue;
  icon: string;
  color: string;
  label: string;
}

@Component({
  selector: 'ds-profile-page-researcher-form-switch',
  templateUrl: './profile-page-researcher-form-switch.component.html',
  styleUrls: ['./profile-page-researcher-form-switch.component.scss']
})
export class ProfilePageResearcherFormSwitchComponent {

  /**
   * The current visibility value
   */
  @Input() visibility = ResearcherProfileVisibilityValue.PRIVATE;

  /**
   * The available visibility options
   */
  visibilityOptions: VisibilityConfig[] = [
    {
      value: ResearcherProfileVisibilityValue.PRIVATE,
      icon: 'fa fa-lock',
      color: 'text-danger',
      label: 'researcher.profile.private.visibility'
    },
    {
      value: ResearcherProfileVisibilityValue.INTERNAL,
      icon: 'fa fa-key',
      color: 'text-warning',
      label: 'researcher.profile.internal.visibility'
    },
    {
      value: ResearcherProfileVisibilityValue.PUBLIC,
      icon: 'fa fa-globe',
      color: 'text-success',
      label: 'researcher.profile.public.visibility'
    },
  ];

  /**
   * Event emitted with the toggled visibility value
   */
  @Output() visibilityChange: EventEmitter<ResearcherProfileVisibilityValue> = new EventEmitter<ResearcherProfileVisibilityValue>();

  /**
   * Emit visibilityChange on toggle
   * @param visibility The new visibility value
   */
  changeSelectedSecurity(visibility: ResearcherProfileVisibilityValue) {
    this.visibilityChange.emit(visibility);
  }
}
