import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { Item } from '../core/shared/item.model';

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
  public isCoordinatorOfProject$: Observable<boolean>;
  /**
   * A boolean representing if user is coordinator or founder for the current project
   */
  public isFounderOfProject$: Observable<boolean>;

  constructor(
    protected authorizationService: AuthorizationDataService,
    protected router: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.router.data.subscribe(data => {
      this.item = data.item.payload;
      this.isCoordinatorOfProject$ = this.authorizationService.isAuthorized(FeatureID.isCoordinatorOfProject, this.item.self);
      this.isFounderOfProject$ = this.authorizationService.isAuthorized(FeatureID.isFunderOfProject, this.item.self);
    });
  }

}
