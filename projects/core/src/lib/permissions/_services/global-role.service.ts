import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EMPTY_ROLE, Permission, Role, RolesCacheService } from './roles-cache.service';
import { map, switchMap } from 'rxjs/operators';
import { PermissionsValidatorService } from './permissions-validator.service';

@Injectable()
export class GlobalRoleService {
  private readonly _globalRole$ = new BehaviorSubject<Role>(EMPTY_ROLE);
  globalRole$ = this._globalRole$.asObservable();

  get globalRole() {
    return this._globalRole$.value;
  }

  constructor(
    private rolesCacheService: RolesCacheService,
    private permissionsValidatorService: PermissionsValidatorService
  ) {
  }

  set(roleName: Role) {
    this.rolesCacheService.register(roleName);
    this._globalRole$.next(roleName);
  }

  clear() {
    this._globalRole$.next(EMPTY_ROLE);
  }

  hasPermission(permissions: Permission[]): Observable<boolean> {
    return this.globalRole$
      .pipe(
        switchMap((globalRole) => this.rolesCacheService.get$(globalRole)),
        map((rolePermissions) => this.permissionsValidatorService.hasSomePermissions(rolePermissions, permissions))
      );
  }

}
