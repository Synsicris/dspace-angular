import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { Item } from '../../../core/shared/item.model';
import { ManageProjectFundersGroupMenuComponent } from './manage-project-funders-group-menu.component';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { of } from 'rxjs';
import { ConfigurationDataService } from 'src/app/core/data/configuration-data.service';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { CONFIG_PROPERTY } from '../../../core/shared/config-property.resource-type';

describe('ManageProjectFundersGroupMenuComponent', () => {
  let component: ManageProjectFundersGroupMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<ManageProjectFundersGroupMenuComponent>;
  let authorizationService: AuthorizationDataService;

  const config = Object.assign({}, new ConfigurationProperty(), {
    id: '12312312312',
    type: CONFIG_PROPERTY,
    values: ['123332211']
  });

  const configurationDataService: ConfigurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$(config)
  });

  let dso: DSpaceObject;

  beforeEach(async(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      entityType: 'Person',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });

    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true),
    });


    TestBed.configureTestingModule({
      declarations: [ManageProjectFundersGroupMenuComponent],
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
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: ConfigurationDataService, useValue: configurationDataService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProjectFundersGroupMenuComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    component.contextMenuObject = dso;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a button', () => {
    const link = fixture.debugElement.query(By.css('button'));
    expect(link).not.toBeNull();
  });

});
