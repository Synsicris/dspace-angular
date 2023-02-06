import { ElementRef, Renderer2 } from '@angular/core';
import { IpwItemMetadataInternalDirective } from './ipw-item-metadata-internal.directive';

describe('IpwItemMetadataInternalDirective', () => {
  let elem: ElementRef;
  let renderer: jasmine.SpyObj<Renderer2>;

  it('should create an instance', () => {
    const directive = new IpwItemMetadataInternalDirective(elem, renderer);
    expect(directive).toBeTruthy();
  });
});
