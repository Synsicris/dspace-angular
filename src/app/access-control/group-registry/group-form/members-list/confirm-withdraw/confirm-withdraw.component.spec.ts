import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmWithdrawComponent } from './confirm-withdraw.component';

describe('ConfirmWithdrawComponent', () => {
  let component: ConfirmWithdrawComponent;
  let fixture: ComponentFixture<ConfirmWithdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmWithdrawComponent ]
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
