import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareItemComponent } from './compare-item.component';

describe('CompareItemComponent', () => {
  let component: CompareItemComponent;
  let fixture: ComponentFixture<CompareItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
