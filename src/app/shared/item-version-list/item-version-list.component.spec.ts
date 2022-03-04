import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVersionListComponent } from './item-version-list.component';

describe('ItemVersionListComponent', () => {
  let component: ItemVersionListComponent;
  let fixture: ComponentFixture<ItemVersionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemVersionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVersionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
