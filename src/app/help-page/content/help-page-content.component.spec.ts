import { RouterMock } from './../../shared/mocks/router.mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpPageContentComponent } from './help-page-content.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MockActivatedRoute } from './../../shared/mocks/active-router.mock';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from './../../shared/testing/translate-loader.mock';

describe('HelpPageContentComponent', () => {
  let component: HelpPageContentComponent;
  let fixture: ComponentFixture<HelpPageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpPageContentComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: Router, useValue: new RouterMock() },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
