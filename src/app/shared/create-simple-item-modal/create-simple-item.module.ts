import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateSimpleItemModalComponent } from './create-simple-item-modal.component';
import { SimpleItemBoxComponent } from './simple-item-box/simple-item-box.component';
import { SearchSimpleItemComponent } from './search-simple-item/search-simple-item.component';
import { SearchSimpleItemHeaderComponent } from './search-simple-item/search-header/search-simple-item-header.component';
import { SearchSimpleItemLabelsComponent } from './search-simple-item/search-header/search-labels/search-simple-item-labels.component';
import { SearchSimpleItemBoxComponent } from './search-simple-item/search-header/search-box/search-simple-item-box.component';
import { SearchSimpleItemFilterBoxComponent } from './search-simple-item/search-header/filter-box/search-simple-item-filter-box.component';
import { SearchSimpleItemService } from './search-simple-item/search-simple-item.service';
import { NgbModalModule, NgbNavModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CreateSimpleItemComponent } from './create-simple-item/create-simple-item.component';
import { SharedModule } from '../shared.module';
import { FormModule } from '../form/form.module';

const COMPONENTS = [
  CreateSimpleItemModalComponent,
  CreateSimpleItemComponent,
  SimpleItemBoxComponent,
  SearchSimpleItemComponent,
  SearchSimpleItemHeaderComponent,
  SearchSimpleItemLabelsComponent,
  SearchSimpleItemBoxComponent,
  SearchSimpleItemFilterBoxComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    NgbNavModule,
    NgbModalModule,
    FormsModule,
    NgbTypeaheadModule,
    TranslateModule,
    SharedModule,
    FormModule
  ],
  providers: [
    SearchSimpleItemService
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class CreateSimpleItemModule { }
