import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TestScheduler } from 'rxjs/testing';
import { of as observableOf } from 'rxjs';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SubmissionServiceStub } from '../../../shared/testing/submission-service.stub';
import { mockSubmissionId } from '../../../shared/mocks/submission.mock';
import { SubmissionService } from '../../submission.service';
import { SubmissionRestServiceStub } from '../../../shared/testing/submission-rest-service.stub';
import { SubmissionFormFooterComponent } from './submission-form-footer.component';
import { SubmissionRestService } from '../../../core/submission/submission-rest.service';
import { createTestComponent } from '../../../shared/testing/utils.test';
import { BrowserOnlyMockPipe } from '../../../shared/testing/browser-only-mock.pipe';
import { SubmissionScopeType } from '../../../core/submission/submission-scope-type';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import createSpy = jasmine.createSpy;

let submissionServiceStub: SubmissionServiceStub = new SubmissionServiceStub();

const submissionId = mockSubmissionId;

describe('SubmissionFormFooterComponent', () => {

  let comp: SubmissionFormFooterComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionFormFooterComponent>;
  let submissionRestServiceStub: any;
  let scheduler: TestScheduler;

  const authorizationService = jasmine.createSpyObj('authorizationService', {
    isAuthorized: createSpy('isAuthorized').and.returnValue(observableOf(true))
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        SubmissionFormFooterComponent,
        TestComponent,
        BrowserOnlyMockPipe,
      ],
      providers: [
        { provide: SubmissionService, useValue: submissionServiceStub },
        { provide: SubmissionRestService, useClass: SubmissionRestServiceStub },
        { provide: AuthorizationDataService, useValue: authorizationService },
        ChangeDetectorRef,
        NgbModal,
        SubmissionFormFooterComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      submissionServiceStub.getSubmissionStatus.and.returnValue(observableOf(true));
      const html = `
        <ds-submission-form-footer [submissionId]="submissionId"></ds-submission-form-footer>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
      testFixture.detectChanges();
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionFormFooterComponent', inject([SubmissionFormFooterComponent], (app: SubmissionFormFooterComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {
    beforeEach(() => {
      scheduler = getTestScheduler();
      fixture = TestBed.createComponent(SubmissionFormFooterComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      submissionRestServiceStub = TestBed.inject(SubmissionRestService as any);
      comp.submissionId = submissionId;

    });

    afterEach(() => {
      comp = null;
      compAsAny = null;
      fixture = null;
    });

    describe('ngOnChanges', () => {
      beforeEach(() => {
        submissionServiceStub.getSubmissionStatus.and.returnValue(hot('-a-b', {
          a: false,
          b: true
        }));

        submissionServiceStub.getSubmissionSaveProcessingStatus.and.returnValue(hot('-a-b', {
          a: false,
          b: true
        }));

        submissionServiceStub.getSubmissionDepositProcessingStatus.and.returnValue(hot('-a-b', {
          a: false,
          b: true
        }));
      });

      it('should set submissionIsInvalid properly', () => {

        const expected = cold('-c-d', {
          c: true,
          d: false
        });

        comp.ngOnChanges({
          submissionId: new SimpleChange(null, submissionId, true)
        });

        fixture.detectChanges();

        expect(compAsAny.submissionIsInvalid).toBeObservable(expected);
      });

      it('should set processingSaveStatus properly', () => {

        const expected = cold('-c-d', {
          c: false,
          d: true
        });

        comp.ngOnChanges({
          submissionId: new SimpleChange(null, submissionId, true)
        });

        fixture.detectChanges();

        expect(comp.processingSaveStatus).toBeObservable(expected);
      });

      it('should set processingDepositStatus properly', () => {

        const expected = cold('-c-d', {
          c: false,
          d: true
        });

        comp.ngOnChanges({
          submissionId: new SimpleChange(null, submissionId, true)
        });

        fixture.detectChanges();

        expect(comp.processingDepositStatus).toBeObservable(expected);
      });
    });

    it('should call dispatchSave on save', () => {

      comp.save(null);
      fixture.detectChanges();

      expect(submissionServiceStub.dispatchSave).toHaveBeenCalledWith(submissionId, true);
    });

    it('should call dispatchSaveForLater on save for later', () => {

      comp.saveLater(null);
      fixture.detectChanges();

      expect(submissionServiceStub.dispatchSaveForLater).toHaveBeenCalledWith(submissionId);
    });

    it('should call dispatchDeposit on save', () => {

      comp.deposit(null);
      fixture.detectChanges();

      expect(submissionServiceStub.dispatchDeposit).toHaveBeenCalledWith(submissionId);
    });

    describe('on discard confirmation', () => {
      beforeEach((done) => {
        comp.showDeposit = observableOf(true);
        fixture.detectChanges();
        const modalBtn = fixture.debugElement.query(By.css('.btn-danger'));

        modalBtn.nativeElement.click();
        fixture.detectChanges();

        const confirmBtn: any = ((document as any).querySelector('.btn-danger:nth-child(2)'));

        confirmBtn.click();

        fixture.detectChanges();
        fixture.whenStable().then(() => {
          done();
        });
      });

      it('should call dispatchDiscard', () => {
        expect(submissionServiceStub.dispatchDiscard).toHaveBeenCalledWith(submissionId);
      });
    });

    it('should have deposit button disabled when submission is not valid', () => {
      comp.showDeposit = observableOf(true);
      compAsAny.submissionIsInvalid = observableOf(true);
      fixture.detectChanges();
      const depositBtn: any = fixture.debugElement.query(By.css('button#deposit'));

      expect(depositBtn.nativeElement.disabled).toBeFalsy();
    });

    it('should not have deposit button disabled when submission is valid', () => {
      comp.showDeposit = observableOf(true);
      compAsAny.submissionIsInvalid = observableOf(false);
      fixture.detectChanges();
      const depositBtn: any = fixture.debugElement.query(By.css('button#deposit'));

      expect(depositBtn.nativeElement.disabled).toBeFalsy();
    });

    it('should disable save button when all modifications had been saved', () => {
      comp.hasUnsavedModification = observableOf(false);
      fixture.detectChanges();

      const saveBtn: any = fixture.debugElement.query(By.css('#save'));
      expect(saveBtn.nativeElement.disabled).toBeTruthy();
    });

    it('should enable save button when there are not saved modifications', () => {
      comp.hasUnsavedModification = observableOf(true);
      fixture.detectChanges();

      const saveBtn: any = fixture.debugElement.query(By.css('#save'));
      expect(saveBtn.nativeElement.disabled).toBeFalsy();
    });

    describe( 'submission form footer buttons\' labels', () => {

      it('should use saveForLaterLabel method for the save for later button', () => {

        spyOn(comp, 'saveForLaterLabel').and.returnValue('saveForLaterLabel');

        fixture.detectChanges();
        const saveForLaterBtn: any = fixture.debugElement.query(By.css('#saveForLater'));

        expect(comp.saveForLaterLabel).toHaveBeenCalled();
        expect(saveForLaterBtn.nativeElement.innerText).toContain('saveForLaterLabel');
      });

      it('should display the proper saveForLaterLabel for save for later button', () => {
        submissionServiceStub.getSubmissionScope.and.returnValue(SubmissionScopeType.EditItem);
        expect(comp.saveForLaterLabel()).toBe('submission.general.save-later.edit-item');

        submissionServiceStub.getSubmissionScope.and.returnValue(SubmissionScopeType.WorkspaceItem);
        expect(comp.saveForLaterLabel()).toBe('submission.general.save-later');

        submissionServiceStub.getSubmissionScope.and.returnValue(SubmissionScopeType.WorkflowItem);
        expect(comp.saveForLaterLabel()).toBe('submission.general.save-later');

      });
    });

  });

  describe('when disableDeposit is true', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionFormFooterComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      submissionServiceStub = TestBed.inject(SubmissionService) as any;
      submissionRestServiceStub = TestBed.inject(SubmissionRestService);
      comp.submissionId = submissionId;
      comp.disableDeposit = true;
      submissionServiceStub.getSubmissionScope.and.returnValue(SubmissionScopeType.WorkspaceItem);
    });

    afterEach(() => {
      comp = null;
      compAsAny = null;
      fixture = null;
      submissionServiceStub = null;
      submissionRestServiceStub = null;
    });

    it('should not have deposit button', () => {
      const depositBtn: any = fixture.debugElement.query(By.css('button#deposit'));

      expect(depositBtn).toBeNull();
    });

    it('should not have discard button', () => {
      const depositBtn: any = fixture.debugElement.query(By.css('button#discard'));

      expect(depositBtn).toBeNull();
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  submissionId = mockSubmissionId;

}
