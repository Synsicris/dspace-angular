import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeMembersPageComponent } from './programme-members-page.component';

describe('ProgrammeMembersPageComponent', () => {
  let component: ProgrammeMembersPageComponent;
  let fixture: ComponentFixture<ProgrammeMembersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgrammeMembersPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammeMembersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
