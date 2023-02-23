import { ExternalSource } from './../../../core/shared/external-source.model';
import { getFirstSucceededRemoteDataPayload } from './../../../core/shared/operators';
import { ExternalSourceDataService } from './../../../core/data/external-source-data.service';
import { RequestParam } from './../../../core/cache/models/request-param.model';
import { buildPaginatedList, PaginatedList } from './../../../core/data/paginated-list.model';
import { AuthService } from './../../../core/auth/auth.service';
import { FindListOptions } from './../../../core/data/find-list-options.model';
import { Component, Input, OnInit } from '@angular/core';
import { catchError, combineLatest, map, Observable, of, take } from 'rxjs';
import { Router } from '@angular/router';
import { PageInfo } from 'src/app/core/shared/page-info.model';
import { createSuccessfulRemoteDataObject } from '../../remote-data.utils';

@Component({
  selector: 'ds-item-import-metadata-external',
  templateUrl: './item-import-metadata-external.component.html',
  styleUrls: ['./item-import-metadata-external.component.scss'],
})
export class ItemImportMetadataExternalComponent implements OnInit {
  /**
   * It's used to limit the search within the scope
   */
  @Input() scope: string;

  /**
   * The entity type which the target entity type is related
   */
  @Input() targetEntityType: string;

  /**
   * Used to verify if there is at least one entity available and user is authenticated
   */
  public canBeShown$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private externalService: ExternalSourceDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const findListOptions = Object.assign({}, new FindListOptions(), {
      elementsPerPage: 5,
      currentPage: 1,
      searchParams: [
        new RequestParam('entityType', this.targetEntityType)
      ]
    });

   let hasOneEntity$ =  this.externalService.searchBy('findByEntityType', findListOptions).pipe(
      catchError(() => {
        const pageInfo = new PageInfo();
        const paginatedList = buildPaginatedList(pageInfo, []);
        const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);
        return of(paginatedListRD);
      }),
      getFirstSucceededRemoteDataPayload(),
      map((externalSource: PaginatedList<ExternalSource>) => {
        return externalSource.totalElements > 0;
      })
    );

    this.canBeShown$ = combineLatest([this.isAuthenticated$, hasOneEntity$]).pipe(
      map(([isAuthenticated, hasOneImport]) => isAuthenticated && hasOneImport),
      take(1)
    );
  }

  /**
   * Method called on clicking the button 'Import metadata from external source'. It opens the page of the external import.
   */
  async openPage() {
    const params = Object.create({});
    if (this.targetEntityType) {
      params.entity = this.targetEntityType;
    }
    if (this.scope) {
      params.scope = this.scope;
    }
    await this.router.navigate(['/import-external'], { queryParams: params });
  }

  /**
   * Check if the user is authenticated or not.
   */
  get isAuthenticated$(): Observable<boolean> {
    return this.authService.isAuthenticated();
  }
}
