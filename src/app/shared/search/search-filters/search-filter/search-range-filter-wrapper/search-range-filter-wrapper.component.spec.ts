import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRangeFilterWrapperComponent } from './search-range-filter-wrapper.component';

describe('SearchRangeFilterWrapperComponent', () => {
  let component: SearchRangeFilterWrapperComponent;
  let fixture: ComponentFixture<SearchRangeFilterWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchRangeFilterWrapperComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRangeFilterWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
