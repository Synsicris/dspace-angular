import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyOnlineImportComponent } from './easy-online-import.component';

describe('EasyOnlineImportComponent', () => {
  let component: EasyOnlineImportComponent;
  let fixture: ComponentFixture<EasyOnlineImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EasyOnlineImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EasyOnlineImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
