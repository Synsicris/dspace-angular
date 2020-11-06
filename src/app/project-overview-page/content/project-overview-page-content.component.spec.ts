import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOverviewPageContentComponent } from './project-overview-page-content.component';

describe('ProjectOverviewPageComponent', () => {
  let component: ProjectOverviewPageContentComponent;
  let fixture: ComponentFixture<ProjectOverviewPageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectOverviewPageContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectOverviewPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
