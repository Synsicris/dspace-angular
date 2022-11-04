import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManageVersionComponent } from './project-manage-version.component';

describe('ProjectManageVersionComponent', () => {
  let component: ProjectManageVersionComponent;
  let fixture: ComponentFixture<ProjectManageVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectManageVersionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectManageVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
