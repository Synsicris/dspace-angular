import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../core/auth/auth.service';

import { EasyOnlineImportPageComponent } from './easy-online-import-page.component';

describe('EasyOnlineImportPageComponent', () => {
  let component: EasyOnlineImportPageComponent;
  let fixture: ComponentFixture<EasyOnlineImportPageComponent>;

  const authServiceStub = jasmine.createSpyObj('authorizationService', {
    getAuthenticatedUserFromStore: jasmine.createSpy('getAuthenticatedUserFromStore'),
    isAuthenticated: jasmine.createSpy('isAuthenticated')
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EasyOnlineImportPageComponent],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EasyOnlineImportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
