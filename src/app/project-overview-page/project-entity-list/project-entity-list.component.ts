import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs/operators';

import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { fadeInOut } from '../../shared/animations/fade';

@Component({
  selector: 'ds-project-entity-list',
  templateUrl: './project-entity-list.component.html',
  styleUrls: ['./project-entity-list.component.scss'],
  animations: [
    fadeInOut
  ]
})
export class ProjectEntityListComponent implements OnInit {

  entityList: string[];
  listKey: string;
  listName: string;
  listType: string;
  paginationOptions = new PaginationComponentOptions();
  sortOptions = new SortOptions('dc.title', SortDirection.ASC);

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.pipe(
      take(1)
    ).subscribe((params) => {

      this.listName = params.name;
      this.listType = params.type;
      this.listKey = this.listName + '_' + this.listType + '.breadcrumbs';
      this.paginationOptions.id = `${this.listName}_${this.listType}_list`;
      this.paginationOptions.pageSize = 5
    })
    this.route.data.pipe(
      take(1)
    ).subscribe((data) => {
      this.entityList = data.entityList
    });
  }

  pageChanged(page) {
    this.paginationOptions.currentPage = page;
  }

  pageSizeChanged(pageSize) {
    this.paginationOptions.pageSize = pageSize;
  }
}
