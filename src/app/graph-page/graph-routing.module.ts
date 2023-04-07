import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { GraphPageComponent } from './graph-page.component';

const routes: Routes = [
  {
    path: '',
    component: GraphPageComponent,
    canActivate: [AuthenticatedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GraphRoutingModule {}
