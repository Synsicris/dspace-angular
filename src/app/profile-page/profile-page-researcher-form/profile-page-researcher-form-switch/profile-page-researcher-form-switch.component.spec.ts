import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePageResearcherFormSwitchComponent } from './profile-page-researcher-form-switch.component';

describe('ProfilePageResearcherFormSwitchComponent', () => {
  let component: ProfilePageResearcherFormSwitchComponent;
  let fixture: ComponentFixture<ProfilePageResearcherFormSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilePageResearcherFormSwitchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePageResearcherFormSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
