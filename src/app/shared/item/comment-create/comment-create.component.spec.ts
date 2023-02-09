import { RouterMock } from './../../mocks/router.mock';
import { Router } from '@angular/router';
import { AuthService } from './../../../core/auth/auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentCreateComponent } from './comment-create.component';
import { AuthServiceMock } from '../../mocks/auth.service.mock';
import { EntityTypeDataService } from '../../../core/data/entity-type-data.service';
import { of as observableOf } from 'rxjs';

describe('CommentCreateComponent', () => {
  let component: CommentCreateComponent;
  let fixture: ComponentFixture<CommentCreateComponent>;

  const entityTypeService = jasmine.createSpyObj('EntityTypeService', {
    getEntityTypeByLabel: jasmine.createSpy('getEntityTypeByLabel')
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentCreateComponent],
      providers: [
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: EntityTypeDataService, useValue: entityTypeService },
        { provide: Router, useValue: new RouterMock() }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentCreateComponent);
    component = fixture.componentInstance;
    entityTypeService.getEntityTypeByLabel().and.return(observableOf('entityLabel'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
