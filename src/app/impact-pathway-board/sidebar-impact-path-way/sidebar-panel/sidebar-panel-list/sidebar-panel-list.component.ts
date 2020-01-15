import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { DragAndDropContainerComponent } from '../../../shared/drag-and-drop-container.component';
import { ImpactPathwayTask } from '../../../../core/impact-pathway/models/impact-pathway-task.model';
import { ImpactPathwayStep } from '../../../../core/impact-pathway/models/impact-pathway-step.model';
import { cloneArrayItem } from '../../../utils/drag-utils';
import { PaginationComponentOptions } from '../../../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../../../core/cache/models/sort-options.model';

@Component({
  selector: 'ipw-sidebar-panel-list',
  styleUrls: ['../../../shared/drag-and-drop-container.component.scss'],
  templateUrl: './sidebar-panel-list.component.html'
})

/**
 * Represents a part of the filter section for a single type of filter
 */
export class SidebarPanelListComponent extends DragAndDropContainerComponent implements OnInit {

  @Input() availableTaskList: Observable<ImpactPathwayTask[]>;

  public filteredTaskList$: BehaviorSubject<ImpactPathwayTask[]> = new BehaviorSubject<ImpactPathwayTask[]>([]);
  public hidePagerWhenSinglePage = true;
  public page = 1;
  public pageSize = 8;
  public sortDirection = SortDirection.ASC;
  public paginationOptions: PaginationComponentOptions = new PaginationComponentOptions();
  public sortOptions: SortOptions;

  ngOnInit(): void {
    super.ngOnInit();

    this.subs.push(this.availableTaskList.pipe(
      first()
    ).subscribe((taskList: ImpactPathwayTask[]) => {
      this.filteredTaskList$.next(taskList);
    }));

    this.paginationOptions.id = 'sidebar-panel-list';
    this.paginationOptions.pageSizeOptions = [4, 8, 12, 16, 20];
    this.paginationOptions.pageSize = this.pageSize;
    this.sortOptions = new SortOptions('type', this.sortDirection);
  }

  drop(event: CdkDragDrop<ImpactPathwayStep>) {
    if (event.previousContainer !== event.container) {
      const task: any = event.previousContainer.data[event.previousIndex];
      if (this.canDrop(event.container.data, task)) {
        const cloneItem: any = this.service.cloneTask(task, event.container.id);
        cloneArrayItem(cloneItem,
          event.container.data.tasks,
          event.previousIndex,
          event.currentIndex);
      }
    }
    this.isDragging.next(false);
    this.isDropAllowed.next(false);
  }

  enterPredicate = () => {
    return false;
  };

  getSortList(tasks: ImpactPathwayTask[]) {
    return (this.sortDirection === SortDirection.DESC) ? tasks.reverse() : tasks
  }

  onPageChange(event) {
    this.page = event;
  }

  onPageSizeChange(event) {
    this.pageSize = event;
  }

  onSortDirectionChange(event) {
    this.sortDirection = event;
    this.filteredTaskList$.next(this.filteredTaskList$.value.reverse());
  }

}
