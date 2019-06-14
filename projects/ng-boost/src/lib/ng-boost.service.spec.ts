import { TestBed } from '@angular/core/testing';

import { NgBoostService } from './ng-boost.service';

describe('NgBoostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgBoostService = TestBed.get(NgBoostService);
    expect(service).toBeTruthy();
  });
});
