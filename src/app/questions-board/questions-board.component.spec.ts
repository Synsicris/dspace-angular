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
  const questionsBoardService = jasmine.createSpyObj('questionsBoardService', ['getQuestionsBoardStepFormConfig', 'getQuestionsBoardEditMode', 'getQuestionsBoardEditFormSection']);
  const questionsBoardStateService = jasmine.createSpyObj('questionsBoardStateService', ['dispatchSetQuestionsBoardStepCollapse', 'dispatchUpdateQuestionsBoardStep', 'getCollapsable', 'isCompareModeActive', 'isQuestionsBoardLoaded', 'getQuestionsBoardStep']);

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
        { provide: QuestionsBoardService, useValue: questionsBoardService },
        { provide: QuestionsBoardStateService, useValue: questionsBoardStateService },
        { provide: ActivatedRoute, useValue: aroute },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsBoardComponent);
    component = fixture.componentInstance;
    questionsBoardStateService.isCompareModeActive.and.returnValue(of(false));
    questionsBoardStateService.isQuestionsBoardLoaded.and.returnValue(of(true));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
