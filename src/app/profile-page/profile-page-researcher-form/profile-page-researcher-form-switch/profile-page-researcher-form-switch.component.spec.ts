import { TranslateLoaderMock } from './../../../shared/testing/translate-loader.mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePageResearcherFormSwitchComponent } from './profile-page-researcher-form-switch.component';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

describe('ProfilePageResearcherFormSwitchComponent', () => {
  let component: ProfilePageResearcherFormSwitchComponent;
  let fixture: ComponentFixture<ProfilePageResearcherFormSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfilePageResearcherFormSwitchComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
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
