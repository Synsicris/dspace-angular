import { ItemVersionsComponent } from './item-versions.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VarDirective } from '../../utils/var.directive';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { Version } from '../../../core/shared/version.model';
import { VersionHistory } from '../../../core/shared/version-history.model';
import { VersionHistoryDataService } from '../../../core/data/version-history-data.service';
import { By } from '@angular/platform-browser';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { createPaginatedList } from '../../testing/utils.test';
import { EMPTY, of, of as observableOf } from 'rxjs';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../testing/pagination-service.stub';
import { AuthService } from '../../../core/auth/auth.service';
import { VersionDataService } from '../../../core/data/version-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { FormBuilder } from '@angular/forms';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { WorkspaceitemDataService } from '../../../core/submission/workspaceitem-data.service';
import { WorkflowItemDataService } from '../../../core/submission/workflowitem-data.service';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';

describe('ItemVersionsComponent', () => {
  let component: ItemVersionsComponent;
  let fixture: ComponentFixture<ItemVersionsComponent>;
  let authenticationService: AuthService;
  let authorizationService: AuthorizationDataService;
  let versionHistoryService: VersionHistoryDataService;
  let workspaceItemDataService: WorkspaceitemDataService;
  let workflowItemDataService: WorkflowItemDataService;
  let versionService: VersionDataService;
  let configurationService: ConfigurationDataService;
  let de: DebugElement;
  let modalService;

  const versionHistory = Object.assign(new VersionHistory(), {
    id: '1',
    draftVersion: true,
  });

  const version1 = Object.assign(new Version(), {
    id: '1',
    version: 1,
    created: new Date(2020, 1, 1),
    summary: 'first version',
    versionhistory: createSuccessfulRemoteDataObject$(versionHistory),
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
    versionhistory: createSuccessfulRemoteDataObject$(versionHistory),
    _links: {
      self: {
        href: 'version2-url',
      },
    },
  });
  const version3 = Object.assign(new Version(), {
    id: '3',
    version: 3,
    summary: 'second version',
    created: new Date(2020, 1, 2),
    versionhistory: createSuccessfulRemoteDataObject$(versionHistory),
    _links: {
      self: {
        href: 'version2-url',
      },
    },
  });
  const version4 = Object.assign(new Version(), {
    id: '4',
    version: 4,
    summary: 'second version',
    created: new Date(2020, 1, 2),
    versionhistory: createSuccessfulRemoteDataObject$(versionHistory),
    _links: {
      self: {
        href: 'version2-url',
      },
    },
  });
  const versions = [version1, version2];
  versionHistory.versions = createSuccessfulRemoteDataObject$(createPaginatedList(versions));

  const item1 = Object.assign(new Item(), { // is a workspace item
    uuid: 'item-identifier-1',
    handle: '123456789/1',
    metadata: {
      'synsicris.version.official': [
        {
          value: 'false'
        }
      ],
      'synsicris.version.visible': [
        {
          value: 'true'
        },
      ],
    },
    version: createSuccessfulRemoteDataObject$(version1),
    _links: {
      self: {
        href: '/items/item-identifier-1'
      }
    }
  });
  const item2 = Object.assign(new Item(), {
    uuid: 'item-identifier-2',
    handle: '123456789/2',
    metadata: {
      'synsicris.version.official': [
        {
          value: 'true'
        }
      ],
      'synsicris.version.visible': [
        {
          value: 'false'
        },
      ],
    },
    version: createSuccessfulRemoteDataObject$(version2),
    _links: {
      self: {
        href: '/items/item-identifier-2'
      }
    }
  });
  const item3 = Object.assign(new Item(), {
    uuid: 'item-identifier-3',
    handle: '123456789/3',
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
    version: createSuccessfulRemoteDataObject$(version3),
    _links: {
      self: {
        href: '/items/item-identifier-2'
      }
    }
  });
  const item4 = Object.assign(new Item(), {
    uuid: 'item-identifier-4',
    handle: '123456789/3',
    metadata: {
      'synsicris.version.official': [
        {
          value: 'false'
        }
      ],
      'synsicris.version.visible': [
        {
          value: 'false'
        },
      ],
    },
    version: createSuccessfulRemoteDataObject$(version4),
    _links: {
      self: {
        href: '/items/item-identifier-4'
      }
    }
  });
  const items = [item1, item2];
  version1.item = createSuccessfulRemoteDataObject$(item1);
  version2.item = createSuccessfulRemoteDataObject$(item2);
  version3.item = createSuccessfulRemoteDataObject$(item3);
  version4.item = createSuccessfulRemoteDataObject$(item4);

  const versionHistoryServiceSpy = jasmine.createSpyObj('versionHistoryService', {
    getVersions: createSuccessfulRemoteDataObject$(createPaginatedList(versions)),
  });
  const authenticationServiceSpy = jasmine.createSpyObj('authenticationService', {
    isAuthenticated: observableOf(true),
    setRedirectUrl: {}
  });
  const authorizationServiceSpy = jasmine.createSpyObj('authorizationService', ['isAuthorized']);
  const workspaceItemDataServiceSpy = jasmine.createSpyObj('workspaceItemDataService', {
    findByItem: EMPTY,
  });
  const workflowItemDataServiceSpy = jasmine.createSpyObj('workflowItemDataService', {
    findByItem: EMPTY,
  });
  const versionServiceSpy = jasmine.createSpyObj('versionService', {
    findById: EMPTY,
  });

  const configurationServiceSpy = jasmine.createSpyObj('configurationService', {
    findByPropertyName: of(true),
  });

  const itemService = jasmine.createSpyObj('ItemDataService', {
    updateItemMetadata: of(true)
  });

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [ItemVersionsComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: PaginationService, useValue: new PaginationServiceStub() },
        { provide: FormBuilder, useValue: new FormBuilder() },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: AuthService, useValue: authenticationServiceSpy },
        { provide: AuthorizationDataService, useValue: authorizationServiceSpy },
        { provide: VersionHistoryDataService, useValue: versionHistoryServiceSpy },
        { provide: ItemDataService, useValue: itemService },
        { provide: VersionDataService, useValue: versionServiceSpy },
        { provide: WorkspaceitemDataService, useValue: workspaceItemDataServiceSpy },
        { provide: WorkflowItemDataService, useValue: workflowItemDataServiceSpy },
        { provide: ConfigurationDataService, useValue: configurationServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    versionHistoryService = TestBed.inject(VersionHistoryDataService);
    authenticationService = TestBed.inject(AuthService);
    authorizationService = TestBed.inject(AuthorizationDataService);
    workspaceItemDataService = TestBed.inject(WorkspaceitemDataService);
    workflowItemDataService = TestBed.inject(WorkflowItemDataService);
    versionService = TestBed.inject(VersionDataService);
    configurationService = TestBed.inject(ConfigurationDataService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVersionsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.item = item1;
    component.displayActions = true;
    versionHistoryServiceSpy.getVersions.and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList(versions)));
    fixture.detectChanges();
  });

  it(`should display ${versions.length} rows`, () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(versions.length);
  });

  it('Should show edit summary button', () => {
    spyOn(component, 'canEditVersion$').and.returnValue(of(true));
    fixture.detectChanges();
    expect(de.queryAll(By.css('button[data-test="edit-summary"]')).length).toEqual(1);
  });

  it('Should show show-summary info', () => {
    expect(de.queryAll(By.css('span[data-test="show-summary"]')).length).toEqual(2);
  });

  it('Should not show show-note info', () => {
    expect(de.queryAll(By.css('span[data-test="show-note"]')).length).toEqual(0);
  });

  versions.forEach((version: Version, index: number) => {
    const versionItem = items[index];

    it(`should display version ${version.version} in the correct column for version ${version.id}`, () => {
      const id = fixture.debugElement.query(By.css(`#version-row-${version.id} .version-row-element-version`));
      expect(id.nativeElement.textContent).toContain(version.version.toString());
    });

    // Check if the current version contains an asterisk
    if (item1.uuid === versionItem.uuid) {
      it('should add an asterisk to the version of the selected item', () => {
        const item = fixture.debugElement.query(By.css(`#version-row-${version.id} .version-row-element-version`));
        expect(item.nativeElement.textContent).toContain('*');
      });
    }

    it(`should display date ${version.created} in the correct column for version ${version.id}`, () => {
      const date = fixture.debugElement.query(By.css(`#version-row-${version.id} .version-row-element-date`));
      switch (versionItem.uuid) {
        case item1.uuid:
          expect(date.nativeElement.textContent.trim()).toEqual('2020-02-01 00:00:00');
          break;
        case item2.uuid:
          expect(date.nativeElement.textContent.trim()).toEqual('2020-02-02 00:00:00');
          break;
        default:
          throw new Error('Unexpected versionItem');
      }
    });

    it(`should display summary ${version.summary} in the correct column for version ${version.id}`, () => {
      const summary = fixture.debugElement.query(By.css(`#version-row-${version.id} .version-row-element-summary`));
      expect(summary.nativeElement.textContent).toEqual(version.summary);
    });
  });

  describe('when the user can only delete a version', () => {
    beforeAll(waitForAsync(() => {
      const canDelete = (featureID: FeatureID, url: string) => of(featureID === FeatureID.CanDeleteVersion);
      authorizationServiceSpy.isAuthorized.and.callFake(canDelete);
    }));
    it('should not disable the delete button', () => {
      const deleteButtons = fixture.debugElement.queryAll(By.css(`.version-row-element-delete`));
      deleteButtons.forEach((btn) => {
        expect(btn.nativeElement.disabled).toBe(false);
      });
    });
    it('should disable other buttons', () => {
      const createButtons = fixture.debugElement.queryAll(By.css(`.version-row-element-create`));
      createButtons.forEach((btn) => {
        expect(btn.nativeElement.disabled).toBe(true);
      });
      const editButtons = fixture.debugElement.queryAll(By.css(`.version-row-element-create`));
      editButtons.forEach((btn) => {
        expect(btn.nativeElement.disabled).toBe(true);
      });
    });
  });

  describe('when page is changed', () => {
    it('should call getAllVersions', () => {
      spyOn(component, 'getAllVersions');
      component.onPageChange();
      expect(component.getAllVersions).toHaveBeenCalled();
    });
  });

  describe('when onSummarySubmit() is called', () => {
    const id = 'version-being-edited-id';
    beforeEach(() => {
      component.versionBeingEditedId = id;
    });
    it('should call versionService.findById', () => {
      component.onSummarySubmit();
      expect(versionService.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('when editing is enabled for an item', () => {
    beforeEach(() => {
      component.enableVersionEditing(version1);
    });
    it('should set all variables', () => {
      expect(component.versionBeingEditedSummary).toEqual('first version');
      expect(component.versionBeingEditedNumber).toEqual(1);
      expect(component.versionBeingEditedId).toEqual('1');
    });
    it('isAnyBeingEdited should be true', () => {
      expect(component.isAnyBeingEdited()).toBeTrue();
    });
    it('isThisBeingEdited should be true for version1', () => {
      expect(component.isThisBeingEdited(version1)).toBeTrue();
    });
    it('isThisBeingEdited should be false for version2', () => {
      expect(component.isThisBeingEdited(version2)).toBeFalse();
    });
  });

  describe('when editing is disabled', () => {
    beforeEach(() => {
      component.disableVersionEditing();
    });
    it('should unset all variables', () => {
      expect(component.versionBeingEditedSummary).toBeUndefined();
      expect(component.versionBeingEditedNumber).toBeUndefined();
      expect(component.versionBeingEditedId).toBeUndefined();
    });
    it('isAnyBeingEdited should be false', () => {
      expect(component.isAnyBeingEdited()).toBeFalse();
    });
    it('isThisBeingEdited should be false for all versions', () => {
      expect(component.isThisBeingEdited(version1)).toBeFalse();
      expect(component.isThisBeingEdited(version2)).toBeFalse();
    });
  });

  describe('When component is being utilized by Project Manage Version', () => {

    beforeEach(() => {
      component.isCoordinator = true;
      component.isFunder = false;
      component.canShowCreateVersion = true;
      component.displayActions = true;
      versionHistoryServiceSpy.getVersions.and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList([version1, version2, version3, version4])));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('Should show visibility column', () => {
      expect(de.query(By.css('th[data-test="visibility-column"]'))).toBeTruthy();
    });

    it('Should show official column', () => {
      expect(de.query(By.css('th[data-test="official-column"]'))).toBeTruthy();
    });

    it('Should show visible for version 1', () => {
      expect(de.query(By.css('span[data-test="visible-1"]'))).toBeTruthy();
    });

    it('Should show invisible for version 2', () => {
      expect(de.query(By.css('span[data-test="non-visible-2"]'))).toBeTruthy();
    });

    it('Should show non official for version 1', () => {
      expect(de.query(By.css('span[data-test="non-official-1"]'))).toBeTruthy();
    });

    it('Should show official for version 2', () => {
      expect(de.query(By.css('span[data-test="official-2"]'))).toBeTruthy();
    });

    it('Should not show create buttons for any version', () => {
      expect(de.queryAll(By.css('button[data-test="create-button"]')).length).toEqual(0);
    });


    it('Should not show show-summary info', () => {
      expect(de.queryAll(By.css('span[data-test="show-summary"]')).length).toEqual(0);
    });

    it('Should show show-note info', () => {
      expect(de.queryAll(By.css('span[data-test="show-note"]')).length).toEqual(4);
    });

    describe('when isCoordinator is true', () => {

      beforeEach(() => {
        component.isCoordinator = true;
        component.isFunder = false;
        component.canShowCreateVersion = true;

        modalService = (component as any).modalService;
        spyOn(modalService, 'open').and.returnValue(Object.assign({ componentInstance: Object.assign({ response: observableOf(true) }) }));

        fixture.detectChanges();
      });

      describe('When Visible and not Official', () => {

        it('Should not show set visible for version 1', () => {
          expect(de.query(By.css('button[data-test="visible-1"]'))).toBeFalsy();
        });

        it('Should not show set non official for version 1', () => {
          expect(de.query(By.css('button[data-test="non-official-1"]'))).toBeFalsy();
        });

        it('Should not show delete for version 1', () => {
          expect(de.query(By.css('button[data-test="delete-1"]'))).toBeFalsy();
        });
      });

      describe('When Visible and Official', () => {

        it('Should not show set visible for version 3', () => {
          expect(de.query(By.css('button[data-test="visible-3"]'))).toBeFalsy();
        });

        it('Should not show set non official for version 3', () => {
          expect(de.query(By.css('button[data-test="non-official-3"]'))).toBeFalsy();
        });

        it('Should not show delete for version 3', () => {
          expect(de.query(By.css('button[data-test="delete-3"]'))).toBeFalsy();
        });
      });


      describe('When Non Visible and Non Official', () => {

        it('Should show set visible for version 4', () => {
          expect(de.query(By.css('button[data-test="visible-4"]'))).toBeTruthy();
        });

        it('Should not show set non official for version 4', () => {
          expect(de.query(By.css('button[data-test="non-official-4"]'))).toBeFalsy();
        });

        it('Should show delete for version 4', () => {
          spyOn(component, 'canDeleteVersion$').and.returnValue(of(true));
          fixture.detectChanges();
          expect(de.query(By.css('button[data-test="delete-4"]'))).toBeTruthy();
        });
      });


      it('Should show version links for all version', () => {
        expect(de.queryAll(By.css('a[data-test="version-link"]')).length).toEqual(4);
      });

      it('Should call modal service when making visible version 4', () => {
        const button = de.query(By.css('button[data-test="visible-4"]')).nativeElement;
        button.click();
        fixture.detectChanges();
        expect(modalService.open).toHaveBeenCalled();
      });

    });


    describe('when isFounder is true', () => {
      beforeEach(() => {
        component.isCoordinator = false;
        component.isFunder = true;
        versionHistoryServiceSpy.getVersions.and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList([version1, version2, version3, version4])));

        modalService = (component as any).modalService;
        spyOn(modalService, 'open').and.returnValue(Object.assign({ componentInstance: Object.assign({ response: observableOf(true) }) }));

        component.ngOnInit();
        fixture.detectChanges();
      });


      it('Should show edit note button', () => {
        expect(de.queryAll(By.css('button[data-test="edit-note"]')).length).toEqual(3);
      });

      describe('When Visible and not Official', () => {

        it('Should not show set visible for version 1', () => {
          expect(de.query(By.css('button[data-test="visible-1"]'))).toBeFalsy();
        });

        it('Should not show set non official for version 1', () => {
          expect(de.query(By.css('button[data-test="non-official-1"]'))).toBeFalsy();
        });

        it('Should not show delete for version 1 since its selected', () => {
          expect(de.query(By.css('button[data-test="delete-1"]'))).toBeFalsy();
        });
      });

      describe('When Visible and Official', () => {

        it('Should not show set visible for version 3', () => {
          expect(de.query(By.css('button[data-test="visible-3"]'))).toBeFalsy();
        });

        it('Should show set non official for version 3', () => {
          expect(de.query(By.css('button[data-test="set-non-official-3"]'))).toBeTruthy();
        });

        it('Should not show delete for version 3', () => {
          expect(de.query(By.css('button[data-test="delete-3"]'))).toBeFalsy();
        });
      });


      describe('When Non Visible and Non Official', () => {

        it('Should not show set visible for version 4', () => {
          expect(de.query(By.css('button[data-test="visible-4"]'))).toBeFalsy();
        });

        it('Should not show set non official for version 4', () => {
          expect(de.query(By.css('button[data-test="non-official-4"]'))).toBeFalsy();
        });

        it('Should show delete for version 4', () => {
          spyOn(component, 'canDeleteVersion$').and.returnValue(of(true));
          fixture.detectChanges();
          expect(de.query(By.css('button[data-test="delete-4"]'))).toBeTruthy();
        });
      });


      it('Should show version links for all version', () => {
        expect(de.queryAll(By.css('a[data-test="version-link"]')).length).toEqual(2);
      });


      it('Should call modal service when making non official version 3', () => {
        const button = de.query(By.css('button[data-test="set-non-official-3"]')).nativeElement;
        button.click();
        fixture.detectChanges();
        expect(modalService.open).toHaveBeenCalled();
      });

    });

  });

});
