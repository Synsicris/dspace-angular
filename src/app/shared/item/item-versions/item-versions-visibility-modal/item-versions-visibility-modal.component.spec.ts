import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVersionsVisibilityModalComponent } from './item-versions-visibility-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../../../../core/shared/item.model';

describe('ItemVersionsVisibilityModalComponent', () => {
  let component: ItemVersionsVisibilityModalComponent;
  let fixture: ComponentFixture<ItemVersionsVisibilityModalComponent>;

  const item = Object.assign(new Item(), {
    uuid: 'item-identifier-3',
    handle: '123456789/3',
    metadata: {
      'synsicris.version.official': [
        {
          value: 'false'
        }
      ],
      'synsicris.version.visible': [
        {
          value: 'false'
        },
      ],
    },
    _links: {
      self: {
        href: '/items/item-identifier-2'
      }
    }
  });

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
    component.versionItem = item;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
