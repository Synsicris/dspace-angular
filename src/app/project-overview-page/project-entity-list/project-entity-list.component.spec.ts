import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEntityListComponent } from './project-entity-list.component';

describe('ProjectEntityListComponent', () => {
  let component: ProjectEntityListComponent;
  let fixture: ComponentFixture<ProjectEntityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectEntityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEntityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
