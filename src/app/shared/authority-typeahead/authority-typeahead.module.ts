import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthorityTypeaheadComponent } from './authority-typeahead.component';
import { FormModule } from '../form/form.module';

@NgModule({
  declarations: [
    AuthorityTypeaheadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FormModule,
    NgbTypeaheadModule
  ],
  exports: [
    AuthorityTypeaheadComponent
  ]
})
export class AuthorityTypeaheadModule {
}
