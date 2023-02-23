import { MockActivatedRoute } from '../../shared/mocks/active-router.mock';
import {
  CollapsablePanelComponent
} from '../../impact-pathway-board/shared/collapsable-panel/collapsable-panel.component';
import { TranslateLoaderMock } from '../../shared/testing/translate-loader.mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionsBoardStateService } from '../core/questions-board-state.service';
import { QuestionsBoardService } from '../core/questions-board.service';

import { QuestionsBoardStepComponent } from './questions-board-step.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { QuestionsBoardStep } from '../core/models/questions-board-step.model';
import { ChangeDetectorRef } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('QuestionsBoardStepComponent', () => {
  let component: QuestionsBoardStepComponent;
  let fixture: ComponentFixture<QuestionsBoardStepComponent>;
  const questionsBoardService = jasmine.createSpyObj('questionsBoardService', ['getQuestionsBoardStepFormConfig', 'getQuestionsBoardEditMode', 'getQuestionsBoardEditFormSection']);
  const questionsBoardStateService = jasmine.createSpyObj('questionsBoardStateService', ['dispatchSetQuestionsBoardStepCollapse', 'dispatchUpdateQuestionsBoardStep', 'getCollapsable']);
  const childComponent = jasmine.createSpyObj('component', ['collapsable']);

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [QuestionsBoardStepComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        { provide: QuestionsBoardService, useValue: questionsBoardService },
        { provide: QuestionsBoardStateService, useValue: questionsBoardStateService },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsBoardStepComponent);
    component = fixture.componentInstance;
    component.questionsBoardStep = Object.assign(new QuestionsBoardStep(), { type: 'step_type_1' });
    component.collapsable = Object.assign(new CollapsablePanelComponent({} as ChangeDetectorRef), {});
    component.collapsable.isCollapsed = () => { return observableOf(true); };
    spyOn(component.collapsable, 'isCollapsed').and.returnValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
