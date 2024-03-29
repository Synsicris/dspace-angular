import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricGooglescholarComponent } from './metric-googlescholar.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { By } from '@angular/platform-browser';

describe('MetricGooglescholarComponent', () => {
  let component: MetricGooglescholarComponent;
  let fixture: ComponentFixture<MetricGooglescholarComponent>;
  const href = 'https://scholar.google.com/scholar?q=The+Covid-19+Vaccine-Development+Multiverse';
  const metricMock = {
    acquisitionDate: new Date(),
    deltaPeriod1: null,
    deltaPeriod2: null,
    endDate: null,
    id: '1',
    last: true,
    metricCount: 333,
    metricType: 'google-scholar',
    rank: null,
    remark: '{"href":"' + href + '"}',
    startDate: null,
    type: null,
    _links: null
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [ MetricGooglescholarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricGooglescholarComponent);
    component = fixture.componentInstance;
    component.metric = metricMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render anchor with href', () => {
    const a = fixture.debugElement.queryAll(By.css('a'))[0];
    expect(a.nativeElement.href).toEqual(href);
  });
});
