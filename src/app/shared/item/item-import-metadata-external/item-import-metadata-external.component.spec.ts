import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemImportMetadataExternalComponent } from './item-import-metadata-external.component';

describe('ItemImportMetadataExternalComponent', () => {
  let component: ItemImportMetadataExternalComponent;
  let fixture: ComponentFixture<ItemImportMetadataExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemImportMetadataExternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemImportMetadataExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
