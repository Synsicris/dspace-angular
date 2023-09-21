import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, fromEvent, delay, withLatestFrom, switchMap, map, BehaviorSubject, OperatorFunction, tap, Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { NativeWindowService, NativeWindowRef } from '../../core/services/window.service';
import { isNotEmpty } from '../empty.util';
import isEqual from 'lodash/isEqual';

type PrintView = 'wp' | 'ipw' | 'objectives';

@Injectable({
  providedIn: 'root'
})
export class PrintViewService {

  /**
   * Used to know if the page is loaded
   * Used to render and derender the page in order to upload print styles
   */
  public loadedPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  /**
   * Used to know if the page is loaded
   * Used to render and derender the page in order to upload print styles for arrows
   */
  public loadedArrows: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  /**
   * Checking the printing status
   */
  private isPrinting$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
    @Inject(PLATFORM_ID) protected platformId: Object,
    protected aroute: ActivatedRoute,
    private router: Router
  ) { }

  /**
   * Preparing the view for printing.
   * Listening to the beforeprint and afterprint events to know when to print.
   * Adding the print query param to the url.
   * Reloading the page to upload print styles.
   * @param view the view to be printed (wp, ipw, objectives)
   * based on the page we want to print
   */
  public preparePrintView(view: PrintView) {
    const params$ =
      this.aroute.queryParams
        .pipe(
          filter(params => isNotEmpty(params))
        );

    this.isPrinting$
      .pipe(
        filter(isPrinting => isPrinting === true),
        this.reload(view),
      ).subscribe(() => this._window.nativeWindow.print());

    if (isPlatformBrowser(this.platformId)) {
      fromEvent(this._window.nativeWindow, 'beforeprint')
        .subscribe((event: Event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.onPrint();
        });

         fromEvent(this._window.nativeWindow, 'afterprint')
        .pipe(
          delay(100),
          withLatestFrom(this.isPrinting$),
          filter(([, isPrinting]) => isPrinting === true),
          switchMap(() => fromPromise(this.router.navigate([], { queryParams: { view: 'default' } }))),
          this.reload(view)
        )
        .subscribe(() => this.isPrinting$.next(false));
    }

    params$
      .pipe(
        map(params => params?.print),
        filter(printParam => isEqual(printParam, 'true') && this._window.nativeWindow)
      )
      .subscribe(() => this.isPrinting$.next(true));
  }

  /**
 * On print button click
 * add query param to url
 * and reload the page to upload print styles
 */
  private onPrint() {
    this.router.navigate([], { queryParams: { view: 'print', print: true } });
  }

  /**
   * Reload the page to upload print styles
   * @param view the view to be printed (wp, ipw, objectives)
   */
  private reload(view: PrintView): OperatorFunction<any, any> {
    if (isEqual(view, 'ipw')) {
      return this.reloadArrows();
    } else {
      return this.reloadPage();
    }
  }

  /**
   * sequence of actions to signal the start and end of a page loading process
   */
  private reloadPage(): OperatorFunction<any, any> {
    return source =>
      source.pipe(
        tap(() => this.loadedPage.next(false)),
        delay(100),
        tap(() => this.loadedPage.next(true)),
        delay(1),
      );
  }

  /**
   * sequence of actions to signal the start and end of a page loading process
   * (for impact pathway arrows)
   */
  private reloadArrows(): OperatorFunction<any, any> {
    return source =>
      source.pipe(
        tap(() => this.loadedArrows.next(false)),
        delay(1),
        tap(() => this.loadedArrows.next(true)),
        delay(1),
      );
  }

}
