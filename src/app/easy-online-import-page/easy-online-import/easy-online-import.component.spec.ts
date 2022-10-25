import { AuthServiceMock } from './../../shared/mocks/auth.service.mock';
import { AuthService } from './../../core/auth/auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyOnlineImportComponent } from './easy-online-import.component';
import { DSONameService } from './../../core/breadcrumbs/dso-name.service';
import { EasyOnlineImportService } from '../../core/easy-online-import/easy-online-import.service';

describe('EasyOnlineImportComponent', () => {
  let component: EasyOnlineImportComponent;
  let fixture: ComponentFixture<EasyOnlineImportComponent>;

  let dsoNameService;
  let easyOnlineImportService;

  beforeEach(async () => {

    dsoNameService = jasmine.createSpyObj('dsoNameService', {
      getName: 'Collection Name'
    });

    easyOnlineImportService = jasmine.createSpyObj('EasyOnlineImportService', {
      getImportEndpoint: 'getImportEndpoint'
    });


    await TestBed.configureTestingModule({
      declarations: [EasyOnlineImportComponent],
      providers: [
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: DSONameService, useValue: dsoNameService },
        { provide: EasyOnlineImportService, useValue: easyOnlineImportService },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EasyOnlineImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
