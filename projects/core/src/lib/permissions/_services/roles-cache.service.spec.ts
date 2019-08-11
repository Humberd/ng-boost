import { TestBed } from '@angular/core/testing';

import { RolesCacheService } from './roles-cache.service';

describe('RolesCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RolesCacheService = TestBed.get(RolesCacheService);
    expect(service).toBeTruthy();
  });
});
