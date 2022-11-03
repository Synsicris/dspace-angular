import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeMembersComponent } from './programme-members.component';

describe('ProgrammeMembersComponent', () => {
  let component: ProgrammeMembersComponent;
  let fixture: ComponentFixture<ProgrammeMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgrammeMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammeMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
