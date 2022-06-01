import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { InvitationModalComponent } from './invitation-modal.component';

describe('InvitationModalComponent', () => {
  let component: InvitationModalComponent;
  let fixture: ComponentFixture<InvitationModalComponent>;
  const modal = jasmine.createSpyObj('modal', ['close', 'dismiss']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvitationModalComponent],
      providers: [{ provide: NgbActiveModal, useValue: modal }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
