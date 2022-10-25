import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from './../../../../../shared/testing/translate-loader.mock';

import { ConfirmWithdrawComponent } from './confirm-withdraw.component';

describe('ConfirmWithdrawComponent', () => {
  let component: ConfirmWithdrawComponent;
  let fixture: ComponentFixture<ConfirmWithdrawComponent>;
  let modal;


  beforeEach(async () => {
    modal = jasmine.createSpyObj('modal', ['close', 'dismiss']);
    await TestBed.configureTestingModule({
      declarations: [ConfirmWithdrawComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      providers: [{ provide: NgbActiveModal, useValue: modal }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
