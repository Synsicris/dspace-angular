import { TranslateLoaderMock } from './../../shared/testing/translate-loader.mock';
import { MockActivatedRoute } from './../../shared/mocks/active-router.mock';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ProjectEntityListComponent } from './project-entity-list.component';

describe('ProjectEntityListComponent', () => {
  let component: ProjectEntityListComponent;
  let fixture: ComponentFixture<ProjectEntityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectEntityListComponent],
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
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEntityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
