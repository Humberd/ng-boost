import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

const NOT_INITIALIZED = undefined;

export type Role = string;
export type Permission = string;

export const PERMISSIONS_LOADER = new InjectionToken('Permissions loader');

export interface PermissionsLoader {
  load(roleName: Role): Observable<Permission[]>;
}

@Injectable()
export class RolesCacheService {
  private readonly roles = new Map<Role, BehaviorSubject<Permission[]>>();

  constructor(@Inject(PERMISSIONS_LOADER) private permissionsLoader: PermissionsLoader) {

  }

  register(roleName: Role) {
    if (this.roles.has(roleName)) {
      return;
    }

    this.roles.set(roleName, new BehaviorSubject(NOT_INITIALIZED));

    this.flush(roleName);
  }

  get$(roleName: Role): Observable<Permission[]> {
    if (!this.roles.has(roleName)) {
      this.register(roleName);
    }

    return this.roles.get(roleName)
      .pipe(
        filter((permissions) => permissions !== NOT_INITIALIZED)
      );
  }

  get(roleName: Role): Permission[] {
    if (!this.roles.has(roleName)) {
      this.register(roleName);
    }

    const permissions = this.roles.get(roleName).value;
    if (permissions === NOT_INITIALIZED) {
      return [];
    }

    return permissions;
  }

  remove(roleName: Role) {
    if (!this.roles.has(roleName)) {
      return;
    }

    this.roles.get(roleName).complete();
    this.roles.delete(roleName);
  }

  flush(roleName: Role) {
    this.permissionsLoader.load(roleName)
      .subscribe((permissions) => {
        const subject = this.roles.get(roleName);
        subject.next(permissions);
      });
  }

  flushAll() {
    this.roles.forEach((
      _,
      roleName
    ) => {
      this.flush(roleName);
    });
  }
}
