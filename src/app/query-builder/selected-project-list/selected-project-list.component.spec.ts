import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedProjectListComponent } from './selected-project-list.component';

describe('SelectedProjectListComponent', () => {
  let component: SelectedProjectListComponent;
  let fixture: ComponentFixture<SelectedProjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedProjectListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
