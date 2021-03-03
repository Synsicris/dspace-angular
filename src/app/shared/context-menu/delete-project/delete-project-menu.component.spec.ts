import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { Item } from '../../../core/shared/item.model';
import { DeleteProjectMenuComponent } from './delete-project-menu.component';

describe('AuditItemMenuComponent', () => {
  let component: DeleteProjectMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<DeleteProjectMenuComponent>;
  let scheduler: TestScheduler;

  let dso: DSpaceObject;

  beforeEach(async(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });

    TestBed.configureTestingModule({
      declarations: [ DeleteProjectMenuComponent ],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(DeleteProjectMenuComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    component.contextMenuObject = dso;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a button', () => {
    const link = fixture.debugElement.query(By.css('button'));
    expect(link).not.toBeNull();
  });

});
