import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectVersionService } from '../../core/project/project-version.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'ds-item-version-list',
  templateUrl: './item-version-list.component.html',
  styleUrls: ['./item-version-list.component.scss']
})
export class ItemVersionListComponent implements OnInit {

  /**
   * The button text to display
   */
  @Input() buttonText: string;

  /**
   * The item id to search versions for
   */
  @Input() targetItemId: string;

  /**
   * The list of versioned items available for the given target
   */
  versionList$: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

  @Output() versionSelected: EventEmitter<Item> = new EventEmitter<Item>();
  constructor(protected projectVersionService: ProjectVersionService) {

  }

  ngOnInit(): void {
    this.projectVersionService.getVersionsByItemId(this.targetItemId).subscribe((list: Item[]) => {
      this.versionList$.next(list);
    });
  }

  /**
   * Emit an event when a version is selected
   * @param version
   */
  onVersionSelected(version: Item) {
    this.versionSelected.emit(version);
  }
}
