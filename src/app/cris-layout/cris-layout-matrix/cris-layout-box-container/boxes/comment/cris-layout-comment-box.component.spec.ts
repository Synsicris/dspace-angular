import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutCommentBoxComponent } from './cris-layout-comment-box.component';

describe('CommentComponent', () => {
  let component: CrisLayoutCommentBoxComponent;
  let fixture: ComponentFixture<CrisLayoutCommentBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrisLayoutCommentBoxComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutCommentBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
