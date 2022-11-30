import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ViewSimpleItemFormComponent } from './view-simple-item-form.component';

describe('ViewSimpleItemFormComponent', () => {
  let component: ViewSimpleItemFormComponent;
  let fixture: ComponentFixture<ViewSimpleItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewSimpleItemFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSimpleItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when disabled is true', () => {

    it('should disable button', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('button[data-test="version-disabled"]')).nativeElement.disabled).toBeTrue();
    });

  });
});
