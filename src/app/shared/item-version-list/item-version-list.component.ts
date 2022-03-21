import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { ProjectVersionService } from '../../core/project/project-version.service';
import { Item } from '../../core/shared/item.model';
import { Version } from '../../core/shared/version.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';

@Component({
  selector: 'ds-item-version-list',
  templateUrl: './item-version-list.component.html',
  styleUrls: ['./item-version-list.component.scss']
})
export class ItemVersionListComponent implements OnInit {

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
  currentVersion: BehaviorSubject<string> = new BehaviorSubject<string>('');

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
    this.projectVersionService.getVersionsByItemId(this.targetItemId).subscribe((list: Version[]) => {
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
        this.currentVersion.next(version.created.toString());
      }
    });
  }

  /**
   * Emit an event when a version is deselected
   */
  onVersionDeselected() {
    this.currentVersion.next('');
    this.versionDeselected.emit();
  }
}
