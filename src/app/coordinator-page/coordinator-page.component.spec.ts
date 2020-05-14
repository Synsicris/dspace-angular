import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorPageComponent } from './coordinator-page.component';

describe('CoordinatorPageComponent', () => {
  let component: CoordinatorPageComponent;
  let fixture: ComponentFixture<CoordinatorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoordinatorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
