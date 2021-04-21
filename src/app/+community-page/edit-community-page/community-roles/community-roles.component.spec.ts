import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommunityRolesComponent } from './community-roles.component';
import { Community } from '../../../core/shared/community.model';
import { By } from '@angular/platform-browser';
import { RequestService } from '../../../core/data/request.service';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { SharedModule } from '../../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';

describe('CommunityRolesComponent', () => {

  let fixture: ComponentFixture<CommunityRolesComponent>;
  let comp: CommunityRolesComponent;
  let de: DebugElement;

  beforeEach(() => {

    const route = {
      parent: {
        data: observableOf({
          dso: createSuccessfulRemoteDataObject(
            Object.assign(new Community(), {
              _links: {
                irrelevant: {
                  href: 'irrelevant link',
                },
                adminGroup: {
                  href: 'adminGroup link',
                },
              },
            })
          ),
        })
      }
    };

    const requestService = {
      hasByHref$: () => observableOf(true),
    };

    const groupDataService = {
      findByHref: () => createSuccessfulRemoteDataObject$({}),
    };

    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
      ],
      declarations: [
        CommunityRolesComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: RequestService, useValue: requestService },
        { provide: GroupDataService, useValue: groupDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityRolesComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should display a community admin role component', () => {
    expect(de.query(By.css('ds-comcol-role .community-admin')))
      .toBeTruthy();
  });
});
