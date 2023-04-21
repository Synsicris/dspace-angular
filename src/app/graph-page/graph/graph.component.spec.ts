import { SearchConfigurationServiceStub } from './../../shared/testing/search-configuration-service.stub';
import { SearchService } from './../../core/shared/search/search.service';
import { RouterMock } from './../../shared/mocks/router.mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { GraphComponent } from './graph.component';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { ChangeDetectorRef } from '@angular/core';

describe('GraphComponent', () => {
  let component: GraphComponent;
  let fixture: ComponentFixture<GraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: {},
            snapshot: {queryParams: {}}
          }
        },
        { provide: Router, useValue: new RouterMock() },
        { provide: SearchService, useValue: {} },
        { provide: SearchConfigurationService, useValue: new SearchConfigurationServiceStub() },
        { provide: ChangeDetectorRef, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
