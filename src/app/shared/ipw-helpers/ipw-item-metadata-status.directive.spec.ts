import { ElementRef, Renderer2 } from '@angular/core';
import { IpwItemMetadataStatusDirective } from './ipw-item-metadata-status.directive';

describe('IpwItemMetadataStatusDirective', () => {
  let directive: IpwItemMetadataStatusDirective;

  let elem: ElementRef;
  let renderer: jasmine.SpyObj<Renderer2>;

  beforeEach(() => {
    elem = {
      nativeElement: {}
    };
    renderer = jasmine.createSpyObj('renderer', ['addClass', 'removeClass', 'setStyle']);
    directive = new IpwItemMetadataStatusDirective(elem, renderer);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
