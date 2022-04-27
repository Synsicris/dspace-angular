import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryResearchOutputComponent } from './query-research-output.component';

describe('QueryResearchOutputComponent', () => {
  let component: QueryResearchOutputComponent;
  let fixture: ComponentFixture<QueryResearchOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryResearchOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryResearchOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
