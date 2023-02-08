import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { QuestionsBoardStateService } from './core/questions-board-state.service';
import { QuestionsBoardService } from './core/questions-board.service';

import { QuestionsBoardComponent } from './questions-board.component';
import { of as observableOf, of } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';

describe('QuestionsBoardComponent', () => {
  let component: QuestionsBoardComponent;
  let fixture: ComponentFixture<QuestionsBoardComponent>;
  const exploitationPlanService = jasmine.createSpyObj('exploitationPlanService', ['getExploitationPlanStepFormConfig', 'getExploitationPlanEditMode', 'getExploitationPlanEditFormSection']);
  const exploitationPlanStateService = jasmine.createSpyObj('exploitationPlanStateService', ['dispatchSetExploitationPlanStepCollapse', 'dispatchUpdateExploitationPlanStep', 'getCollapsable', 'isCompareModeActive', 'isExploitationPlanLoaded', 'getExploitationPlanStep']);

  let aroute;

  beforeEach(async () => {

    aroute = {
      data: observableOf({ isVersionOfAnItem: observableOf(false) }),
    };

    await TestBed.configureTestingModule({
      declarations: [QuestionsBoardComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      providers: [
        { provide: QuestionsBoardService, useValue: exploitationPlanService },
        { provide: QuestionsBoardStateService, useValue: exploitationPlanStateService },
        { provide: ActivatedRoute, useValue: aroute },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsBoardComponent);
    component = fixture.componentInstance;
    exploitationPlanStateService.isCompareModeActive.and.returnValue(of(false));
    exploitationPlanStateService.isExploitationPlanLoaded.and.returnValue(of(true));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
