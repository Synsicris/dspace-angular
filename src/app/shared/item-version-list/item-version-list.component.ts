import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BehaviorSubject, of } from 'rxjs';
import { concatMap, filter, map, mergeMap, reduce, tap, withLatestFrom } from 'rxjs/operators';

import { ProjectVersionService } from '../../core/project/project-version.service';
import { Item } from '../../core/shared/item.model';
import { Version } from '../../core/shared/version.model';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { isNotNull } from '../empty.util';

interface VersionDescription {
  title: string;
  date: string;
}

interface ComparingVersionDescription {
  base: VersionDescription;
  comparing: VersionDescription;
}

export interface VersionSelectedEvent {
  base: Item;
  comparing: Item;
  active: Item;
  selected: Item;
}

export interface VersionItemSelectedIds {
  baseId: string;
  comparingId: string;
  activeId: string;
  selectedId: string;
}

interface ItemWithVersion {
  item: Item;
  version?: Version;
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
  @Input() currentVersionItemSelected: VersionItemSelectedIds;

  /**
   * A boolean representing if to show only visible versions
   */
  @Input() showOnlyVisible = false;

  /**
   * The item id to search versions for
   */
  @Input() targetItemId: string;

  /**
   * The item id to search versions for
   */
  @Input() targetItem: Item;

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
  currentVersion: BehaviorSubject<ComparingVersionDescription> = new BehaviorSubject<ComparingVersionDescription>(null);
  currentItemVersion: BehaviorSubject<ItemWithVersion> = new BehaviorSubject<ItemWithVersion>(null);
  activeProjectInstanceVersion: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * The list of versioned items available for the given target
   */
  versionList$: BehaviorSubject<Version[]> = new BehaviorSubject<Version[]>([]);

  /**
   * An event emitted when a version is selected
   */
  @Output() versionSelected: EventEmitter<VersionSelectedEvent> = new EventEmitter<VersionSelectedEvent>();

  /**
   * An event emitted when the current version is removed
   */
  @Output() versionDeselected: EventEmitter<void> = new EventEmitter<void>();

  constructor(protected projectVersionService: ProjectVersionService) {
  }

  ngOnInit(): void {
    of(this.targetItem)
      .pipe(
        filter(item => item?.id != null),
        withLatestFrom(
          this.projectVersionService.getVersionByItemId(this.targetItem?.id)
            .pipe(
              getRemoteDataPayload()
            )
        )
      ).subscribe(
      ([item, version]) => {
        this.currentItemVersion.next({ item, version });
        this.updateCurrentVersion(item, version);
      }
    );
    this.projectVersionService.getVersionsByItemId(this.targetItemId)
      .pipe(
        concatMap((versions: Version[]) => versions),
        mergeMap((version: Version) => {
          return version.item.pipe(
            getFirstCompletedRemoteData(),
            filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded),
            map((itemRD: RemoteData<Item>) => itemRD.payload),
            // isFunder
            filter((item: Item) => !this.showOnlyVisible || this.isVisibleForFunder(item)),
            tap((item: Item) => {
              if (
                this.currentVersionItemSelected &&
                (this.currentVersion.value?.comparing == null || this.currentVersion.value?.base == null)
              ) {
                this.updateCurrentVersion(item, version);
              }
              if (this.projectVersionService.isActiveWorkingInstance(item)) {
                this.activeProjectInstanceVersion.next(version.id);
              }
            }),
            map(() => version)
          );
        }),
        filter((version: Version) => isNotNull(version)),
        reduce((acc: Version[], value: Version) => [...acc, value], []),
      )
      .subscribe((list: Version[]) => this.versionList$.next(list));
  }

  /**
   * Workaround for workingplan refresh issue
   *
   * @param item
   * @param version
   * @private
   */
  private updateCurrentVersion(item: Item, version: Version) {
    if (this.currentVersionItemSelected.baseId === item.id) {
      this.currentVersion.next({
        ...this.currentVersion.value,
        base: this.getVersionDescription(version)
      });
    } else if (this.currentVersionItemSelected.comparingId === item.id) {
      this.currentVersion.next({
        ...this.currentVersion.value,
        comparing: this.getVersionDescription(version)
      });
    }
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
        const selected: ItemWithVersion = { item: itemRD.payload, version: version };
        const active = this.currentItemVersion.value;
        let base = this.currentItemVersion.value;
        let comparing: ItemWithVersion = { item: itemRD.payload, version: version };
        // both versions, take the greatest as base
        if (this.currentItemVersion.value?.version?.version !== 1 && version.version !== 1) {
          const currentVersionNumber = this.currentItemVersion.value?.version?.version;
          if (currentVersionNumber < version?.version) {
            base = selected;
            comparing = this.currentItemVersion.value;
          }
        } else if (version?.version === 1) {
          base = selected;
          comparing = this.currentItemVersion.value;
        }
        this.versionSelected.emit({
          base: base?.item,
          comparing: comparing?.item,
          active: active?.item,
          selected: selected?.item
        });
        this.currentVersion.next({
          base: this.getVersionDescription(base?.version),
          comparing: this.getVersionDescription(comparing?.version)
        });
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

  private isVisibleForFunder(item: Item): boolean {
    return !this.projectVersionService.isActiveWorkingInstance(item) &&
      this.projectVersionService.isVersionVisible(item);
  }
}
