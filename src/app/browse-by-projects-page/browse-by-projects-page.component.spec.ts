import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseByProjectsPageComponent } from './browse-by-projects-page.component';

describe('BrowseByProjectsPageComponent', () => {
  let component: BrowseByProjectsPageComponent;
  let fixture: ComponentFixture<BrowseByProjectsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseByProjectsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByProjectsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
