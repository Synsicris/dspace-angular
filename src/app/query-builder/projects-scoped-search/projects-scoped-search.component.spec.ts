import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsScopedSearchComponent } from './projects-scoped-search.component';

describe('ProjectsScopedSearchComponent', () => {
  let component: ProjectsScopedSearchComponent;
  let fixture: ComponentFixture<ProjectsScopedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsScopedSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsScopedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
