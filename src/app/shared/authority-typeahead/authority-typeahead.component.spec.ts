// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick, } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { of as observableOf } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormLayoutService, DynamicFormsCoreModule, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { AuthorityOptions } from '../../core/integration/models/authority-options.model';
import { AuthorityService } from '../../core/integration/authority.service';
import { AuthorityServiceStub } from '../testing/authority-service-stub';
import { GlobalConfig } from '../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../config';
import { AuthorityTypeaheadComponent } from './authority-typeahead.component';
import { DynamicTypeaheadModel } from '../form/builder/ds-dynamic-form-ui/models/typeahead/dynamic-typeahead.model';
import { FormFieldMetadataValueObject } from '../form/builder/models/form-field-metadata-value.model';
import { createTestComponent } from '../testing/utils';
import { AuthorityConfidenceStateDirective } from '../authority-confidence/authority-confidence-state.directive';
import { MOCK_SUBMISSION_CONFIG } from '../testing/mock-submission-config';
import { ObjNgFor } from '../utils/object-ngfor.pipe';

export let TYPEAHEAD_TEST_GROUP;

export let TYPEAHEAD_TEST_MODEL_CONFIG;

const envConfig: GlobalConfig = MOCK_SUBMISSION_CONFIG;
const authorityOptions: AuthorityOptions = new AuthorityOptions(
  'EVENTAuthority',
  'typeahead',
  'c1c16450-d56f-41bc-bb81-27f1d1eb5c23'
);

