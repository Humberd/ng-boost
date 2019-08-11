import { TestBed } from '@angular/core/testing';
import { LocalRoleService } from './local-role.service';


describe('LocalPermissionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalRoleService = TestBed.get(LocalRoleService);
    expect(service).toBeTruthy();
  });
});
