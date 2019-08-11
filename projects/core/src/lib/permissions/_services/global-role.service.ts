import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Permission, Role, RolesCacheService } from './roles-cache.service';
import { filter, map, switchMap } from 'rxjs/operators';
import { PermissionsValidatorService } from './permissions-validator.service';

const NOT_INITIALIZED = undefined;

@Injectable()
export class GlobalRoleService {
  private readonly _globalRole$ = new BehaviorSubject<Role>(NOT_INITIALIZED);
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

  hasPermission(permissions: Permission[]): Observable<boolean> {
    return this.globalRole$
      .pipe(
        filter((it) => it !== NOT_INITIALIZED),
        switchMap((globalRole) => this.rolesCacheService.get$(globalRole)),
        map((rolePermissions) => this.permissionsValidatorService.hasSomePermissions(rolePermissions, permissions))
      );
  }

}
