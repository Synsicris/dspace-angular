import { ItemDataService } from './../../../core/data/item-data.service';
import { AuthorizationDataService } from './../../../core/data/feature-authorization/authorization-data.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Item } from '../../../core/shared/item.model';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { EditItemPermissionsMenuComponent } from './edit-item-permissions-menu.component';
import { EditItemMode } from '../../../core/submission/models/edititem-mode.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';
import { EditItemGrantsModalComponent } from '../../edit-item-grants-modal/edit-item-grants-modal.component';

describe('EditItemPermissionsMenuComponent', () => {
  let component: EditItemPermissionsMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<EditItemPermissionsMenuComponent>;

  let dso: DSpaceObject;
  let authorizationService: any;
  // tslint:disable-next-line:prefer-const
  let modalService;
  const editItemMode: EditItemMode = Object.assign(new EditItemMode(), {
    name: 'test',
    label: 'test'
  });

  beforeEach(async(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: jasmine.createSpy('isAuthorized')
    });

    TestBed.configureTestingModule({
      declarations: [EditItemPermissionsMenuComponent, EditItemGrantsModalComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        RouterTestingModule.withRoutes([])],
      providers: [
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: ItemDataService, useValue: authorizationService },

      ]
    }).compileComponents();
  }));

  describe('when edit permission is authorized', () => {
    beforeEach(() => {
      authorizationService.isAuthorized.and.returnValue(observableOf(true));
      fixture = TestBed.createComponent(EditItemPermissionsMenuComponent);
      component = fixture.componentInstance;
      componentAsAny = fixture.componentInstance;
      component.contextMenuObject = dso;

      fixture.detectChanges();
    });

    it('should authorizationService.isAuthorized to have been called', () => {
      expect(authorizationService.isAuthorized).toHaveBeenCalled();
    });

    it('should render a button', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).not.toBeNull();
    });

    it('should render a button', () => {
      spyOn(component, 'openEditGrantsModal');
      fixture.detectChanges();
      const link = fixture.debugElement.query(By.css('button'));
      link.nativeElement.click();
      expect(component.openEditGrantsModal).toHaveBeenCalled();
    });
  });

  describe('when edit permission is not authorized', () => {
    beforeEach(() => {
      authorizationService.isAuthorized.and.returnValue(observableOf(false));
      fixture = TestBed.createComponent(EditItemPermissionsMenuComponent);
      component = fixture.componentInstance;
      componentAsAny = fixture.componentInstance;
      component.contextMenuObject = dso;
      fixture.detectChanges();
    });

    it('should authorizationService.isAuthorized to have been called', () => {
      expect(authorizationService.isAuthorized).toHaveBeenCalled();
    });

    it('should not render a button', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).toBeNull();
    });

  });

});
