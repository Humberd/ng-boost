import { TestBed } from '@angular/core/testing';

import { BoostPermissionsService } from './boost-permissions.service';

describe('PermissionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoostPermissionsService = TestBed.get(BoostPermissionsService);
    expect(service).toBeTruthy();
  });
});
