import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryConditionGroupComponent } from './query-condition-group.component';

describe('QueryConditionGroupComponent', () => {
  let component: QueryConditionGroupComponent;
  let fixture: ComponentFixture<QueryConditionGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryConditionGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryConditionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
