import { TranslateLoaderMock } from './../../../../shared/testing/translate-loader.mock';
import { WorkpacakgeFlatNode } from './../../../core/models/workpackage-step-flat-node.model';
import { AuthorizationDataService } from './../../../../core/data/feature-authorization/authorization-data.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditItemDataService } from '../../../../core/submission/edititem-data.service';

import { WorkingPlanChartItemEditButtonComponent } from './working-plan-chart-item-edit-button.component';
import { of as observableOf } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

describe('WorkingPlanChartItemEditButtonComponent', () => {
  let component: WorkingPlanChartItemEditButtonComponent;
  let fixture: ComponentFixture<WorkingPlanChartItemEditButtonComponent>;

  const editItemDataService = jasmine.createSpyObj('EditItemDataService', {
    checkEditModeByIDAndType: jasmine.createSpy('checkEditModeByIDAndType'),
  });

  const authorizationService: AuthorizationDataService = jasmine.createSpyObj('authorizationService', {
    isAuthorized: observableOf(true)
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingPlanChartItemEditButtonComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: EditItemDataService, useValue: editItemDataService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingPlanChartItemEditButtonComponent);
    component = fixture.componentInstance;
    component.node = Object.assign(new WorkpacakgeFlatNode('1', '1', 1, 'type', true, 1, 'test', 'test', 'test', 20, [], null, false), { selfUrl: 'http://localhost:8000' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when is version of an item', () => {

    beforeEach(() => {
      component.isVersionOfAnItem = true;
      fixture.detectChanges();
    });

    it('should not render edit button', () => {
      const link = fixture.debugElement.query(By.css('button[data-test="edit-btn"'));
      expect(link.nativeElement.disabled).toBeTruthy();
    });


  });
});
