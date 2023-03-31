import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsUploadStepComponent } from './questions-upload-step.component';

describe('QuestionsUploadStepComponent', () => {
  let component: QuestionsUploadStepComponent;
  let fixture: ComponentFixture<QuestionsUploadStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionsUploadStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsUploadStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
