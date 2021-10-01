import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { redirectOn4xx } from '../core/shared/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { EasyOnlineImport } from '../core/easy-online-import/models/easy-online-import.model';

@Component({
  selector: 'ds-easy-online-import-page',
  templateUrl: './easy-online-import-page.component.html',
  styleUrls: ['./easy-online-import-page.component.scss']
})
export class EasyOnlineImportPageComponent implements OnInit {

  /**
   * The item wrapped in a remote-data object
   */
  itemRD$: Observable<RemoteData<Item>>;

  importResults: BehaviorSubject<EasyOnlineImport> = new BehaviorSubject<EasyOnlineImport>(null);

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService)
    );
  }

  updateResults(results: EasyOnlineImport) {
    this.importResults.next(results);
  }
}
