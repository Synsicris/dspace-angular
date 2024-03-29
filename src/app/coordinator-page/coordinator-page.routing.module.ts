import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoordinatorPageComponent } from './coordinator-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { EndUserAgreementCurrentUserGuard } from '../core/end-user-agreement/end-user-agreement-current-user.guard';
import { CoordinatorPageResolver } from './coordinator-page.resolver';

/**
 * RouterModule to help navigate to the page with the community list tree
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [AuthenticatedGuard, EndUserAgreementCurrentUserGuard],
        path: '',
        component: CoordinatorPageComponent,
        pathMatch: 'full',
        data: { title: 'coordinator.page.title' },
        resolve: {
          researchProfile: CoordinatorPageResolver
        }
      }
    ]),
  ],
  providers: [
    CoordinatorPageResolver
  ]
})
export class CoordinatorPageRoutingModule {
}
