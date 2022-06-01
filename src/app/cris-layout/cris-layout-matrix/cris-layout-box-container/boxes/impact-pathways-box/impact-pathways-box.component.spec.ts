import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImpactPathwayService } from '../../../../../impact-pathway-board/core/impact-pathway.service';

import { ImpactPathwaysBoxComponent } from './impact-pathways-box.component';

describe('ImpactPathwaysBoxComponent', () => {
  let component: ImpactPathwaysBoxComponent;
  let fixture: ComponentFixture<ImpactPathwaysBoxComponent>;

  const impactPathwayService = jasmine.createSpyObj('ImpactPathwayService', {
    retrieveImpactPathwaysByProject: jasmine.createSpy('retrieveImpactPathwaysByProject')
  });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImpactPathwaysBoxComponent],
      providers: [
        { provide: ImpactPathwayService, useValue: impactPathwayService }
      ]
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
