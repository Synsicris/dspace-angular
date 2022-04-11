import { TranslateLoaderMock } from './../../shared/testing/translate-loader.mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasyOnlineImportResultComponent } from './easy-online-import-result.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';

describe('EasyOnlineImportResultComponent', () => {
  let component: EasyOnlineImportResultComponent;
  let fixture: ComponentFixture<EasyOnlineImportResultComponent>;

  let dsoNameService;
  beforeEach(async () => {

    dsoNameService = jasmine.createSpyObj('dsoNameService', {
      getName: 'Collection Name'
    });


    await TestBed.configureTestingModule({
      declarations: [EasyOnlineImportResultComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        { provide: DSONameService, useValue: dsoNameService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EasyOnlineImportResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
