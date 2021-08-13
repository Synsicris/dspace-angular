import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyOnlineImportResultComponent } from './easy-online-import-result.component';

describe('EasyOnlineImportResultComponent', () => {
  let component: EasyOnlineImportResultComponent;
  let fixture: ComponentFixture<EasyOnlineImportResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EasyOnlineImportResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EasyOnlineImportResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