function init() {
  TYPEAHEAD_TEST_GROUP = new FormGroup({
    typeahead: new FormControl(),
  });

  TYPEAHEAD_TEST_MODEL_CONFIG = {
    authorityOptions: authorityOptions,
    disabled: false,
    id: 'typeahead',
    label: 'Conference',
    minChars: 3,
    name: 'typeahead',
    placeholder: 'Conference',
    readOnly: false,
    required: false,
    repeatable: false,
    value: undefined
  };
}
describe('AuthorityTypeaheadComponent test suite', () => {

  let testComp: TestComponent;
  let typeaheadComp: AuthorityTypeaheadComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let typeaheadFixture: ComponentFixture<AuthorityTypeaheadComponent>;
  let html;

  // async beforeEach
  beforeEach(async(() => {
    const authorityServiceStub = new AuthorityServiceStub();
    init();
    TestBed.configureTestingModule({
      imports: [
        DynamicFormsCoreModule,
        DynamicFormsNGBootstrapUIModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        AuthorityTypeaheadComponent,
        TestComponent,
        AuthorityConfidenceStateDirective,
        ObjNgFor
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        AuthorityTypeaheadComponent,
        { provide: GLOBAL_CONFIG, useValue: envConfig },
        { provide: AuthorityService, useValue: authorityServiceStub },
        { provide: DynamicFormLayoutService, useValue: {} },
        { provide: DynamicFormValidationService, useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  describe('', () => {
    // synchronous beforeEach
    beforeEach(() => {
      html = `
      <ds-dynamic-typeahead [bindId]="bindId"
                            [group]="group"
                            [model]="model"
                            (blur)="onBlur($event)"
                            (change)="onValueChange($event)"
                            (focus)="onFocus($event)"></ds-dynamic-typeahead>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });
    it('should create AuthorityTypeaheadComponent', inject([AuthorityTypeaheadComponent], (app: AuthorityTypeaheadComponent) => {

      expect(app).toBeDefined();
    }));
  });

  describe('', () => {
    describe('when init model value is empty', () => {
      beforeEach(() => {

        typeaheadFixture = TestBed.createComponent(AuthorityTypeaheadComponent);
        typeaheadComp = typeaheadFixture.componentInstance; // FormComponent test instance
        typeaheadComp.group = TYPEAHEAD_TEST_GROUP;
        typeaheadComp.fieldId = 'typeahead';
        typeaheadComp.fieldName = 'typeahead';
        typeaheadComp.authorityOptions = Object.assign({}, authorityOptions);
        typeaheadFixture.detectChanges();
      });

      afterEach(() => {
        typeaheadFixture.destroy();
        typeaheadComp = null;
      });

      it('should init component properly', () => {
        expect(typeaheadComp.currentValue).not.toBeDefined();
      });

      it('should search when 3+ characters typed', fakeAsync(() => {

        spyOn((typeaheadComp as any).authorityService, 'getEntriesByName').and.callThrough();

        typeaheadComp.search(observableOf('test')).subscribe();

        tick(300);
        typeaheadFixture.detectChanges();

        expect((typeaheadComp as any).authorityService.getEntriesByName).toHaveBeenCalled();
      }));

      it('should set value on input type when AuthorityOptions.closed is false', () => {
        const inputDe = typeaheadFixture.debugElement.query(By.css('input.form-control'));
        const inputElement = inputDe.nativeElement;

        inputElement.value = 'test value';
        inputElement.dispatchEvent(new Event('input'));

        expect(typeaheadComp.inputValue).toEqual(new FormFieldMetadataValueObject('test value'));

      });

      it('should not set value on input type when AuthorityOptions.closed is true', () => {
        typeaheadComp.authorityOptions.closed = true;
        typeaheadComp.initValue = '';
        typeaheadFixture.detectChanges();
        const inputDe = typeaheadFixture.debugElement.query(By.css('input.form-control'));
        const inputElement = inputDe.nativeElement;

        inputElement.value = 'test value';
        inputElement.dispatchEvent(new Event('input'));

        expect(typeaheadComp.inputValue).not.toBeDefined();

      });

      it('should emit blur Event onBlur when popup is closed', () => {
        spyOn(typeaheadComp.blur, 'emit');
        spyOn(typeaheadComp.instance, 'isPopupOpen').and.returnValue(false);
        typeaheadComp.onBlur(new Event('blur'));
        expect(typeaheadComp.blur.emit).toHaveBeenCalled();
      });

      it('should not emit blur Event onBlur when popup is opened', () => {
        spyOn(typeaheadComp.blur, 'emit');
        spyOn(typeaheadComp.instance, 'isPopupOpen').and.returnValue(true);
        const input = typeaheadFixture.debugElement.query(By.css('input'));

        input.nativeElement.blur();
        expect(typeaheadComp.blur.emit).not.toHaveBeenCalled();
      });

      it('should emit change Event onBlur when AuthorityOptions.closed is false and inputValue is changed', () => {
        typeaheadComp.inputValue = 'test value';
        typeaheadComp.initValue = '';
        typeaheadFixture.detectChanges();
        spyOn(typeaheadComp.blur, 'emit');
        spyOn(typeaheadComp.change, 'emit');
        spyOn(typeaheadComp.instance, 'isPopupOpen').and.returnValue(false);
        typeaheadComp.onBlur(new Event('blur', ));
        expect(typeaheadComp.change.emit).toHaveBeenCalled();
        expect(typeaheadComp.blur.emit).toHaveBeenCalled();
      });

      it('should not emit change Event onBlur when AuthorityOptions.closed is false and inputValue is not changed', () => {
        typeaheadComp.inputValue = 'test value';
        typeaheadComp.fieldId = 'typeahead';
        typeaheadComp.fieldName = 'typeahead';
        typeaheadComp.initValue = 'test value';
        typeaheadFixture.detectChanges();
        spyOn(typeaheadComp.blur, 'emit');
        spyOn(typeaheadComp.change, 'emit');
        spyOn(typeaheadComp.instance, 'isPopupOpen').and.returnValue(false);
        typeaheadComp.onBlur(new Event('blur', ));
        expect(typeaheadComp.change.emit).not.toHaveBeenCalled();
        expect(typeaheadComp.blur.emit).toHaveBeenCalled();
      });

      it('should not emit change Event onBlur when AuthorityOptions.closed is false and inputValue is null', () => {
        typeaheadComp.inputValue = null;
        typeaheadComp.fieldId = 'typeahead';
        typeaheadComp.fieldName = 'typeahead';
        typeaheadComp.initValue = 'test value';
        typeaheadComp.authorityOptions = authorityOptions;
        typeaheadFixture.detectChanges();
        spyOn(typeaheadComp.blur, 'emit');
        spyOn(typeaheadComp.change, 'emit');
        spyOn(typeaheadComp.instance, 'isPopupOpen').and.returnValue(false);
        typeaheadComp.onBlur(new Event('blur', ));
        expect(typeaheadComp.change.emit).not.toHaveBeenCalled();
        expect(typeaheadComp.blur.emit).toHaveBeenCalled();
      });

      it('should emit focus Event onFocus', () => {
        spyOn(typeaheadComp.focus, 'emit');
        typeaheadComp.onFocus(new Event('focus'));
        expect(typeaheadComp.focus.emit).toHaveBeenCalled();
      });

    });

    describe('and init model value is not empty', () => {
      beforeEach(() => {
        typeaheadFixture = TestBed.createComponent(AuthorityTypeaheadComponent);
        typeaheadComp = typeaheadFixture.componentInstance; // FormComponent test instance
        typeaheadComp.group = TYPEAHEAD_TEST_GROUP;
        typeaheadComp.fieldId = 'typeahead';
        typeaheadComp.fieldName = 'typeahead';
        typeaheadComp.authorityOptions = authorityOptions;
        typeaheadComp.initValue = new FormFieldMetadataValueObject('test', null, 'test001');
        typeaheadFixture.detectChanges();
      });

      afterEach(() => {
        typeaheadFixture.destroy();
        typeaheadComp = null;
      });

      it('should init component properly', () => {
        expect(typeaheadComp.currentValue).toEqual(new FormFieldMetadataValueObject('test', null, 'test001'));
      });

      it('should emit change Event onChange and currentValue is empty', () => {
        typeaheadComp.currentValue = null;
        spyOn(typeaheadComp.change, 'emit');
        typeaheadComp.onChange(new Event('change'));
        expect(typeaheadComp.change.emit).toHaveBeenCalled();
        expect(typeaheadComp.currentValue).toBeNull();
      });
    });

  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  group: FormGroup = TYPEAHEAD_TEST_GROUP;

  model = new DynamicTypeaheadModel(TYPEAHEAD_TEST_MODEL_CONFIG);

}
