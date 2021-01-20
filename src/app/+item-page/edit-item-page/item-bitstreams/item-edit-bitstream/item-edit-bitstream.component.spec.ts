import { ItemEditBitstreamComponent } from './item-edit-bitstream.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ObjectUpdatesService } from '../../../../core/data/object-updates/object-updates.service';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { TranslateModule } from '@ngx-translate/core';
import { VarDirective } from '../../../../shared/utils/var.directive';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BitstreamFormat } from '../../../../core/shared/bitstream-format.model';
import { ResponsiveTableSizes } from '../../../../shared/responsive-table-sizes/responsive-table-sizes';
import { ResponsiveColumnSizes } from '../../../../shared/responsive-table-sizes/responsive-column-sizes';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';

let comp: ItemEditBitstreamComponent;
let fixture: ComponentFixture<ItemEditBitstreamComponent>;

const columnSizes = new ResponsiveTableSizes([
  new ResponsiveColumnSizes(2, 2, 3, 4, 4),
  new ResponsiveColumnSizes(2, 3, 3, 3, 3),
  new ResponsiveColumnSizes(2, 2, 2, 2, 2),
  new ResponsiveColumnSizes(6, 5, 4, 3, 3)
]);

const format = Object.assign(new BitstreamFormat(), {
  shortDescription: 'PDF'
});
const bitstream = Object.assign(new Bitstream(), {
  uuid: 'bitstreamUUID',
  name: 'Fake Bitstream',
  bundleName: 'ORIGINAL',
  description: 'Description',
  format: createSuccessfulRemoteDataObject$(format)
});
const fieldUpdate = {
  field: bitstream,
  changeType: undefined
};
const date = new Date();
const url = 'thisUrl';

let objectUpdatesService: ObjectUpdatesService;

describe('ItemEditBitstreamComponent', () => {
  beforeEach(async(() => {
    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService',
      {
        getFieldUpdates: observableOf({
          [bitstream.uuid]: fieldUpdate,
        }),
        getFieldUpdatesExclusive: observableOf({
          [bitstream.uuid]: fieldUpdate,
        }),
        saveRemoveFieldUpdate: {},
        removeSingleFieldUpdate: {},
        saveAddFieldUpdate: {},
        discardFieldUpdates: {},
        reinstateFieldUpdates: observableOf(true),
        initialize: {},
        getUpdatedFields: observableOf([bitstream]),
        getLastModified: observableOf(date),
        hasUpdates: observableOf(true),
        isReinstatable: observableOf(false),
        isValidPage: observableOf(true)
      }
    );

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ItemEditBitstreamComponent, VarDirective],
      providers: [
        { provide: ObjectUpdatesService, useValue: objectUpdatesService }
      ], schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditBitstreamComponent);
    comp = fixture.componentInstance;
    comp.fieldUpdate = fieldUpdate;
    comp.bundleUrl = url;
    comp.columnSizes = columnSizes;
    comp.ngOnChanges(undefined);
    fixture.detectChanges();
  });

  describe('when remove is called', () => {
    beforeEach(() => {
      comp.remove();
    });

    it('should call saveRemoveFieldUpdate on objectUpdatesService', () => {
      expect(objectUpdatesService.saveRemoveFieldUpdate).toHaveBeenCalledWith(url, bitstream);
    });
  });

  describe('when undo is called', () => {
    beforeEach(() => {
      comp.undo();
    });

    it('should call removeSingleFieldUpdate on objectUpdatesService', () => {
      expect(objectUpdatesService.removeSingleFieldUpdate).toHaveBeenCalledWith(url, bitstream.uuid);
    });
  });

  describe('when canRemove is called', () => {
    it('should return true', () => {
      expect(comp.canRemove()).toEqual(true)
    });
  });

  describe('when canUndo is called', () => {
    it('should return false', () => {
      expect(comp.canUndo()).toEqual(false)
    });
  });
});
