import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOverviewPageHeaderComponent } from './project-overview-page-header.component';

describe('ProjectOverviewPageComponent', () => {
  let component: ProjectOverviewPageHeaderComponent;
  let fixture: ComponentFixture<ProjectOverviewPageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectOverviewPageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectOverviewPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
