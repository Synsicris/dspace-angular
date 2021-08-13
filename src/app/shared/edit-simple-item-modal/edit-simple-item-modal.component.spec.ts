import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSimpleItemModalComponent } from './edit-simple-item-modal.component';

describe('EditSimpleItemModalComponent', () => {
  let component: EditSimpleItemModalComponent;
  let fixture: ComponentFixture<EditSimpleItemModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSimpleItemModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSimpleItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
