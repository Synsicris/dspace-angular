import { ItemDataService } from './../../core/data/item-data.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVersionListComponent } from './item-version-list.component';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { of as observableOf } from 'rxjs';
import { createPaginatedList } from '../testing/utils.test';

describe('ItemVersionListComponent', () => {
  let component: ItemVersionListComponent;
  let fixture: ComponentFixture<ItemVersionListComponent>;
  beforeEach(async () => {

    const emptyList = createSuccessfulRemoteDataObject(createPaginatedList([]));

    const itemDataServiceStub = {
      mapToCollection: () => createSuccessfulRemoteDataObject$({}),
      findAllByHref: () => observableOf(emptyList)
    };

    await TestBed.configureTestingModule({
      declarations: [ItemVersionListComponent],
      providers: [
        { provide: ItemDataService, useValue: itemDataServiceStub }
      ]
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
