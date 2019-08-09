import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Permission = string;
export type PermissionInput = Permission | Permission[];

@Injectable({
  providedIn: 'root'
})
export class BoostPermissionsService {
  private readonly _permissions$ = new BehaviorSubject<Permission[]>([]);
  permissions$ = this._permissions$.asObservable();

  loadPermissions(permissionsInput: PermissionInput) {
    const permissions = this.toPermissionsArray(permissionsInput);

    this._permissions$.next(Array.from(new Set(permissions)));

  }

  addPermissions(permissionsInput: PermissionInput) {
    const permissions = this.toPermissionsArray(permissionsInput);

    this._permissions$.next(Array.from(new Set([
      ...this._permissions$.value,
      ...permissions
    ])));
  }

  hasPermissions(permissionsInput: PermissionInput) {
    const permissions = this.toPermissionsArray(permissionsInput);

    return permissions.every((permission) => this._permissions$.value.indexOf(permission) >= 0);
  }

  removePermissions(permissionsInput: PermissionInput) {
    const permissions = this.toPermissionsArray(permissionsInput);

    this._permissions$.next(
      this._permissions$.value.filter(
        it => !permissions.includes(it))
    );
  }


  private toPermissionsArray(permissionsInput: PermissionInput) {
    return Array.isArray(permissionsInput) ? permissionsInput : [permissionsInput];
  }

}
