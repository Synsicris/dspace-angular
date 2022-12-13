import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { redirectOn4xx } from '../core/shared/operators';
import { fadeInOut } from '../shared/animations/fade';
import { AuthService } from '../core/auth/auth.service';

/**
 * This component is the entry point for the page that renders items.
 */
@Component({
  selector: 'ds-cris-item-page',
  templateUrl: './cris-item-page.component.html',
  styleUrls: ['./cris-item-page.component.scss'],
  animations: [fadeInOut]
})
export class CrisItemPageComponent implements OnInit {

  itemRD$: Observable<RemoteData<Item>>;
  isVersionOfAnItem$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.itemRD$ = this.route.data.pipe(
      map((data) => {
        return data.dso as RemoteData<Item>;
      }),
      redirectOn4xx(this.router, this.authService)
    );

    this.isVersionOfAnItem$ = this.route.data.pipe(
      map((data) => data.isVersionOfAnItem),
      filter((isVersionOfAnItem) => isVersionOfAnItem === true),
      take(1)
    );
  }

}
