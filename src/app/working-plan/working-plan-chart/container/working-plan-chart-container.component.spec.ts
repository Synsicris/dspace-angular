import { TranslateLoaderMock } from '../../../shared/testing/translate-loader.mock';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingPlanChartContainerComponent } from './working-plan-chart-container.component';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { getMockTranslateService } from '../../../shared/mocks/translate.service.mock';
import { WorkingPlanService } from '../../core/working-plan.service';
import { WorkingPlanStateService } from '../../core/working-plan-state.service';
import { of as observableOf, of } from 'rxjs';
import { EditItemDataService } from '../../../core/submission/edititem-data.service';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('WorkingPlanChartContainerComponent', () => {
  let component: WorkingPlanChartContainerComponent;
  let fixture: ComponentFixture<WorkingPlanChartContainerComponent>;

  let translateService: TranslateService;

  const workingPlanService = jasmine.createSpyObj('WorkingPlanService', {
    getWorkpackageStatusTypes: jasmine.createSpy('getWorkpackageStatusTypes'),
    getWorkpackageSortOptions: jasmine.createSpy('getWorkpackageSortOptions'),
    getWorkpackageStepFormConfig: jasmine.createSpy('getWorkpackageStepFormConfig'),
    getWorkpackageStepFormHeader: jasmine.createSpy('getWorkpackageStepFormHeader'),
    getWorkingPlanTaskSearchHeader: jasmine.createSpy('getWorkingPlanTaskSearchHeader'),
    getWorkpackageStepTypeAuthorityName: jasmine.createSpy('getWorkpackageStepTypeAuthorityName'),
    getWorkpackageStepSearchConfigName: jasmine.createSpy('getWorkpackageStepSearchConfigName'),
    setDefaultForStatusMetadata: jasmine.createSpy('setDefaultForStatusMetadata'),
    isProcessingWorkpackageRemove: jasmine.createSpy('isProcessingWorkpackageRemove'),
    getLastAddedNodesList: jasmine.createSpy('getLastAddedNodesList'),
    updateWorkpackageMetadata: jasmine.createSpy('updateWorkpackageMetadata'),
    updateWorkpackageStepMetadata: jasmine.createSpy('updateWorkpackageStepMetadata'),
    updateAllWorkpackageMetadata: jasmine.createSpy('updateAllWorkpackageMetadata'),
  });

  const workingPlanStateService = jasmine.createSpyObj('WorkingPlanStateService', {
    getWorkpackagesSortOption: jasmine.createSpy('getWorkpackagesSortOption'),
    isProcessing: jasmine.createSpy('isProcessing'),
    dispatchGenerateWorkpackageStep: jasmine.createSpy('dispatchGenerateWorkpackageStep'),
    dispatchAddWorkpackageStep: jasmine.createSpy('dispatchAddWorkpackageStep'),
    dispatchRemoveWorkpackage: jasmine.createSpy('dispatchRemoveWorkpackage'),
    dispatchRemoveWorkpackageStep: jasmine.createSpy('dispatchRemoveWorkpackageStep'),
    dispatchRetrieveAllWorkpackages: jasmine.createSpy('dispatchRetrieveAllWorkpackages'),
    isWorkingPlanMoving: jasmine.createSpy('isWorkingPlanMoving'),
    dispatchMoveWorkpackage: jasmine.createSpy('dispatchMoveWorkpackage'),
    dispatchMoveWorkpackageStep: jasmine.createSpy('dispatchMoveWorkpackageStep'),
    isInitializing: jasmine.createSpy('isInitializing'),
  });

  const eiResult = 'eiResult' as any;

  const editItemDataService = jasmine.createSpyObj('EditItemDataService', {
    findById: observableOf(eiResult)
  });

  let aroute;

  const vocabularyEntry: any = {
    display: 'testValue1',
    value: 'testValue1',
    otherInformation: {},
    type: 'vocabularyEntry'
  };

  beforeEach(async(() => {
    translateService = getMockTranslateService();

    aroute = {
      data: observableOf({ isVersionOfAnItem: observableOf(false) }),
    };

    workingPlanService.getWorkpackageStatusTypes.and.returnValue(observableOf([vocabularyEntry]));
    workingPlanStateService.getWorkpackagesSortOption.and.returnValue(observableOf('ASC'));

    TestBed.configureTestingModule({
      declarations: [WorkingPlanChartContainerComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        { provide: TranslateService, useValue: translateService },
        { provide: WorkingPlanService, useValue: workingPlanService },
        { provide: WorkingPlanStateService, useValue: workingPlanStateService },
        { provide: EditItemDataService, useValue: editItemDataService },
        { provide: ActivatedRoute, useValue: aroute },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingPlanChartContainerComponent);
    component = fixture.componentInstance;
    component.workpackages = of([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when is version of an item', () => {

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should not render add-child button', () => {
      const link = fixture.debugElement.query(By.css('button[data-test="add-child-step"'));
      expect(link).toBeNull();
    });

    it('should not render remove-step button', () => {
      const link = fixture.debugElement.query(By.css('button[data-test="remove-step"'));
      expect(link).toBeNull();
    });

  });

});
