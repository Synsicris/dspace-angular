import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemSubmissionModalComponent } from './create-item-submission-modal.component';

describe('CreateItemSubmissionModalComponent', () => {
  let component: CreateItemSubmissionModalComponent;
  let fixture: ComponentFixture<CreateItemSubmissionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateItemSubmissionModalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateItemSubmissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
