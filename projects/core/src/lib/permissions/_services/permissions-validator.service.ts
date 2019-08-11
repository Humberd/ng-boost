import { Injectable } from '@angular/core';
import { Permission } from './roles-cache.service';

@Injectable()
export class PermissionsValidatorService {

  hasAllPermissions(
    currentPermissions: Permission[],
    desiredPermissions: Permission[]
  ) {
    return desiredPermissions.every((permission) => currentPermissions.indexOf(permission) >= 0);
  }

  hasSomePermissions(
    currentPermissions: Permission[],
    desiredPermissions: Permission[]
  ) {
    return desiredPermissions.some((permission) => currentPermissions.indexOf(permission) >= 0);
  }
}
