import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVersionBadgesComponent } from './view-version-badges.component';

describe('ViewVersionBadgesComponent', () => {
  let component: ViewVersionBadgesComponent;
  let fixture: ComponentFixture<ViewVersionBadgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVersionBadgesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVersionBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
