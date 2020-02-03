import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, from as observableFrom, Observable, of as observableOf, Subscription } from 'rxjs';
import { filter, flatMap, map, scan, take, tap } from 'rxjs/operators';
import { NgbActiveModal, NgbDropdownConfig, NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathwayStep } from '../../core/impact-pathway/models/impact-pathway-step.model';
import { ImpactPathwayService } from '../../core/impact-pathway/impact-pathway.service';
import { ImpactPathwayTask } from '../../core/impact-pathway/models/impact-pathway-task.model';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { PaginatedList } from '../../core/data/paginated-list';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { Item } from '../../core/shared/item.model';
import { RemoteData } from '../../core/data/remote-data';
import { SearchTaskService } from './search-task.service';
import {
  GenerateImpactPathwaySubTaskAction,
  GenerateImpactPathwayTaskAction
} from '../../core/impact-pathway/impact-pathway.actions';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { isImpactPathwayProcessingSelector } from '../../core/impact-pathway/selectors';

@Component({
  selector: 'ipw-search-task',
  styleUrls: ['./search-task.component.scss'],
  templateUrl: './search-task.component.html'
})
export class SearchTaskComponent implements OnInit, OnDestroy {

  @Input() step: ImpactPathwayStep;
  @Input() parentTask: ImpactPathwayTask;
  @Input() isObjectivePage: boolean;

  public availableTaskList$: Observable<ImpactPathwayTask[]>;
  public filteredTaskList$: BehaviorSubject<ImpactPathwayTask[]> = new BehaviorSubject<ImpactPathwayTask[]>([]);
  public page = 1;
  public pageSize = 8;
  public sortDirection = SortDirection.ASC;
  public pageInfoState: PageInfo = new PageInfo();
  public paginationOptions: PaginationComponentOptions = new PaginationComponentOptions();
  public selectable = true;
  public selectedTasks: ImpactPathwayTask[] = [];
  public sortOptions: SortOptions;

  private processing$: Observable<boolean> = observableOf(false);
  private resultList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private searching$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private subs: Subscription[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private service: ImpactPathwayService,
    private typeaheadConfig: NgbTypeaheadConfig,
    private dropdownConfig: NgbDropdownConfig,
    private searchTaskService: SearchTaskService,
    private store: Store<AppState>
  ) {

    // customize default values of typeaheads used by this component tree
    typeaheadConfig.showHint = true;
    // customize default values of dropdowns used by this component tree
    dropdownConfig.autoClose = false;
  }

  ngOnInit(): void {
    this.paginationOptions.id = 'search-task';
    this.paginationOptions.pageSizeOptions = [4, 8, 12, 16, 20];
    this.paginationOptions.pageSize = this.pageSize;
    this.sortOptions = new SortOptions('dc.title', this.sortDirection);

    this.availableTaskList$ = this.resultList$.asObservable().pipe(
      flatMap((entries: any[]) => entries),
      flatMap((entry: any) => {
        if (entry.type === 'item') {
          return observableOf(entry);
        } else {
          return entry.item.pipe(
            filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && isNotEmpty(itemRD.payload)),
            take(1),
            map((itemRD: RemoteData<Item>) => itemRD.payload)
          )
        }
      }),
      tap((item: Item) => console.log('item: ', item.id, item)),
      map((item: Item) => this.service.initImpactPathwayTask(item)),
      tap((item: ImpactPathwayTask) => console.log('ImpactPathwayTask: ', item)),
      scan((acc: any, value: any) => [...acc, ...value], []),
      tap((list) => console.log('reduce!!!!!!!!!!!!!!!!!!!!!!!!!!!!', list)),
    );

    this.processing$ = this.store.pipe(
      select(isImpactPathwayProcessingSelector)
    );

    this.subs.push(this.availableTaskList$.pipe(
      // first()
    ).subscribe((taskList: ImpactPathwayTask[]) => {
      console.log('filteredTaskList$!!!!!!!!!!!!!!!!!!!!!!!!!!!!', taskList);
      this.filteredTaskList$.next(taskList);
    }));

    this.search(this.paginationOptions, this.sortOptions)

  }

  isProcessing(): Observable<boolean> {
    return this.processing$;
  }

  isSearching(): Observable<boolean> {
    return this.searching$.asObservable();
  }

  onPaginationChange(event) {
    this.search(Object.assign(new PaginationComponentOptions(), this.paginationOptions, {
      currentPage: event.page,
      pageSize: event.pageSize,
      field: event.sortFiel,
      direction: event.sortDirection
    }), this.sortOptions);
  }

  onPageChange(page) {
    this.search(Object.assign(new PaginationComponentOptions(), this.paginationOptions, {
      currentPage: page
    }), this.sortOptions);
  }

  onPageSizeChange(pageSize) {
    this.search(Object.assign(new PaginationComponentOptions(), this.paginationOptions, {
      pageSize: pageSize
    }), this.sortOptions);
  }

  onSubmit() {
    this.selectedTasks.forEach((task) => {
      this.addTask(task);
    });
  }

  private addTask(task: ImpactPathwayTask) {
    if (this.isObjectivePage) {
      this.store.dispatch(new GenerateImpactPathwaySubTaskAction(
        this.step.parentId,
        this.step.id,
        this.parentTask.id,
        task.type,
        task.title,
        task.description,
        this.activeModal));
    } else {
      this.store.dispatch(new GenerateImpactPathwayTaskAction(
        this.step.parentId,
        this.step.id,
        task.type,
        task.title,
        task.description,
        this.activeModal));
    }
  }

  onTaskDeselected(task: ImpactPathwayTask) {
    const index: number = this.selectedTasks.indexOf(task);
    if (index !== -1) {
      this.selectedTasks.splice(index, 1);
    }
  }

  onTaskSelected(task: ImpactPathwayTask) {
    this.selectedTasks.push(task)
  }

  private search(paginationOptions: PaginationComponentOptions, sortOptions: SortOptions) {
    this.searching$.next(true);
    this.searchTaskService.searchAvailableImpactPathwayTasksByStepType(this.step.type, paginationOptions, sortOptions).pipe(
      take(1)
    ).subscribe((resultPaginatedList: PaginatedList<any>) => {
      this.pageInfoState = resultPaginatedList.pageInfo;
      this.resultList$.next(resultPaginatedList.page);
      this.searching$.next(false);
    });

  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
