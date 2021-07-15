import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpPageContentComponent } from './help-page-content.component';

describe('HelpPageContentComponent', () => {
  let component: HelpPageContentComponent;
  let fixture: ComponentFixture<HelpPageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpPageContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
