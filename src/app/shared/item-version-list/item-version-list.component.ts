import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BehaviorSubject, of } from 'rxjs';

import { ProjectVersionService } from '../../core/project/project-version.service';
import { Item } from '../../core/shared/item.model';
import { Version } from '../../core/shared/version.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { concatMap, map, mergeMap, reduce } from 'rxjs/operators';

interface VersionDescription {
  title: string;
  date: string;
}

@Component({
  selector: 'ds-item-version-list',
  templateUrl: './item-version-list.component.html',
  styleUrls: ['./item-version-list.component.scss']
})
export class ItemVersionListComponent implements OnInit {

  /**
   * The id of the current version item selected
   */
  @Input() currentVersionSelected: string;

  /**
   * The item id to search versions for
   */
  @Input() targetItemId: string;

  /**
   * Class of btn, default sm
   */
  @Input() btnClass = 'btn-sm';

  /**
   * The current version selected
   */
  currentVersion: BehaviorSubject<VersionDescription> = new BehaviorSubject<VersionDescription>(null);

  /**
   * The list of versioned items available for the given target
   */
  versionList$: BehaviorSubject<Version[]> = new BehaviorSubject<Version[]>([]);

  /**
   * An event emitted when a version is selected
   */
  @Output() versionSelected: EventEmitter<Item> = new EventEmitter<Item>();

  /**
   * An event emitted when the current version is removed
   */
  @Output() versionDeselected: EventEmitter<void> = new EventEmitter<void>();

  constructor(protected projectVersionService: ProjectVersionService) {
  }

  ngOnInit(): void {
    this.projectVersionService.getVersionsByItemId(this.targetItemId).pipe(
      concatMap((versions: Version[]) => versions),
      mergeMap(((version: Version) => {
        if (this.currentVersionSelected) {
          return version.item.pipe(
            getFirstCompletedRemoteData(),
            map((itemRD: RemoteData<Item>) => {
              if (itemRD.hasSucceeded && itemRD.payload.id === this.currentVersionSelected) {
                this.currentVersion.next(this.getVersionDescription(version));
              }
              return version;
            })
          );
        } else {
          return of(version);
        }
      })),
      reduce((acc: Version[], value: Version) => [...acc, value], []),
    ).subscribe((list: Version[]) => {
      this.versionList$.next(list);
    });
  }

  /**
   * Emit an event when a version is selected
   * @param version
   */
  onVersionSelected(version: Version) {
    version.item.pipe(
      getFirstCompletedRemoteData()
    ).subscribe((itemRD: RemoteData<Item>) => {
      if (itemRD.hasSucceeded) {
        this.versionSelected.emit(itemRD.payload);
        this.currentVersion.next(this.getVersionDescription(version));
      }
    });
  }

  /**
   * Emit an event when a version is deselected
   */
  onVersionDeselected() {
    this.currentVersion.next(null);
    this.versionDeselected.emit();
  }

  private getVersionDescription(version: Version): VersionDescription {
    return {
      title: version?.summary || '',
      date: version?.created?.toString() || ''
    };
  }
}
