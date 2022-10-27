import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../core/shared/item.model';

@Component({
  selector: 'ds-project-manage-version',
  templateUrl: './project-manage-version.component.html',
  styleUrls: ['./project-manage-version.component.scss']
})
export class ProjectManageVersionComponent implements OnInit {

  item: Item;

  constructor(protected router: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.router.data.subscribe(data => {
      this.item = data.item.payload;
      console.log(this.item);
    });
  }

}
