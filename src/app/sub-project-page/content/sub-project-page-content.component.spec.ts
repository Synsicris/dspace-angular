import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubProjectPageContentComponent } from './sub-project-page-content.component';

describe('ProjectOverviewPageComponent', () => {
  let component: SubProjectPageContentComponent;
  let fixture: ComponentFixture<SubProjectPageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubProjectPageContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubProjectPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
