import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Item } from '../../core/shared/item.model';
import { VersionHistory } from '../../core/shared/version-history.model';
import { Version } from '../../core/shared/version.model';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { ViewVersionBadgesComponent } from './view-version-badges.component';
import { ItemDataService } from '../../core/data/item-data.service';
import { ProjectVersionService } from '../../core/project/project-version.service';

describe('ViewVersionBadgesComponent', () => {
  let component: ViewVersionBadgesComponent;
  let fixture: ComponentFixture<ViewVersionBadgesComponent>;

  const itemService = jasmine.createSpyObj('ItemDataService', {
    findById: jasmine.createSpy('findById')
  });

  const projectVersionService = jasmine.createSpyObj('ProjectVersionService', {
    isVersionOfAnItem: jasmine.createSpy('isVersionOfAnItem'),
    getVersionByItemId: jasmine.createSpy('getVersionByItemId')
  });

  const versionHistory = Object.assign(new VersionHistory(), {
    id: '1',
    draftVersion: true,
  });

  const versionRecent = Object.assign(new Version(), {
    id: '1',
    version: 1,
    created: (new Date()).setDate(new Date().getDate() + 1),
    summary: 'first version',
    versionhistory: createSuccessfulRemoteDataObject$(versionHistory),
    _links: {
      self: {
        href: 'version2-url',
      },
    },
  });

  const versionOld = Object.assign(new Version(), {
    id: '2',
    version: 2,
    created: (new Date()).setDate(new Date().getDate() - 40),
    summary: 'second version',
    versionhistory: createSuccessfulRemoteDataObject$(versionHistory),
    _links: {
      self: {
        href: 'version2-url',
      },
    },
  });

  const item1 = Object.assign(new Item(), {
    id: 'item-identifier-1',
    uuid: 'item-identifier-1',
    handle: '123456789/1',
    entityType: 'Publication',
    metadata: {
      'synsicris.relation.project': [
        {
          value: 'item',
          authority: 'item-identifier-2'
        },
      ],
    },
    _links: {
      self: {
        href: '/items/item-identifier-1'
      }
    }
  });

  const itemProject = Object.assign(new Item(), {
    id: 'item-identifier-2',
    uuid: 'item-identifier-2',
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
      declarations: [ViewVersionBadgesComponent],
      providers: [
        { provide: ItemDataService, useValue: itemService },
        { provide: ProjectVersionService, useValue: projectVersionService },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVersionBadgesComponent);
    component = fixture.componentInstance;
  });

  describe('When no item is present', () => {
    beforeEach(() => {
      component.item = null;
      fixture.detectChanges();
    });

    it('Should not show version badge', () => {
      expect(fixture.debugElement.query(By.css('span[data-test="version-info-badge"]'))).toBeFalsy();
    });
    it('Should show not date badge', () => {
      expect(fixture.debugElement.query(By.css('span[data-test="version-date-badge"]'))).toBeFalsy();
    });
    it('Should not show official badge', () => {
      expect(fixture.debugElement.query(By.css('span[data-test="official-badge"]'))).toBeFalsy();
    });
  });

  describe('When item is not a version', () => {
    beforeEach(() => {
      component.item = item1;
      projectVersionService.isVersionOfAnItem.and.returnValue(false);
      fixture.detectChanges();
    });

    it('Should not show version badge', () => {
      expect(fixture.debugElement.query(By.css('span[data-test="version-info-badge"]'))).toBeFalsy();
    });
    it('Should show not date badge', () => {
      expect(fixture.debugElement.query(By.css('span[data-test="version-date-badge"]'))).toBeFalsy();
    });
    it('Should not show official badge', () => {
      expect(fixture.debugElement.query(By.css('span[data-test="official-badge"]'))).toBeFalsy();
    });
  });

  describe('When item is a version of a Project entity', () => {

    beforeEach(() => {
      component.item = itemProject;
      projectVersionService.isVersionOfAnItem.and.returnValue(true);
    });

    describe('When Version is within 4 weeks', () => {
      beforeEach(() => {
        projectVersionService.getVersionByItemId.and.returnValue(createSuccessfulRemoteDataObject$(versionRecent));
        fixture.detectChanges();
      });

      it('Should show version badge', () => {
        expect(fixture.debugElement.query(By.css('span[data-test="version-info-badge"]'))).toBeTruthy();
      });
      it('Should show date badge', () => {
        expect(fixture.debugElement.query(By.css('span[data-test="version-date-badge"]'))).toBeTruthy();
      });
      it('Should show official badge', () => {
        expect(fixture.debugElement.query(By.css('span[data-test="official-badge"]'))).toBeTruthy();
      });

      it('Should show class badge-primary', () => {
        const infoBadge = fixture.debugElement.query(By.css('span[data-test="version-date-badge"]'));
        const arrClass = [...infoBadge.nativeElement.classList];
        expect(arrClass.includes('badge-primary')).toBeTruthy();
        expect(component).toBeTruthy();
      });
    });

    describe('When Version is not within 4 weeks', () => {
      beforeEach(() => {
        projectVersionService.getVersionByItemId.and.returnValue(createSuccessfulRemoteDataObject$(versionOld));
        fixture.detectChanges();
      });

      it('Should show version badge', () => {
        expect(fixture.debugElement.query(By.css('span[data-test="version-info-badge"]'))).toBeTruthy();
      });
      it('Should show date badge', () => {
        expect(fixture.debugElement.query(By.css('span[data-test="version-date-badge"]'))).toBeTruthy();
      });
      it('Should show official badge', () => {
        expect(fixture.debugElement.query(By.css('span[data-test="official-badge"]'))).toBeTruthy();
      });

      it('Should show class badge-warning', () => {
        const infoBadge = fixture.debugElement.query(By.css('span[data-test="version-date-badge"]'));
        const arrClass = [...infoBadge.nativeElement.classList];
        expect(arrClass.includes('badge-warning')).toBeTruthy();
      });
    });
  });

  describe('When item is a version of a generic entity', () => {

    beforeEach(() => {
      component.item = item1;
      projectVersionService.isVersionOfAnItem.and.returnValue(true);
      itemService.findById.and.returnValue(createSuccessfulRemoteDataObject$(itemProject));
      projectVersionService.getVersionByItemId.and.returnValue(createSuccessfulRemoteDataObject$(versionOld));
      fixture.detectChanges();
    });

    it('Should show version badge', () => {
      expect(fixture.debugElement.query(By.css('span[data-test="version-info-badge"]'))).toBeTruthy();
    });
    it('Should show date badge', () => {
      expect(fixture.debugElement.query(By.css('span[data-test="version-date-badge"]'))).toBeTruthy();
    });
    it('Should show official badge', () => {
      expect(fixture.debugElement.query(By.css('span[data-test="official-badge"]'))).toBeTruthy();
    });

  });

});
