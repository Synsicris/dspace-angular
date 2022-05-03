import { Item } from '../../../core/shared/item.model';
import { of as observableOf } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TruncatePipe } from '../../utils/truncate.pipe';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GrantBadgeComponent } from './grant-badge.component';

let comp: GrantBadgeComponent;
let fixture: ComponentFixture<GrantBadgeComponent>;

const type = 'authorOfPublication';

const mockItem = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dspace.entity.type': [
      {
        language: 'en_US',
        value: type
      }
    ]
  }
});

const mockItemParentProject = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dspace.entity.type': [
      {
        language: 'en_US',
        value: type
      }
    ],
    'cris.project.shared': [
      {
        language: 'en_US',
        value: 'parentproject'
      }
    ]
  }
});

const mockItemProject = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dspace.entity.type': [
      {
        language: 'en_US',
        value: type
      }
    ],
    'cris.project.shared': [
      {
        language: 'en_US',
        value: 'project'
      }
    ]
  }
});

describe('ItemGrantBadgeComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [GrantBadgeComponent, TruncatePipe],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(GrantBadgeComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(GrantBadgeComponent);
    comp = fixture.componentInstance;
  }));

  describe('When the item has cris.project.shared is not present', () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it('should not show badge', () => {
      const badge = fixture.debugElement.query(By.css('span.badge'));
      expect(badge).toBeFalsy();
    });
  });

  describe('When the item has cris.project.shared parentproject', () => {
    beforeEach(() => {
      comp.object = mockItemParentProject;
      fixture.detectChanges();
    });

    it('should show badge', () => {
      const badge = fixture.debugElement.query(By.css('span.badge'));
      expect(badge).toBeTruthy();
    });

    it('should show open lock', () => {
      const badge = fixture.debugElement.query(By.css('.fa-lock-open'));
      expect(badge).toBeTruthy();
    });


  });

  describe('When the item has cris.project.shared project', () => {
    beforeEach(() => {
      comp.object = mockItemProject;
      fixture.detectChanges();
    });

    it('should show badge', () => {
      const badge = fixture.debugElement.query(By.css('span.badge'));
      expect(badge).toBeTruthy();
    });

    it('should show lock', () => {
      const badge = fixture.debugElement.query(By.css('.fa-lock'));
      expect(badge).toBeTruthy();
    });

  });



});
