import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { Item } from '../core/shared/item.model';
import { ProjectAuthorizationService } from '../core/project/project-authorization.service';

@Component({
  selector: 'ds-project-manage-version',
  templateUrl: './project-manage-version.component.html',
  styleUrls: ['./project-manage-version.component.scss']
})
/**
 * Component that displays the version list information as a coordinator or founder of the project
 */
export class ProjectManageVersionComponent implements OnInit {

  /**
   * A boolean representing the item version of the project entity being managed
   */
  item: Item;

  /**
   * A boolean representing if user is coordinator or founder for the current project
   */
  public isCoordinatorOfProject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * A boolean representing if user is coordinator or founder for the current project
   */
  public isFounderOfProject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    protected authorizationService: ProjectAuthorizationService,
    protected router: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.router.data.subscribe(data => {
      this.item = data.item.payload;

      this.authorizationService.isCoordinator(this.item)
        .subscribe((isCoord: boolean) => {
          this.isCoordinatorOfProject$.next(isCoord);
        });

      this.authorizationService.isFunder(this.item)
        .subscribe((isCoord: boolean) => {
          this.isFounderOfProject$.next(isCoord);
        });
    });
  }

}
