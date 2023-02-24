import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { Item } from '../../core/shared/item.model';
import { RemoteData } from '../../core/data/remote-data';
import { QUESTIONS_BOARD_CONFIG, QuestionsBoardService } from './questions-board.service';
import { QuestionsBoardConfig } from '../../../config/questions-board.config';
import { environment } from '../../../environments/environment';

/**
 * This class represents a resolver that retrieve item that describe the project from synsicris.relation.entity_project metadata
 */
@Injectable()
export class QuestionsBoardItemResolver implements Resolve<RemoteData<Item>> {

  private questionsBoardConfig: QuestionsBoardConfig;

  constructor(
    @Inject(QUESTIONS_BOARD_CONFIG) private questionsBoardConfigName: string,
    private questionsBoardService: QuestionsBoardService) {
    this.questionsBoardConfig = Object.assign({}, environment[questionsBoardConfigName]);
  }

  /**
   * Method for resolving an item based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Item>> Emits the found Item based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Item>> {
    return this.questionsBoardService.getQuestionsBoardObjectFromProjectId(route.params.id, this.questionsBoardConfig.questionsBoardRelationMetadata);
  }
}
