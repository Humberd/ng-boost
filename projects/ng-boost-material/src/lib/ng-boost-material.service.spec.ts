import { TestBed } from '@angular/core/testing';

import { NgBoostMaterialService } from './ng-boost-material.service';

describe('NgBoostMaterialService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgBoostMaterialService = TestBed.get(NgBoostMaterialService);
    expect(service).toBeTruthy();
  });
});
