import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubProjectPageComponent } from './sub-project-page.component';

describe('ProjectOverviewPageComponent', () => {
  let component: SubProjectPageComponent;
  let fixture: ComponentFixture<SubProjectPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubProjectPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubProjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
