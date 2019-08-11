import { Injectable } from '@angular/core';
import { Permission, Role, RolesCacheService } from './roles-cache.service';
import { PermissionsValidatorService } from './permissions-validator.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LocalRoleService {
  constructor(
    private rolesCacheService: RolesCacheService,
    private permissionsValidatorService: PermissionsValidatorService
  ) {
  }

  hasPermission(
    permissions: Permission[],
    forRole: Role
  ): Observable<boolean> {
    return this.rolesCacheService.get$(forRole)
      .pipe(
        map((rolePermissions) => this.permissionsValidatorService.hasSomePermissions(rolePermissions, permissions))
      );
  }
}
