import { QueryBuilderComponent } from './query-builder.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: QueryBuilderComponent,
    data: {
      title: 'Query Builder',
      breadcrumbKey: 'query-builder',
      showBreadcrumbsFluid: true
    },
    // canActivate: [EndUserAgreementCurrentUserGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueryBuilderRoutingModule { }
