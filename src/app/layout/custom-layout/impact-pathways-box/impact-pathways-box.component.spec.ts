import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactPathwaysBoxComponent } from './impact-pathways-box.component';

describe('ImpactPathwaysBoxComponent', () => {
  let component: ImpactPathwaysBoxComponent;
  let fixture: ComponentFixture<ImpactPathwaysBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpactPathwaysBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactPathwaysBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
