import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Item } from '../../core/shared/item.model';
import { Version } from '../../core/shared/version.model';
import { ProjectVersionService } from '../../core/project/project-version.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { PROJECT_ENTITY, PROJECT_RELATION_METADATA } from '../../core/project/project-data.service';
import { ItemDataService } from '../../core/data/item-data.service';

@Component({
  selector: 'ds-view-version-badges',
  templateUrl: './view-version-badges.component.html',
  styleUrls: ['./view-version-badges.component.scss']
})
/**
 * The component for displaying badges related to a version and its official
 */
export class ViewVersionBadgesComponent implements OnInit {

  /**
   * The item for which to show the badge
   */
  @Input() item: Item;

  /**
   * The project's item which the given item belong to
   */
  projectItem$: BehaviorSubject<Item> = new BehaviorSubject<Item>(null);

  /**
   * The version that is being displayed
   */
  version$: BehaviorSubject<Version> = new BehaviorSubject<Version>(null);

  /**
   * Shows if the version is created within 4 weeks
   */
  withinWeek = false;

  constructor(protected itemService: ItemDataService, protected projectVersionService: ProjectVersionService) {
  }

  ngOnInit(): void {
    if (this.projectVersionService.isVersionOfAnItem(this.item)) {
      let itemId;
      if (this.item.entityType === PROJECT_ENTITY) {
        itemId = this.item.id;
        this.projectItem$.next(this.item);
      } else {
        itemId = this.item.firstMetadata(PROJECT_RELATION_METADATA)?.authority;
        this.itemService.findById(itemId).pipe(
          getFirstCompletedRemoteData()
        ).subscribe((itemRD: RemoteData<Item>) => {
          if (itemRD.hasSucceeded) {
            this.projectItem$.next(itemRD.payload);
          }
        });
      }

      if (itemId) {
        this.projectVersionService.getVersionByItemId(itemId).pipe(
          getFirstCompletedRemoteData()
        ).subscribe((versionRD: RemoteData<Version>) => {
          if (versionRD.hasSucceeded) {
            this.version$.next(versionRD.payload);
            if (this.isYoungerThanFourWeeks(versionRD.payload)) {
              this.withinWeek = true;
            }
          }
        });
      }
    }
  }

  /**
   * Checks the difference between the dates to understand if its within 4 weeks
   */
  isYoungerThanFourWeeks(version: Version) {
    const startDate: number = new Date(version.created).getDate();
    const endDate: number = new Date().getDate();
    return Math.ceil(Math.abs(startDate - endDate) / (1000 * 60 * 60 * 24)) <= 28;
  }

}
