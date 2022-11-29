import { ItemDataService } from './../../core/data/item-data.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVersionListComponent } from './item-version-list.component';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { of as observableOf } from 'rxjs';
import { createPaginatedList } from '../testing/utils.test';
import { By } from '@angular/platform-browser';
import { ProjectVersionService } from '../../core/project/project-version.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import { Version } from 'src/app/core/shared/version.model';

describe('ItemVersionListComponent', () => {
  let component: ItemVersionListComponent;
  let fixture: ComponentFixture<ItemVersionListComponent>;
  beforeEach(async () => {

    const emptyList = createSuccessfulRemoteDataObject(createPaginatedList([]));

    const itemDataServiceStub = {
      mapToCollection: () => createSuccessfulRemoteDataObject$({}),
      findAllByHref: () => observableOf(emptyList)
    };
    const projectVersionService = jasmine.createSpyObj('projectVersionService', ['getVersionsByItemId']);

    const version1 = Object.assign(new Version(), {
      id: '1',
      version: 1,
      created: new Date(2020, 1, 1),
      summary: 'first version',
      _links: {
        self: {
          href: 'version2-url',
        },
      },
    });
    const version2 = Object.assign(new Version(), {
      id: '2',
      version: 2,
      summary: 'second version',
      created: new Date(2020, 1, 2),
      _links: {
        self: {
          href: 'version2-url',
        },
      },
    });


    projectVersionService.getVersionsByItemId.and.returnValue(observableOf([version1, version2]));

    await TestBed.configureTestingModule({
      declarations: [ItemVersionListComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      providers: [
        { provide: ItemDataService, useValue: itemDataServiceStub },
        { provide: ProjectVersionService, useValue: projectVersionService }
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

  describe('when disabled is true', () => {

    it('should disable button', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('button[data-test="version-disabled"]')).nativeElement.disabled).toBeTrue();
    });

  });

});
