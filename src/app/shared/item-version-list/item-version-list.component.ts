import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { concatMap, filter, map, mergeMap, reduce } from 'rxjs/operators';

import { ProjectVersionService } from '../../core/project/project-version.service';
import { Item } from '../../core/shared/item.model';
import { Version } from '../../core/shared/version.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { isNotNull } from '../empty.util';

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
   * A boolean representing if to show only visible versions
   */
  @Input() showOnlyVisible = false;

  /**
   * The item id to search versions for
   */
  @Input() targetItemId: string;

  /**
   * Class of btn, default sm
   */
  @Input() btnClass = 'btn-sm';

  /**
   * The attribute to display dropdown disabled
   */
  @Input() disabled = false;

  /**
   * The current version selected
   */
  currentVersion: BehaviorSubject<VersionDescription> = new BehaviorSubject<VersionDescription>(null);
  activeProjectInstanceVersion: BehaviorSubject<string> = new BehaviorSubject<string>(null);

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
          return version.item.pipe(
            getFirstCompletedRemoteData(),
            map((itemRD: RemoteData<Item>) => {
              if (itemRD.hasSucceeded && this.currentVersionSelected && itemRD.payload.id === this.currentVersionSelected) {
                this.currentVersion.next(this.getVersionDescription(version));
              }
              if (itemRD.hasSucceeded && this.projectVersionService.isActiveWorkingInstance(itemRD.payload)) {
                console.log(itemRD.payload.id);
                this.activeProjectInstanceVersion.next(version.id);
              }
              return version;
            })
          );
      })),
      mergeMap((version: Version) => this.isVisible(version).pipe(
        map((isVisible: boolean) => (!this.showOnlyVisible || isVisible) ? version : null)
      )),
      filter((version: Version) => isNotNull(version)),
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

  isActiveInstance(version: Version): boolean {
    return version.id === this.activeProjectInstanceVersion.value;
  }

  isVisible(version: Version): Observable<boolean> {
    return version.item.pipe(
      getFirstCompletedRemoteData(),
      map((itemRD: RemoteData<Item>) => {
        if (itemRD.hasSucceeded) {
          return this.projectVersionService.isActiveWorkingInstance(itemRD.payload) || this.projectVersionService.isVersionVisible(itemRD.payload);
        } else {
          return false;
        }
      })
    );
  }
}
