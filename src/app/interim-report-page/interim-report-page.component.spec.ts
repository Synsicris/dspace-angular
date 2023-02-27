import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterimReportPageComponent } from './interim-report-page.component';

describe('InterimReportPageComponent', () => {
  let component: InterimReportPageComponent;
  let fixture: ComponentFixture<InterimReportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterimReportPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterimReportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
