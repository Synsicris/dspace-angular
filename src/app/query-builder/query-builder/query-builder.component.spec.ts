import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getMockFormBuilderService } from '../../shared/mocks/form-builder-service.mock';
import { FormBuilderService } from '../../shared/form/builder/form-builder.service';

import { QueryBuilderComponent } from './query-builder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { ControlTypeCheckerPipe } from '../pipes/control-type-checker.pipe';

fdescribe('QueryBuilderComponent', () => {
  let component: QueryBuilderComponent;
  let fixture: ComponentFixture<QueryBuilderComponent>;
  let builderService: FormBuilderService;

  beforeEach(async () => {
    builderService = getMockFormBuilderService();
    await TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [ QueryBuilderComponent, ControlTypeCheckerPipe ],
      providers: [
        { provide: FormBuilderService, useValue: builderService },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
