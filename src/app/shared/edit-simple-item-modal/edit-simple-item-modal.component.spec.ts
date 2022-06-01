import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSimpleItemModalComponent } from './edit-simple-item-modal.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { getMockFormBuilderService } from '../mocks/form-builder-service.mock';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilderService } from '../form/builder/form-builder.service';

describe('EditSimpleItemModalComponent', () => {
  let component: EditSimpleItemModalComponent;
  let fixture: ComponentFixture<EditSimpleItemModalComponent>;
  let modal;
  let builderService;

  beforeEach(async () => {

    builderService = Object.assign(getMockFormBuilderService(), {
      createFormGroup(formModel, options = null) {
        const controls = {};
        formModel.forEach(model => {
          model.parent = parent;
          const controlModel = model;
          const controlState = { value: controlModel.value, disabled: controlModel.disabled };
          const controlOptions = this.createAbstractControlOptions(controlModel.validators, controlModel.asyncValidators, controlModel.updateOn);
          controls[model.id] = new FormControl(controlState, controlOptions);
        });
        return new FormGroup(controls, options);
      },
      createAbstractControlOptions(validatorsConfig = null, asyncValidatorsConfig = null, updateOn = null) {
        return {
          validators: validatorsConfig !== null ? this.getValidators(validatorsConfig) : null,
        };
      },
      getValidators(validatorsConfig) {
        return this.getValidatorFns(validatorsConfig);
      },
      getValidatorFns(validatorsConfig, validatorsToken = this._NG_VALIDATORS) {
        let validatorFns = [];
        if (this.isObject(validatorsConfig)) {
          validatorFns = Object.keys(validatorsConfig).map(validatorConfigKey => {
            const validatorConfigValue = validatorsConfig[validatorConfigKey];
            if (this.isValidatorDescriptor(validatorConfigValue)) {
              const descriptor = validatorConfigValue;
              return this.getValidatorFn(descriptor.name, descriptor.args, validatorsToken);
            }
            return this.getValidatorFn(validatorConfigKey, validatorConfigValue, validatorsToken);
          });
        }
        return validatorFns;
      },
      getValidatorFn(validatorName, validatorArgs = null, validatorsToken = this._NG_VALIDATORS) {
        let validatorFn;
        if (Validators.hasOwnProperty(validatorName)) { // Built-in Angular Validators
          validatorFn = Validators[validatorName];
        } else { // Custom Validators
          if (this._DYNAMIC_VALIDATORS && this._DYNAMIC_VALIDATORS.has(validatorName)) {
            validatorFn = this._DYNAMIC_VALIDATORS.get(validatorName);
          } else if (validatorsToken) {
            validatorFn = validatorsToken.find(validator => validator.name === validatorName);
          }
        }
        if (validatorFn === undefined) { // throw when no validator could be resolved
          throw new Error(`validator '${validatorName}' is not provided via NG_VALIDATORS, NG_ASYNC_VALIDATORS or DYNAMIC_FORM_VALIDATORS`);
        }
        if (validatorArgs !== null) {
          return validatorFn(validatorArgs);
        }
        return validatorFn;
      },
      isValidatorDescriptor(value) {
        if (this.isObject(value)) {
          return value.hasOwnProperty('name') && value.hasOwnProperty('args');
        }
        return false;
      },
      isObject(value) {
        return typeof value === 'object' && value !== null;
      }
    });

    modal = jasmine.createSpyObj('modal', ['close', 'dismiss']);
    await TestBed.configureTestingModule({
      declarations: [EditSimpleItemModalComponent],
      providers: [
        { provide: NgbActiveModal, useValue: modal },
        { provide: FormBuilderService, useValue: builderService },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSimpleItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
