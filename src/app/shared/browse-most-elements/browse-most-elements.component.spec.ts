// // Load the implementations that should be tested
// import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { ComponentFixture, fakeAsync, inject, TestBed, tick, waitForAsync, } from '@angular/core/testing';
//
// import { Chips } from './models/chips.model';
// import { UploaderService } from '../uploader/uploader.service';
// import { BrowseMostElements } from './chips.component';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { By } from '@angular/platform-browser';
// import { FormFieldMetadataValueObject } from '../form/builder/models/form-field-metadata-value.model';
// import { createTestComponent } from '../testing/utils.test';
// import { AuthorityConfidenceStateDirective } from '../authority-confidence/authority-confidence-state.directive';
// import { TranslateModule } from '@ngx-translate/core';
// import { ConfidenceType } from '../../core/shared/confidence-type';
// import { SortablejsModule } from 'ngx-sortablejs';
// import { environment } from '../../../environments/environment';
//
// describe('ChipsComponent test suite', () => {
//
//   let testComp: TestComponent;
//   let chipsComp: BrowseMostElements;
//   let testFixture: ComponentFixture<TestComponent>;
//   let chipsFixture: ComponentFixture<BrowseMostElements>;
//   let html;
//   let chips: Chips;
//
//   // waitForAsync beforeEach
//   beforeEach(waitForAsync(() => {
//
//     TestBed.configureTestingModule({
//       imports: [
//         NgbModule,
//         SortablejsModule.forRoot({ animation: 150 }),
//         TranslateModule.forRoot()
//       ],
//       declarations: [
//         BrowseMostElements,
//         TestComponent,
//         AuthorityConfidenceStateDirective
//       ], // declare the test component
//       providers: [
//         ChangeDetectorRef,
//         BrowseMostElements,
//         UploaderService
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]
//     });
//
//   }));
//
//   describe('', () => {
//     // synchronous beforeEach
//     beforeEach(() => {
//       html = `
//       <ds-chips
//         *ngIf="chips.hasItems()"
//         [chips]="chips"
//         [editable]="editable"
//         (selected)="onChipSelected($event)"></ds-chips>`;
//
//       testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
//       testComp = testFixture.componentInstance;
//     });
//
//     it('should create Chips Component', inject([BrowseMostElements], (app: BrowseMostElements) => {
//       expect(app).toBeDefined();
//     }));
//   });
//
//   describe('when has items as string', () => {
//     beforeEach(() => {
//       chips = new Chips(['a', 'b', 'c']);
//       chipsFixture = TestBed.createComponent(BrowseMostElements);
//       chipsComp = chipsFixture.componentInstance; // TruncatableComponent test instance
//       chipsComp.chips = chips;
//       chipsFixture.detectChanges();
//     });
//
//     afterEach(() => {
//       chipsFixture.destroy();
//       chipsComp = null;
//     });
//
//     it('should emit when a chip item is removed', fakeAsync(() => {
//
//       spyOn(chipsComp.chips, 'remove');
//
//       const item = chipsComp.chips.getChipByIndex(1);
//
//       chipsComp.removeChips(new Event('click'), 1);
//       chipsFixture.detectChanges();
//       tick();
//
//       expect(chipsComp.chips.remove).toHaveBeenCalledWith(item);
//     }));
//
//     it('should save chips item index when drag and drop start', fakeAsync(() => {
//       const de = chipsFixture.debugElement.query(By.css('li.nav-item'));
//
//       de.triggerEventHandler('dragstart', null);
//
//       expect(chipsComp.dragged).toBe(0);
//     }));
//
//     it('should update chips item order when drag and drop end', fakeAsync(() => {
//       spyOn(chipsComp.chips, 'updateOrder');
//       const de = chipsFixture.debugElement.query(By.css('li.nav-item'));
//
//       de.triggerEventHandler('dragend', null);
//
//       expect(chipsComp.dragged).toBe(-1);
//       expect(chipsComp.chips.updateOrder).toHaveBeenCalled();
//     }));
//   });
//
//   describe('when has items as object', () => {
//     beforeEach(() => {
//       const item = {
//         mainField: new FormFieldMetadataValueObject('main test', null, 'test001', 'main test', 0, ConfidenceType.CF_ACCEPTED),
//         relatedField: new FormFieldMetadataValueObject('related test', null, 'test002', 'related test', 0, ConfidenceType.CF_ACCEPTED),
//         otherRelatedField: new FormFieldMetadataValueObject('other related test')
//       };
//
//       chips = new Chips([item], 'display', 'mainField', environment.submission.icons.metadata);
//       chipsFixture = TestBed.createComponent(BrowseMostElements);
//       chipsComp = chipsFixture.componentInstance; // TruncatableComponent test instance
//       chipsComp.showIcons = true;
//       chipsComp.chips = chips;
//       chipsFixture.detectChanges();
//     });
//
//     it('should show icon for every field that has a configured icon', () => {
//       const de = chipsFixture.debugElement.query(By.css('li.nav-item'));
//       const icons = de.queryAll(By.css('i.fas'));
//
//       expect(icons.length).toBe(4);
//
//     });
//
//     it('should show tooltip on mouse over an icon', () => {
//       const de = chipsFixture.debugElement.query(By.css('li.nav-item'));
//       const icons = de.queryAll(By.css('i.fas'));
//
//       icons[0].triggerEventHandler('mouseover', null);
//
//       expect(chipsComp.tipText).toEqual(['main test']);
//     });
//   });
//
//   describe('hasWillBeGenerated', () => {
//     beforeEach(() => {
//       chips = new Chips([]);
//       chipsFixture = TestBed.createComponent(BrowseMostElements);
//       chipsComp = chipsFixture.componentInstance; // TruncatableComponent test instance
//       chipsComp.chips = chips;
//       chipsFixture.detectChanges();
//     });
//
//     it('should return true if authority starts with will be generated and false otherwise', () => {
//       const metadata = 'dc.title';
//       let chip;
//       chip = { item: { 'dc.title': { authority: 'will be generated::'}}} as any;
//       expect(chipsComp.hasWillBeGenerated(chip, metadata)).toEqual(true);
//
//       chip = { item: { 'dc.title': { authority: ''}}} as any;
//       expect(chipsComp.hasWillBeGenerated(chip, metadata)).toEqual(false);
//     });
//
//   });
//
//   describe('hasWillBeReferenced', () => {
//     beforeEach(() => {
//       chips = new Chips([]);
//       chipsFixture = TestBed.createComponent(BrowseMostElements);
//       chipsComp = chipsFixture.componentInstance; // TruncatableComponent test instance
//       chipsComp.chips = chips;
//       chipsFixture.detectChanges();
//     });
//
//     it('should return true if authority starts with will be referenced and false otherwise', () => {
//       const metadata = 'dc.title';
//       let chip;
//       chip = { item: { 'dc.title': { authority: 'will be referenced::'}}} as any;
//       expect(chipsComp.hasWillBeReferenced(chip, metadata)).toEqual(true);
//
//       chip = { item: { 'dc.title': { authority: ''}}} as any;
//       expect(chipsComp.hasWillBeReferenced(chip, metadata)).toEqual(false);
//     });
//
//   });
//
//   describe('getWillBeReferencedContent', () => {
//     beforeEach(() => {
//       chips = new Chips([]);
//       chipsFixture = TestBed.createComponent(BrowseMostElements);
//       chipsComp = chipsFixture.componentInstance; // TruncatableComponent test instance
//       chipsComp.chips = chips;
//       chipsFixture.detectChanges();
//     });
//
//     it('should return the value of the reference if present, null otherwise', () => {
//       const metadata = 'dc.title';
//       let chip;
//       chip = { item: { 'dc.title': { authority: 'will be referenced::ORCID::0000'}}} as any;
//       expect(chipsComp.getWillBeReferencedContent(chip, metadata)).toEqual('ORCID::0000');
//
//       chip = { item: { 'dc.title': { authority: ''}}} as any;
//       expect(chipsComp.getWillBeReferencedContent(chip, metadata)).toEqual(null);
//     });
//
//   });
//
// });
//
// // declare a test component
// @Component({
//   selector: 'ds-test-cmp',
//   template: ``
// })
// class TestComponent {
//
//   public chips = new Chips(['a', 'b', 'c']);
//   public editable = true;
// }
