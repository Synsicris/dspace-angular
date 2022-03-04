import { TestBed } from '@angular/core/testing';

import { ProjectVersionService } from './project-version.service';

describe('ProjectVersion.ServiceService', () => {
  let service: ProjectVersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectVersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
