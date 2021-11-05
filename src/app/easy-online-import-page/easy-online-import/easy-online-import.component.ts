import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { UploaderOptions } from '../../shared/uploader/uploader-options.model';
import { EasyOnlineImportService } from '../../core/easy-online-import/easy-online-import.service';
import { RestRequestMethod } from '../../core/data/rest-request-method';
import { AuthService } from '../../core/auth/auth.service';
import { UploaderComponent } from '../../shared/uploader/uploader.component';
import { getItemPageRoute } from '../../item-page/item-page-routing-paths';
import { Item } from '../../core/shared/item.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { EASY_ONLINE_IMPORT } from '../../core/easy-online-import/models/easy-online-import.resource-type';
import { EasyOnlineImport } from '../../core/easy-online-import/models/easy-online-import.model';
import { RequestService } from '../../core/data/request.service';

@Component({
  selector: 'ds-easy-online-import',
  templateUrl: './easy-online-import.component.html',
  styleUrls: ['./easy-online-import.component.scss']
})
export class EasyOnlineImportComponent implements OnInit {
  /**
   * The project item for which make new import
   */
  @Input() projectItem: Item;

  /**
   * The uploader configuration options
   * @type {UploaderOptions}
   */
  uploadFilesOptions: UploaderOptions = Object.assign(new UploaderOptions(), {
    autoUpload: false,
    maxFileNumber: 1,
    allowedMimeType: ['application/xml','text/xml']
  });

  /**
   * Observable keeping track whether or not the uploader has finished initializing
   * Used to start rendering the uploader component
   * @type {BehaviorSubject<boolean>}
   */
  initializedUploaderOptions: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * A boolean representing if a create delete operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  private processingImport$: BehaviorSubject<boolean>  = new BehaviorSubject<boolean>(false);

  /**
   * The function to call on error occurred
   */
  @Output() importComplete: EventEmitter<EasyOnlineImport> = new EventEmitter<EasyOnlineImport>();

  /**
   * The function to call on error occurred
   */
  @Output() importStart: EventEmitter<any> = new EventEmitter<any>();

  /**
   * The logo uploader component
   */
  @ViewChild(UploaderComponent) uploaderComponent: UploaderComponent;

  constructor(
    private authService: AuthService,
    private easyOnlineImportService: EasyOnlineImportService,
    private notification: NotificationsService,
    private requestService: RequestService,
    private router: Router,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.easyOnlineImportService.getImportEndpoint(this.projectItem.id).pipe(take(1))
      .subscribe((href: string) => {
        this.uploadFilesOptions.url = href;
        this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
        this.uploadFilesOptions.method = RestRequestMethod.POST;
        this.initializedUploaderOptions.next(true);
      });
  }

  /**
   * Return a boolean representing if t import operation is pending.
   *
   * @return {Observable<boolean>}
   */
  isProcessingImport(): Observable<boolean> {
    return this.processingImport$.asObservable();
  }

  /**
   * Set project item to stale before to start an import in order to invalidate cache
   */
  public onBeforeUpload = () => {
    this.requestService.setStaleByHrefSubstring(this.projectItem.self);
  }

  /**
   * Show notification on import success
   * @param response
   */
  onImportComplete(response) {
    if (response && response.type && response.type === EASY_ONLINE_IMPORT.value) {
      this.notification.success(this.translate.get('easy-online-import.success'));
      this.processingImport$.next(false);
      this.importComplete.emit(response);
    }
  }

  /**
   * Show notification on import error
   * @param response
   */
  onUploadError(response) {
    this.notification.error(this.translate.get('easy-online-import.error'));
    this.processingImport$.next(false);
  }

  /**
   * Start a new import
   */
  startImport() {
    this.uploaderComponent.uploader.uploadAll();
    this.processingImport$.next(true);
    this.importStart.emit();
  }

  /**
   * Navigate back to project detail page
   */
  goBack() {
    this.router.navigateByUrl(getItemPageRoute(this.projectItem));
  }

}
