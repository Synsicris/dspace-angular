import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVersionsVisibilityModalComponent } from './item-versions-visibility-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ItemVersionsVisibilityModalComponent', () => {
  let component: ItemVersionsVisibilityModalComponent;
  let fixture: ComponentFixture<ItemVersionsVisibilityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemVersionsVisibilityModalComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: NgbActiveModal },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVersionsVisibilityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
