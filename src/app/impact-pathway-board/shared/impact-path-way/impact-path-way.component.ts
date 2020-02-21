import { ChangeDetectorRef, Component, Inject, Input, ViewChild } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathway } from '../../../core/impact-pathway/models/impact-pathway.model';
import { PatchImpactPathwayMetadataAction } from '../../../core/impact-pathway/impact-pathway.actions';
import { AppState } from '../../../app.reducer';
import { NativeWindowRef, NativeWindowService } from '../../../core/services/window.service';
import { ImpactPathwayLink } from '../../../core/impact-pathway/impact-pathway.reducer';
import { ImpactPathwayLinksService } from '../../../core/impact-pathway/impact-pathway-links.service';

@Component({
  selector: 'ipw-impact-path-way',
  styleUrls: ['./impact-path-way.component.scss'],
  templateUrl: './impact-path-way.component.html'
})
export class ImpactPathWayComponent {

  @Input() public impactPathway: ImpactPathway;

  @ViewChild('accordionRef') wrapper: NgbAccordion;

  canShowRelations: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(@Inject(NativeWindowService) protected _window: NativeWindowRef,
              private cdr: ChangeDetectorRef,
              private impactPathwayLinksService: ImpactPathwayLinksService,
              private store: Store<AppState>) {
  }

  ngAfterContentChecked() {
    if (this._window.nativeWindow) {
      this.cdr.detectChanges();
      this.loaded.next(true);
    }

  }

  getRelations(): Observable<ImpactPathwayLink[]> {
    return this.impactPathwayLinksService.getAllLinks().pipe(
      tap((relations) => console.log(relations))
    )
  }

  isOpen() {
    return this.wrapper && this.wrapper.activeIds.includes(this.impactPathway.id);
  }

  updateDescription(value) {
    this.store.dispatch(new PatchImpactPathwayMetadataAction(
      this.impactPathway.id,
      this.impactPathway,
      'dc.description',
      0,
      value
    ));
  }
}
