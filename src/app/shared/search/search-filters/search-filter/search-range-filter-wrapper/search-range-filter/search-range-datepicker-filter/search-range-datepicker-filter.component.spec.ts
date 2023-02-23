import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRangeDatepickerFilterComponent } from './search-range-datepicker-filter.component';

describe('SearchRangeDatepickerFilterComponent', () => {
  let component: SearchRangeDatepickerFilterComponent;
  let fixture: ComponentFixture<SearchRangeDatepickerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchRangeDatepickerFilterComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRangeDatepickerFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
