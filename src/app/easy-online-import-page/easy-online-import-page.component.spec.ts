import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyOnlineImportPageComponent } from './easy-online-import-page.component';

describe('EasyOnlineImportPageComponent', () => {
  let component: EasyOnlineImportPageComponent;
  let fixture: ComponentFixture<EasyOnlineImportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EasyOnlineImportPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EasyOnlineImportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
