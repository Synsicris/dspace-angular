import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubProjectPageHeaderComponent } from './sub-project-page-header.component';

describe('ProjectOverviewPageComponent', () => {
  let component: SubProjectPageHeaderComponent;
  let fixture: ComponentFixture<SubProjectPageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubProjectPageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubProjectPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
