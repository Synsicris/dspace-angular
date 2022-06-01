import { AbstractControl, FormGroup } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dsControlTypeChecker'
})
export class ControlTypeCheckerPipe implements PipeTransform {

  /**
   * check if the control is a form group
   * @param {AbstractControl} control
   */
  transform(control: AbstractControl): boolean {
    return control instanceof FormGroup;
  }
}
