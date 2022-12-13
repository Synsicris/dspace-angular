import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Item } from 'src/app/core/shared/item.model';
import { VersionHistory } from 'src/app/core/shared/version-history.model';
import { Version } from 'src/app/core/shared/version.model';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';

import { ViewVersionBadgesComponent } from './view-version-badges.component';

describe('ViewVersionBadgesComponent', () => {
  let component: ViewVersionBadgesComponent;
  let fixture: ComponentFixture<ViewVersionBadgesComponent>;

  const versionHistory = Object.assign(new VersionHistory(), {
    id: '1',
    draftVersion: true,
  });

  const version1 = Object.assign(new Version(), {
    id: '1',
    version: 1,
    created: (new Date()).setDate((new Date()).getDate() + 30),
    summary: 'first version',
    versionhistory: createSuccessfulRemoteDataObject$(versionHistory),
    _links: {
      self: {
        href: 'version2-url',
      },
    },
  });

  const version2 = Object.assign(new Version(), {
    id: '2',
    version: 2,
    created: (new Date()).setDate((new Date()).getDate() + 4),
    summary: 'second version',
    versionhistory: createSuccessfulRemoteDataObject$(versionHistory),
    _links: {
      self: {
        href: 'version2-url',
      },
    },
  });

  const item1 = Object.assign(new Item(), {
    uuid: 'item-identifier-3',
    handle: '123456789/3',
    entityType: 'Project',
    metadata: {
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

  const item2 = Object.assign(new Item(), {
    uuid: 'item-identifier-3',
    handle: '123456789/3',
    entityType: 'Project',
    metadata: {
      'synsicris.version.official': [
        {
          value: 'true'
        }
      ],
      'synsicris.version.visible': [
        {
          value: 'true'
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
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [ViewVersionBadgesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVersionBadgesComponent);
    component = fixture.componentInstance;
    component.item = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When no version and item are present', () => {
    it('Should not show version badge', () => {
      expect(fixture.debugElement.query(By.css('span[data-test="version-info-badge"]'))).toBeFalsy();
    });
    it('Should not show official badge', () => {
      expect(fixture.debugElement.query(By.css('span[data-test="official-badge"]'))).toBeFalsy();
    });
  });


  describe('When version and item are present', () => {

    beforeEach(() => {
      component.item = item1;
      fixture.detectChanges();
    });

    it('Should show version badge', () => {
      expect(fixture.debugElement.query(By.css('span[data-test="version-info-badge"]'))).toBeTruthy();
    });
    it('Should show official badge', () => {
      expect(fixture.debugElement.query(By.css('span[data-test="official-badge"]'))).toBeTruthy();
    });

    it('When Version is within 4 weeks Should show class badge-primary', () => {
      const infoBadge = fixture.debugElement.query(By.css('span[data-test="version-info-badge"]'));
      const arrClass = [...infoBadge.nativeElement.classList];
      expect(arrClass.includes('badge-primary')).toBeTruthy();
      expect(component).toBeTruthy();
    });

    it('When Version is not within 4 weeks Should show class badge-info', () => {
      const infoBadge = fixture.debugElement.query(By.css('span[data-test="version-info-badge"]'));
      const arrClass = [...infoBadge.nativeElement.classList];
      expect(arrClass.includes('badge-info')).toBeTruthy();
    });

    it('When Item metadata is not present for official should show non official', () => {
      component.item = item1;
      fixture.detectChanges();
      const officialBadge = fixture.debugElement.query(By.css('span[data-test="official-badge"]'));
      expect(officialBadge.nativeElement.innerText).toEqual('view.version.badges.nonOfficial');
    });

    it('When Item metadata not present for official should show official', () => {
      component.item = item2;
      fixture.detectChanges();
      const officialBadge = fixture.debugElement.query(By.css('span[data-test="official-badge"]'));
      expect(officialBadge.nativeElement.innerText).toEqual('view.version.badges.official');
    });

  });


});
