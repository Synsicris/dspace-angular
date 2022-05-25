import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueryResearchOutputComponent } from './query-research-output/query-research-output.component';

const routes: Routes = [
  {
    path: '',
    component: QueryResearchOutputComponent,
    data: {
      title: 'Reserch Outputs',
      breadcrumbKey: 'query-builder',
      showBreadcrumbsFluid: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueryBuilderRoutingModule { }
