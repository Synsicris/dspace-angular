import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { combineLatest, Observable, of as observableOf } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { HasPolicyEditGrantsGuard } from '../../core/project/authorization-guards/has-policy-edit-grants.guard';
import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import { QUESTIONS_BOARD_CONFIG, QuestionsBoardService } from './questions-board.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { isNotEmpty } from '../../shared/empty.util';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { QuestionsBoardConfig } from '../../../config/questions-board.config';
import { environment } from '../../../environments/environment';

/**
 * Prevent unauthorized activating and loading of routes when the current authenticated user doesn't have edit grants on
 * the given item
 */
@Injectable()
export class QuestionsBoardGuard extends HasPolicyEditGrantsGuard {
  private questionsBoardConfig: QuestionsBoardConfig;

  constructor(
    @Inject(QUESTIONS_BOARD_CONFIG) private questionsBoardConfigName: string,
    private questionsBoardService: QuestionsBoardService,
    protected authorizationService: AuthorizationDataService,
    protected itemService: ItemDataService,
    protected router: Router
  ) {
    super(authorizationService, itemService, router);
    this.questionsBoardConfig = Object.assign({}, environment[questionsBoardConfigName]);
  }

  /**
   * True when user has edit grants
   * Reroutes to a 404 page when the page cannot be activated
   * @method canActivate
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const itemRD$ = this.retrieveItem(route);

    return itemRD$.pipe(
      switchMap((itemRD: RemoteData<Item>) => {
        if (isNotEmpty(itemRD) && itemRD.hasSucceeded) {
          return combineLatest([
              this.authorizationService.isAuthorized(FeatureID.HasEditGrantsOnItem, itemRD.payload.self),
              this.authorizationService.isAuthorized(FeatureID.HasVersioningReadGrantsOnItem, itemRD.payload.self),
              this.authorizationService.isAuthorized(FeatureID.isReaderOfProject, itemRD.payload.self),
              this.authorizationService.isAuthorized(FeatureID.isExternalreaderOfProject, itemRD.payload.self),
              this.authorizationService.isAuthorized(FeatureID.isFunderOrganizationalManagerOfProgramme, itemRD.payload.self),
              this.authorizationService.isAuthorized(FeatureID.AdministratorOf)
            ]
          ).pipe(
            map(([hasEdit, hasVersioningRead, isReader, isExternalReader, isAdmin, isFunderOrganizationalManager]) => hasEdit || hasVersioningRead || isReader || isExternalReader || isFunderOrganizationalManager || isAdmin)
          );
        } else {
          return observableOf(false);
        }
      }),
      tap((isValid: boolean) => {
        if (!isValid) {
          this.router.navigate(['/403']);
        }
      })
    );
  }

  protected retrieveItem(route: ActivatedRouteSnapshot): Observable<RemoteData<Item>> {
    return  this.questionsBoardService.getQuestionsBoardObjectFromProjectId(route.params.id, this.questionsBoardConfig.questionsBoardRelationMetadata);
  }
}
