import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';

import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { hasValue, isNotEmpty } from '../../shared/empty.util';

@Component({
  selector: 'ds-help-page-content',
  templateUrl: './help-page-content.component.html',
  styleUrls: ['./help-page-content.component.scss']
})
export class HelpPageContentComponent implements OnInit, OnDestroy {

  /**
   * The page i18n key retrieved from route data
   */
  public i18nKey;

  /**
   * The prefix used for page content label's i18n key
   */
  public contentI18nPrefix = 'help-page.content.';

  /**
   * The i18n key used for page content label
   */
  public contentI18nKey = '';

  /**
   * The prefix used for page header label's i18n key
   */
  public headerI18nPrefix = 'help-page.header.';

  /**
   * The i18n key used for page header label
   */
  public headerI18nKey = '';

  /**
   * The nested help pages relative to the current one, if any
   */
  public childrenPages: string[];

  /**
   * The current activated route
   * @private
   */
  public childRoute: ActivatedRoute;

  /**
   * Subscription to router events
   * @private
   */
  private routerSub: Subscription;

  constructor(protected route: ActivatedRoute, protected router: Router) {
  }

  ngOnInit(): void {
    this.routerSub = this.router.events.pipe(
      filter((e: RouterEvent): e is NavigationEnd => e instanceof NavigationEnd),
    ).subscribe(() => this.updatePageContentByRoute(this.route));

    this.updatePageContentByRoute(this.route);
  }

  /**
   * navigate back to parent help page
   */
  back() {
    this.router.navigate(['./..'], { relativeTo: this.childRoute });
  }

  ngOnDestroy(): void {
    if (hasValue(this.routerSub)) {
      this.routerSub.unsubscribe();
    }
  }

  private updatePageContentByRoute(route: ActivatedRoute) {
    if (route.snapshot?.firstChild?.data) {
      // Current route has children so iterate to the last one
      this.childRoute = route.firstChild;
      let childSnapshot = route.snapshot?.firstChild;
      while (isNotEmpty(childSnapshot.firstChild)) {
        this.childRoute = this.childRoute.firstChild;
        childSnapshot = childSnapshot.firstChild;
      }
      this.i18nKey = childSnapshot.data.i18nKey;
      this.childrenPages = childSnapshot.data.children || [];

    } else {
      this.childRoute = this.route;
      this.i18nKey = this.route.snapshot.data.i18nKey;
      this.childrenPages = this.route.snapshot.data.children || [];
    }
    this.contentI18nKey = this.contentI18nPrefix + this.i18nKey;
    this.headerI18nKey = this.headerI18nPrefix + this.i18nKey;
  }

  navigateToPage(childPage: string) {
    this.router.navigate([`./${childPage}`], { relativeTo: this.childRoute });
  }
}
