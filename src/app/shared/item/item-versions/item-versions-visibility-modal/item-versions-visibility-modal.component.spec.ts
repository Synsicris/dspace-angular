import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVersionsVisibilityModalComponent } from './item-versions-visibility-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../../../../core/shared/item.model';
import { VersionHistory } from '../../../../core/shared/version-history.model';
import { Version } from '../../../../core/shared/version.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';

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

  const versionHistory = Object.assign(new VersionHistory(), {
    id: '1',
    draftVersion: true,
  });

  const version1 = Object.assign(new Version(), {
    id: '1',
    version: 1,
    created: new Date(2020, 1, 1),
    summary: 'first version',
    versionhistory: createSuccessfulRemoteDataObject$(versionHistory),
    _links: {
      self: {
        href: 'version2-url',
      },
    },
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
    component.version = version1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
