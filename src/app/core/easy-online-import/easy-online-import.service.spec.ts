import { TestBed } from '@angular/core/testing';

import { EasyOnlineImportService } from './easy-online-import.service';

describe('EasyOnlineImportService', () => {
  let service: EasyOnlineImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EasyOnlineImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
