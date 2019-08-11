import { TestBed } from '@angular/core/testing';

import { PermissionsValidatorService } from './permissions-validator.service';

describe('PermissionsValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PermissionsValidatorService = TestBed.get(PermissionsValidatorService);
    expect(service).toBeTruthy();
  });
});
