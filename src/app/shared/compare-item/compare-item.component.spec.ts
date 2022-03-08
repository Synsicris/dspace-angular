import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CompareItemComponent } from './compare-item.component';
import { ItemDataService } from '../../core/data/item-data.service';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { Item } from '../../core/shared/item.model';
import { compareItems } from '../mocks/item.mock';
import { of as observableOf } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { SharedModule } from '../shared.module';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';


describe('CompareItemComponent', () => {
  let component: CompareItemComponent;
  let fixture: ComponentFixture<CompareItemComponent>;
  let de: DebugElement;
  const baseItem = Object.assign(new Item(),
    {
      type: 'item',
      metadata: {
        'dc.title': [{ value: 'item' }]
      },
      uuid: '04dd18fc-03f9-4b9a-9304-ed7c313686d3',
      owningCollection: createSuccessfulRemoteDataObject$({}),
      _links: {
        owningCollection: 'collectionPath + collectionUUID',
        self: 'itemPath + itemUUID'
      }
    }
  );

  const itemDataService: any = {
    findById: (id: string) => createSuccessfulRemoteDataObject$(baseItem)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompareItemComponent],
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      providers: [
        { provide: ItemDataService, useValue: itemDataService },

      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareItemComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.baseItemId = 'df582766-5cdb-4b28-8efc-7001a8f70dac';
    component.versioneditemId = 'a94167e3-e462-4cd5-8538-b80a75a38847';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSingleItemData', () => {
    const spyOnGetSingleItemData = spyOn(component, 'getSingleItemData');
    component.ngOnInit();
    fixture.detectChanges();
    expect(spyOnGetSingleItemData).toHaveBeenCalled();
  });

  it('should call getMetaDataKeys', () => {
    const spyOnGetMetaDataKeys = spyOn(component, 'getMetaDataKeys');
    component.ngOnInit();
    fixture.detectChanges();
    expect(spyOnGetMetaDataKeys).toHaveBeenCalled();
  });

  describe('after baseItem and versionedItem', () => {
    beforeEach(() => {
      spyOn(component, 'getItemsData').and.returnValue(observableOf(compareItems));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show table', () => {
      console.log(de.queryAll(By.css('tr')));
      expect(de.query(By.css('table'))).toBeTruthy();
    });

    it('first row should have any table class', () => {
      expect(de.queryAll(By.css('tr'))[0].nativeElement.className).toEqual('');
    });

    it('should have table-success class', () => {
      expect(de.queryAll(By.css('tr'))[6].nativeElement.className).toEqual('table-success');
    });

    it('should have table-warning class', () => {
      expect(de.queryAll(By.css('tr'))[3].nativeElement.className).toEqual('table-warning');
    });

    it('should have table-danger class', () => {
      expect(de.queryAll(By.css('tr'))[16].nativeElement.className).toEqual('table-danger');
    });

  });

});
