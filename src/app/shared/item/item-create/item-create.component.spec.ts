import { RouterMock } from './../../mocks/router.mock';
import { Router } from '@angular/router';
import { AuthService } from './../../../core/auth/auth.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCreateComponent } from './item-create.component';
import { AuthServiceMock } from '../../mocks/auth.service.mock';
import { EntityTypeService } from '../../../core/data/entity-type.service';
import { of as observableOf } from 'rxjs';

describe('ItemCreateComponent', () => {
  let component: ItemCreateComponent;
  let fixture: ComponentFixture<ItemCreateComponent>;

  const entityTypeService = jasmine.createSpyObj('EntityTypeService', {
    getEntityTypeByLabel: jasmine.createSpy('getEntityTypeByLabel')
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemCreateComponent],
      providers: [
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: EntityTypeService, useValue: entityTypeService },
        { provide: Router, useValue: new RouterMock() }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCreateComponent);
    component = fixture.componentInstance;
    entityTypeService.getEntityTypeByLabel().and.return(observableOf('entityLabel'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
