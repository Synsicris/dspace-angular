import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';

import { CrisLayoutRelationBoxComponent } from './cris-layout-relation-box.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';
import { Item } from '../../../../../core/shared/item.model';
import { of } from 'rxjs';
import { CrisLayoutBox } from '../../../../../core/layout/models/box.model';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';

describe('CrisLayoutRelationBoxComponent', () => {
  let component: CrisLayoutRelationBoxComponent;
  let fixture: ComponentFixture<CrisLayoutRelationBoxComponent>;

  const testItem = Object.assign(new Item(), {
    id: '1234-65487-12354-1235',
    bundles: of({}),
    metadata: {}
  });

  let aroute;

  const testBox = Object.assign(new CrisLayoutBox(), {
    id: '1',
    collapsed: false,
    header: 'CrisLayoutBox Header',
    shortname: 'test-box',
    configuration: of({ configuration: 'box-configuration-id' })
  });

  beforeEach(async () => {

    aroute = {
      data: observableOf({ isVersionOfAnItem: observableOf(false) }),
      project: createSuccessfulRemoteDataObject$(testItem)
    };

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        CommonModule,
        SharedModule
      ],
      declarations: [CrisLayoutRelationBoxComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: aroute },
        { provide: 'boxProvider', useValue: testBox },
        { provide: 'itemProvider', useValue: testItem },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutRelationBoxComponent);
    component = fixture.componentInstance;
    component.box = testBox;
    component.item = testItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should have set scope in searchFilter', () => {
    expect(component.searchFilter).toContain('scope=' + testItem.id);
  });

  describe('when is version of an item', () => {

    beforeEach(() => {
      component.isVersionOfAnItem$.next(true);
      fixture.detectChanges();
    });

    it('should not render a button', fakeAsync(() => {
      tick();
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).toBeNull();
    }));

  });

});
