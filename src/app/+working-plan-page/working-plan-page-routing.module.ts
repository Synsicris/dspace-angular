import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { WorkingPlanPageComponent } from './working-plan-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { canActivate: [AuthenticatedGuard],
        path: '',
        component: WorkingPlanPageComponent,
        pathMatch: 'full',
        data: { title: 'working-plan.page.title' } },
    ])
  ]
})
export class WorkingPlanPageRoutingModule { }
